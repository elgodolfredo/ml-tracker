import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin';
import { Group, Product } from '@/utils/interfaces';

const groupRoutes = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const db = admin.database();

    try {
      // Verify and decode the JWT token from the "Authorization" header
      const token = req.headers.authorization?.split(' ')[1]; // Extract the token part
      const decodedToken = await admin.auth().verifyIdToken(token!);

      if (!decodedToken || !decodedToken.uid) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const uid = decodedToken.uid;

      // Reference to the user's "groups" in the Realtime Database
      const userGroupsRef = db.ref(`/user_groups/${uid}/groups`);

      // Get data from the specified reference
      const snapshot = await userGroupsRef.get();

      if (snapshot.exists()) {
        // Extract the data from the snapshot
        const userGroups = snapshot.val();

        // Respond with the user's groups
        // res.status(200).json(Object.values(userGroups));
        const simplifiedGroups = Object.entries(userGroups).map(([key, group]: [string, any]) => ({
          key: key, // Include the key property
          name: group.name,
          totalLastPrice: calculateTotalLastPrice(group.products),
          numProducts: group.products ? Object.keys(group.products || {}).length : 0,
        }));

        // Respond with the simplified user's groups
        res.status(200).json(simplifiedGroups);

      } else {
        res.status(200).json([]);
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

export default groupRoutes;

function calculateTotalLastPrice(products: { [key: string]: Product }) {
  if (!products) return 0;

  let totalLastPrice = 0;
  for (const productKey in products) {
    totalLastPrice += products[productKey].avgLastPrice;
  }
  return totalLastPrice;
}
