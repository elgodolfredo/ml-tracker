import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin'; // Import the firebase-admin module you created

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { groupKey } = req.query;

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
          // Respond with the group details
          group.products = Object.values(group.products || []);
          res.status(200).json(group);
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
  } else if (req.method === 'PUT') {
    try {
      const { groupKey } = req.query;
      const { name } = req.body;
  
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
  
      // Update the group name in the Realtime Database
      await userGroupsRef.update({ name });
  
      // Respond with a success message or the updated group data
      res.status(200).json({ message: 'Group name updated successfully' });
    } catch (error) {
      console.error('Firebase error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};
