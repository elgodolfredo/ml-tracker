import fs from 'fs';
import path from 'path';

const groupsFilePath = path.join(process.cwd(), 'groups.json');

export default (req:any, res:any) => {
  if (req.method === 'POST') {
    const { groupName } = req.query;

    // Read existing groups from the JSON file
    const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
    const groups = JSON.parse(groupsData);

    // Find the group with the matching ID
    const groupIndex = groups.findIndex((g:any) => g.name === groupName);

    if (groupIndex !== -1) {
      // Parse the incoming JSON data for the new product
      const { name, basePrice } = req.body;

      // Create a new product object
      const newProduct = {
        id: Date.now(), // Generate a unique ID (you can use any method for generating unique IDs)
        name,
        basePrice,
        links: [],
      };

      // Add the new product to the group
      groups[groupIndex].products.push(newProduct);

      // Write the updated groups back to the JSON file
      fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));

      // Respond with a success message
      res.status(200).json({ message: 'Product added to the group successfully.' });
    } else {
      // Group not found
      res.status(404).json({ error: 'Group not found' });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};