import fs from 'fs';
import path from 'path';

const groupsFilePath = path.join(process.cwd(), 'groups.json');

export default (req:any, res:any) => {
  if (req.method === 'GET') {
    // Read existing groups from the JSON file
    const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
    const groups = JSON.parse(groupsData);

    // Respond with the list of groups
    res.status(200).json(groups);
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};