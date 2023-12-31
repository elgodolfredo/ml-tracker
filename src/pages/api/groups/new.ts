import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin';
import { Group } from '@/utils/interfaces';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
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
      const userGroupsRef = db.ref(`/user_groups/${uid}/groups`);

      // Parse the incoming JSON data
      const { name } = req.body;

      // Create a new group object
      const newGroup: Group = { 
        key: '',
        name, 
        products: [] 
      };

      // Push the new group to the user's "groups" in the Realtime Database
      const groupRef = userGroupsRef.push();
      newGroup.key = groupRef.key!;
      await groupRef.set(newGroup);

      // Respond with a success message
      res.status(200).json({ message: 'Group created successfully.' });
    } catch (error) {
      console.error('Firebase error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};
