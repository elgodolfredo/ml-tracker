import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin'; // Import the firebase-admin module you created
import { getLinkDetails } from '@/utils/ml';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      // Access the Realtime Database using admin.database()
      const db = admin.database();

      // Reference to the groups data in the Realtime Database
      const userGroupsRef = db.ref('/user_groups');

      // Fetch the list of user UIDs from the "user_groups" node
      const userUIDsSnapshot = await userGroupsRef.once('value');
      const userUIDs = Object.keys(userUIDsSnapshot.val() || {});

      // Iterate through each user UID
      for (const uid of userUIDs) {
        // Reference to a user's "groups" data within their UID node
        const userGroupsDataRef = db.ref(`/user_groups/${uid}/groups`);

        // Fetch data from the user's "groups" data reference
        const userGroupsSnapshot = await userGroupsDataRef.once('value');

        if (userGroupsSnapshot.exists()) {
          const userGroups = userGroupsSnapshot.val();
          // Iterate through all groups and their products for this user
          for (const groupId in userGroups) {
            const group = userGroups[groupId];

            if ( !group.products ){
              continue;
            }

            for (const productKey of Object.keys(group.products)) {
              const product = group.products[productKey];

              let avgLastPrice = 0;
              let countPrices = 0;

              for (const linkKey of Object.keys(product.links)) {
                const link = product.links[linkKey];
                try {
                  const data = await getLinkDetails(link.href);
                  if ( !data ){
                    continue;
                  }
                  if (data.length === 0) {
                    continue;
                  }
                  if ( data[0].code === 404 ){
                    continue;
                  }

                  // Extract the lastPrice from the response
                  const lastPrice = data[0]?.body?.price;

                  if ( !lastPrice ){
                    continue;
                  }

                  // Add the lastPrice to the average
                  avgLastPrice += lastPrice;
                  countPrices++;

                  // Update the link's lastPrice
                  link.lastPrice = lastPrice;

                } catch (error) {
                  console.error('Error updating link:', error);
                }
              }
            if ( !countPrices ){ continue }
            product.avgLastPrice = avgLastPrice / countPrices;
          }
        }

        // Update the user's "groups" data with the modified data
        await userGroupsDataRef.set(userGroups);
      }
    }

    // Respond with a success message
    res.status(200).json({ message: 'All links updated successfully.' });
    } catch (error) {
      console.error('Error updating links:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
}