import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin'; // Import the firebase-admin module you created
import { getLinkDetails } from '@/utils/ml';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      // Validate the presence of the "groupKey" query parameter
      const groupKey = req.query.groupKey as string | undefined;
      const productKey = req.query.productKey as string | undefined;

      if (!groupKey) {
        res.status(400).json({ error: 'Missing groupKey parameter' });
        return;
      }

      if (!productKey) {
        res.status(400).json({ error: 'Missing productKey parameter' });
        return;
      }

      // Verify the Firebase Authentication token from the "Authorization" header
      const token = req.headers.authorization?.split(' ')[1]; // Extract the token part
      const decodedToken = await admin.auth().verifyIdToken(token!);

      if (!decodedToken || !decodedToken.uid) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const uid = decodedToken.uid;

      // Access the Realtime Database using admin.database()
      const db = admin.database();

      // Reference to the user's "groups" in the Realtime Database
      const userGroupsRef = db.ref(`/user_groups/${uid}/groups/${groupKey}`);

      // Fetch data from the reference using an await approach
      const snapshot = await userGroupsRef.once('value');

      if (snapshot.exists()) {
        const group = snapshot.val();

        if (group) {
          if (req.method === 'POST') {
            // Parse the incoming JSON data for the new link
            const { href } = req.body;
            let lastPrice = 0;
            try {
              const data = await getLinkDetails(href);
              if (data && data.length > 0 && data[0].code !== 404) {
                lastPrice = data[0]?.body?.price;
              }
            } catch (error) {
              console.error('Error fetching link details:', error);
            }

            // Create a new link object
            const newLink = {
              key: '',
              href,
              lastPrice,
            };

            // Add the new link to the product
            const linkRef = userGroupsRef.child('products').child(productKey).child('links').push();
            newLink.key = linkRef.key!;
            await linkRef.set(newLink);

            // Respond with a success message
            res.status(200).json({ message: 'Link added to the product successfully.' });
          } else if ( req.method === 'GET' ){
            const productRef = userGroupsRef.child('products').child(productKey);
            const productSnapshot = await productRef.once('value');
            if (productSnapshot.exists()) {
              const product = productSnapshot.val();
              product.links = Object.values(product.links||[]);
              res.status(200).json(product);
            }
          }
        } else {
          // Group not found
          res.status(404).json({ error: 'Group not found' });
        }
      } else {
        // User has no groups
        res.status(404).json({ error: 'User has no groups' });
      }
    } catch (error) {
      console.error('Firebase error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') { // Handle DELETE requests
    try {
      const { groupKey, productKey } = req.query;

      // Validate the presence of groupKey and productKey
      if (!groupKey || !productKey) {
        res.status(400).json({ error: 'Missing groupKey or productKey parameter' });
        return;
      }

      // Verify the Firebase Authentication token from the "Authorization" header
      const token = req.headers.authorization?.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token!);

      if (!decodedToken || !decodedToken.uid) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const uid = decodedToken.uid;
      const db = admin.database();
      const userGroupsRef = db.ref(`/user_groups/${uid}/groups/${groupKey}`);

      // Check if the group exists
      const snapshot = await userGroupsRef.once('value');
      if (snapshot.exists()) {
        // Check if the product exists within the group
        const productRef = userGroupsRef.child('products').child(productKey as string);
        const productSnapshot = await productRef.once('value');
        
        if (productSnapshot.exists()) {
          // Remove the product
          await productRef.remove();
          res.status(200).json({ message: 'Product removed successfully.' });
        } else {
          res.status(404).json({ error: 'Product not found' });
        }
      } else {
        res.status(404).json({ error: 'Group not found' });
      }
    } catch (error) {
      console.error('Firebase error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end();
  }
};
