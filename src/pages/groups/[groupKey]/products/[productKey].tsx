import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/utils/interfaces';
import { formatCurrency } from '@/utils';
import { AuthContext } from '@/contexts/AuthContext';

function ProductDetails() {
  const router = useRouter();
  const { groupKey, productKey } = router.query;
  const [href, setHref] = useState('');
  const [product, setProduct] = useState<Product|null>(null);
  const { fetchWithAuth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the product data based on productName
    if (productKey) {
      // Make an API request to retrieve the product details
      fetchWithAuth(`/api/groups/${groupKey}/products/${productKey}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
        })
        .catch((error) => {
          console.error('Error fetching product details:', error);
        });
    }
  }, [productKey]);

  const handleAddLink = async (e: any) => {
    e.preventDefault();

    // Create a new link object
    const newLink = {
      href: href,
    };

    // Make an API request to add the link to the product
    const response = await fetchWithAuth(`/api/groups/${groupKey}/products/${productKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newLink),
    });

    if (response.ok) {
      // Clear the form fields after successfully adding the link
      setHref('');
      // Refresh the product data to reflect the new link
      const updatedProductResponse = await fetchWithAuth(`/api/groups/${groupKey}/products/${productKey}`);
      const updatedProductData = await updatedProductResponse.json();
      setProduct(updatedProductData);
    } else {
      console.error('Link creation failed.');
    }
  };

  return (
    <div>
      {product ? (
        <>
          <h1>{product.name} Details</h1>
          <p>Base Price: {formatCurrency(product.basePrice)}</p>
          <h2>Links:</h2>
          <ul>
            {product.links && product.links.map((link, index) => (
              <li key={index}>
                Last Price: {formatCurrency(link.lastPrice)}
              </li>
            ))}
          </ul>
          <h2>Add a New Link:</h2>
          <form onSubmit={handleAddLink}>
            <label>
              Link:
              <input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                required
              />
            </label>
            <button type="submit">Add Link</button>
          </form>
        </>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default ProductDetails;