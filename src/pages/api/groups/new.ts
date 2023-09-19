import fs from 'fs';
import path from 'path';

const groupsFilePath = path.join(process.cwd(), 'groups.json');

export default (req: any, res: any) => {
  if (req.method === 'POST') {
    // Parse the incoming JSON data
    const { name } = req.body;

    // Read existing groups from the JSON file
    const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
    const groups = JSON.parse(groupsData);

    // Create a new group object
    const newGroup = { name, products: [] };

    // Add the new group to the existing groups
    groups.push(newGroup);

    // Write the updated groups back to the JSON file
    fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));

    // Respond with a success message
    res.status(200).json({ message: 'Group created successfully.' });
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};