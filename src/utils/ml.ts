export const getLinkDetails = async (link: string): Promise<any|null> => {
  // Extract the item ID from the URL
  let itemIdMatch = link.match(/item_id\:([A-Za-z0-9]+)/);
  if (!itemIdMatch) {
    // extract id from links like this form: https://articulo.mercadolibre.com.ar/MLA-1365437445
    itemIdMatch = link.match(/MLA\-([A-Za-z0-9]+)/);
    if (!itemIdMatch) {
      // try to extract from links like this form: https://www.mercadolibre.com.ar/mochilas-deportivas-everlast-urbana-mujer-hombrellavero-color-gris-16062/p/MLA26678890
      itemIdMatch = link.match(/\/p\/(MLA[A-Za-z0-9]+)/);
      if ( !itemIdMatch ) {
        return null;
      }
    } else {
      itemIdMatch[1] = itemIdMatch[0].replace(/-/g, '');
    }
  }

  const itemId = itemIdMatch[1];

  // Make a request to the external API to get item details
  const url = `https://api.mercadolibre.com/items?ids=${itemId}`;
  const response = await fetch(url);

  // Check if the request was successful
  // const data = await response.json();
  if (response.status === 200) {
    // Parse the response body
    return await response.json();
  }
  return null;
}