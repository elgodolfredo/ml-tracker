import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Group, Product } from '@/utils/interfaces';
import { formatCurrency } from '@/utils';
import { AuthContext } from '@/contexts/AuthContext';
import {
  Box,
  Heading,
  List,
  ListItem,
  FormControl,
  Link as ChakraLink,
  Input,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Flex,
  Text,
  Spacer,
} from '@chakra-ui/react';
import NextLink from 'next/link';

function GroupDetails() {
  const router = useRouter();
  const { groupKey } = router.query;
  const [group, setGroup] = useState<Group | null>(null);
  const [productName, setProductName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [total, setTotal] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the group data and products based on groupKey
    if (groupKey) {
      // Make an API request to retrieve the group details
      fetchWithAuth(`/api/groups/${groupKey}`)
        .then((response) => response.json())
        .then((data: Group) => {
          setGroup(data);
          // Calculate the total
          calculateNewTotals(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching group details:', error);
          setError('Error fetching group details');
          setLoading(false);
        });
    }
  }, [groupKey]);

  const calculateNewTotals = (group: Group) => {
    if (!group.products) return;
    const newTotal = group?.products.reduce((total: number, product: Product) => {
      return total + product.basePrice;
    }, 0);
    const newLastPrice = group?.products.reduce((total: number, product: Product) => {
      return total + product.avgLastPrice;
    }, 0);
    setTotal(newTotal);
    setLastPrice(newLastPrice);
  }

  const handleAddProduct = async (e: any) => {
    e.preventDefault();

    // Create a new product object
    const newProduct = {
      name: productName,
      basePrice: parseFloat(basePrice),
    };

    try {
      // Make an API request to add the product to the group
      const response = await fetchWithAuth(`/api/groups/${groupKey}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        // Clear the form fields after successfully adding the product
        setProductName('');
        setBasePrice('');

        // Refresh the group data to reflect the new product
        const updatedGroupResponse = await fetchWithAuth(`/api/groups/${groupKey}`);
        const updatedGroupData = await updatedGroupResponse.json();
        setGroup(updatedGroupData);
        calculateNewTotals(updatedGroupData);
      } else {
        setError('Product creation failed.');
        console.error('Product creation failed.');
      }
    } catch (error) {
      setError('An error occurred.');
      console.error('An error occurred:', error);
    }
  }

  return (
    <Box p={4}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {error ? (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          ) : (
            <>
              <Heading size="lg">{group?.name}</Heading>
              <Box mb={4}>
                <Text>
                  <span>Total: {formatCurrency(total)}</span>
                </Text>
                <Text>
                  <span>Last Price: {formatCurrency(lastPrice)}</span>
                </Text>
                <Text>
                  <span>
                    Difference: 
                    <Badge 
                      colorScheme={lastPrice >= total ? 'green' : 'red'} 
                      ml={2}
                    >
                      {lastPrice >= total ? '+' : '-'} {formatCurrency(Math.abs(lastPrice - total))}
                    </Badge>
                  </span>
                </Text>
              </Box>
              <Heading size="md">Products:</Heading>
              <List mb={3}>
                {group?.products && group?.products.map((product, index) => (
                  <ListItem key={index}>
                    <ChakraLink as={NextLink} href={`/groups/${groupKey}/products/${product.key}`} textDecoration="none">
                    <Flex justifyContent="space-between" alignItems="center" maxW="400px"> {/* Adjust max width as needed */}
                      <Text fontSize="md">{product.name}</Text>
                      <Spacer />
                      <Text fontSize="md" textAlign="right">
                        Base Price: {formatCurrency(product.basePrice)}
                      </Text>
                    </Flex>
                    </ChakraLink>
                  </ListItem>
                ))}
              </List>
              <Heading size="md">Add a New Product:</Heading>
              <form onSubmit={handleAddProduct}>
                <FormControl mt={4}>
                  <Input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </FormControl>
                <FormControl mt={4}>
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="Enter base price"
                    required
                  />
                </FormControl>
                <Button mt={4} colorScheme="teal" type="submit">
                  Add Product
                </Button>
              </form>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default GroupDetails;
