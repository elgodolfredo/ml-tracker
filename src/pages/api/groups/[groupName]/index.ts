import fs from 'fs';
import path from 'path';

const groupsFilePath = path.join(process.cwd(), 'groups.json');

export default (req:any, res:any) => {
  if (req.method === 'GET') {
    const { groupName } = req.query;

    // Read existing groups from the JSON file
    const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
    const groups = JSON.parse(groupsData);

    // Find the group with the matching ID
    const group = groups.find((g:any) => g.name === groupName);

    if (group) {
      // Respond with the group details
      res.status(200).json(group);
    } else {
      // Group not found
      res.status(404).json({ error: 'Group not found' });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};