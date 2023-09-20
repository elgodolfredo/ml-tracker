import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/utils/interfaces';
import { formatCurrency } from '@/utils';
import { AuthContext } from '@/contexts/AuthContext';
import {
  Box,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';

function ProductDetails() {
  const router = useRouter();
  const { groupKey, productKey } = router.query;
  const [href, setHref] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchWithAuth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the product data based on productName
    if (productKey) {
      // Make an API request to retrieve the product details
      fetchWithAuth(`/api/groups/${groupKey}/products/${productKey}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
          setLoading(false); // Mark loading as complete
        })
        .catch((error) => {
          console.error('Error fetching product details:', error);
          setLoading(false); // Mark loading as complete with an error
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
    <Box p={4}>
      {loading ? (
        <Heading>Loading product details...</Heading>
      ) : product ? (
        <>
          <Heading size="lg">{product.name}</Heading>
          <Text>Base Price: {formatCurrency(product.basePrice)}</Text>
          <Heading size="md" mt={4}>
            Links:
          </Heading>
          <UnorderedList styleType="none">
          {product.links && product.links.map((link, index) => (
              <ListItem key={index}>
                <Text><a href={link.href} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>{formatCurrency(link.lastPrice)}</a></Text>
              </ListItem>
            ))}
          </UnorderedList>
          <Heading size="md" mt={4}>
            Add a New Link:
          </Heading>
          <form onSubmit={handleAddLink}>
            <FormControl mt={2}>
              <Input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                required
                placeholder="Enter link"
              />
            </FormControl>
            <Button mt={2} colorScheme="teal" type="submit">
              Add Link
            </Button>
          </form>
        </>
      ) : (
        <Heading>Error loading product details</Heading>
      )}
    </Box>
  );
}

export default ProductDetails;