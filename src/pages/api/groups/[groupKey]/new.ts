import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin'; // Import the firebase-admin module you created
import { Product } from '@/utils/interfaces';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { groupKey } = req.query;

      if (!groupKey) {
        res.status(400).json({ error: 'Missing groupKey parameter' });
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
          // Parse the incoming JSON data for the new product
          const { name, basePrice } = req.body;

          // Create a new product object
          const newProduct: Product = {
            name,
            key: '',
            basePrice,
            avgLastPrice: basePrice,
          };

          // Add the new product to the group's "products" array in the Realtime Database
          const productRef = userGroupsRef.child('products').push();
          newProduct.key = productRef.key!;
          await productRef.set(newProduct);

          // Respond with a success message
          res.status(200).json({ message: 'Product added to the group successfully.' });
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
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};
