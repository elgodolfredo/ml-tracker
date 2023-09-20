import { NextApiRequest, NextApiResponse } from 'next';
import admin from '@/utils/firebaseAdmin'; // Import the firebase-admin module you created

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
          for (const groupId of Object.keys(userGroups)) {
            const group = userGroups[groupId];

            for (const productKey of Object.keys(group.products)) {
              const product = group.products[productKey];

            let avgLastPrice = 0;
            let countPrices = 0;

            for (const linkKey of Object.keys(product.links)) {
              const link = product.links[linkKey];
              try {
                // Extract the item ID from the URL
                let itemIdMatch = link.href.match(/item_id\:([A-Za-z0-9]+)/);
                if (!itemIdMatch) {
                  // extract id from links like this form: https://articulo.mercadolibre.com.ar/MLA-1365437445
                  itemIdMatch = link.href.match(/MLA\-([A-Za-z0-9]+)/);
                  itemIdMatch[1] = itemIdMatch[0].replace(/-/g, '');
                }

                const itemId = itemIdMatch[1];

                // Make a request to the external API to get item details
                const url = `https://api.mercadolibre.com/items?ids=${itemId}`;
                const response = await fetch(url);

                // Check if the request was successful
                // const data = await response.json();
                if (response.status === 200) {
                  // Parse the response body
                  const data = await response.json();
                  
                  // Extract the lastPrice from the response
                  const lastPrice = data[0]?.body?.price;

                  // Add the lastPrice to the average
                  avgLastPrice += lastPrice;
                  countPrices++;

                  // Update the link's lastPrice
                  link.lastPrice = lastPrice;
                }

              } catch (error) {
                console.error('Error updating link:', error);
              }
            }

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
};



// import fs from 'fs';
// import path from 'path';

// const groupsFilePath = path.join(process.cwd(), 'groups.json');

// export default async (req:any, res:any) => {
//   if (req.method === 'GET') {
//     try {
//       // Read existing groups from the JSON file
//       const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
//       const groups = JSON.parse(groupsData);

//       // Iterate over all products and their links
//       for (const group of groups) {
//         for (const product of group.products) {
//           let avgLastPrice = 0;
//           let countPrices = 0;
//           for (let link of product.links) {
//             try {
//               // Extract the item ID from the URL
//               let itemIdMatch = link.href.match(/item_id\:([A-Za-z0-9]+)/);
//               if (!itemIdMatch) {
//                 // extract id from links like this form: https://articulo.mercadolibre.com.ar/MLA-1365437445
//                 itemIdMatch = link.href.match(/MLA\-([A-Za-z0-9]+)/);
//                 itemIdMatch[1] = itemIdMatch[0].replace(/-/g, '');
//               }

//               const itemId = itemIdMatch[1];

//               // Make a request to the external API to get item details
//               const url = `https://api.mercadolibre.com/items?ids=${itemId}`;
//               const response = await fetch(url);

//               // Check if the request was successful
//               // const data = await response.json();
//               if (response.status === 200) {
//                 // Parse the response body
//                 const data = await response.json();
                  
//                 // Extract the lastPrice from the response
//                 const lastPrice = data[0]?.body?.price;

//                 // Add the lastPrice to the average
//                 avgLastPrice += lastPrice;
//                 countPrices++;

//                 // Update the link's lastPrice
//                 link.lastPrice = lastPrice;
//               }
//             } catch (error) {
//               console.error('Error updating link:', error);
//             }
//           }
//           product.avgLastPrice = avgLastPrice / countPrices;
//         }
//       }

//       // Write the updated groups back to the JSON file
//       fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));

//       // Respond with a success message
//       res.status(200).json({ message: 'All links updated successfully.' });
//     } catch (error) {
//       console.error('Error updating links:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } else {
//     // Handle other HTTP methods if needed
//     res.status(405).end(); // Method Not Allowed
//   }
// };