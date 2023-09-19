import fs from 'fs';
import path from 'path';

const groupsFilePath = path.join(process.cwd(), 'groups.json');

export default (req:any, res:any) => {
  if (req.method === 'GET') {
    const { productName } = req.query;

    // Read existing groups from the JSON file
    const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
    const groups = JSON.parse(groupsData);

    // Find the product with the matching ID
    let product = null;
    for (const group of groups) {
      product = group.products.find((p:any) => p.name === productName);
      if (product) break;
    }

    if (product) {
      // Respond with the product details
      res.status(200).json(product);
    } else {
      // Product not found
      res.status(404).json({ error: 'Product not found' });
    }

  } else if (req.method === 'POST') {
    const { productName } = req.query;

    // Read existing groups from the JSON file
    const groupsData = fs.readFileSync(groupsFilePath, 'utf-8');
    const groups = JSON.parse(groupsData);

    // Find the product with the matching ID
    let product = null;
    for (const group of groups) {
      product = group.products.find((p:any) => p.name === productName);
      if (product) break;
    }

    if (product) {
      // Parse the incoming JSON data for the new link
      const { href } = req.body;

      // Create a new link object
      const newLink = {
        href: href,
        lastPrice: 0,
      };

      // Add the new link to the product
      product.links.push(newLink);

      // Write the updated groups back to the JSON file
      fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));

      // Respond with a success message
      res.status(200).json({ message: 'Link added to the product successfully.' });
    } else {
      // Product not found
      res.status(404).json({ error: 'Product not found' });
    }
  } else {
    // Handle other HTTP methods if needed
    res.status(405).end(); // Method Not Allowed
  }
};