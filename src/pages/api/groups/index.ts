import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
        res.status(200).json(Object.values(userGroups));
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