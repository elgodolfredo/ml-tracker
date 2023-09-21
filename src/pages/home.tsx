import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Group } from '@/utils/interfaces';
import { AuthContext } from '@/contexts/AuthContext';
import {
  Box,
  Heading,
  Text,
  Button,
  Link as ChakraLink,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { formatCurrency } from '@/utils';

export default function Home() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const { fetchWithAuth } = useContext(AuthContext);

  useEffect(() => {
    // Make a GET request to the get-groups API route
    fetchWithAuth('/api/groups')
      .then((response) => response.json())
      .then((data: Group[]) => {
        setGroups(data);
        setIsLoading(false); // Turn off loading state
      })
      .catch((error) => {
        console.error('Error fetching groups:', error);
        setIsLoading(false); // Turn off loading state in case of an error
      });
  }, []);

  return (
    <Box p={4}>
      <Heading>Welcome!</Heading>

      <Box mt={4} ms={3}>
        <Text>Create a new group to add products to it.</Text>
        <Button onClick={() => router.push('/groups/new')}>Create Group</Button>
      </Box>

      <Flex
        mt={4}
        flexWrap="wrap"
        style={{
          opacity: isLoading ? 0 : 1, // Apply fade-in effect
          transform: isLoading ? 'translateY(-10px)' : 'translateY(0)', // Apply translateY animation
          transition: 'opacity 0.5s, transform 0.5s', // Apply transitions
        }}
      >
        {isLoading ? (
          <Flex
            justify="center"
            align="center"
            h="200px"
            w="100%" // Set width to 100% to center the spinner
          >
            <Spinner size="xl" color="teal.500" />
          </Flex>
        ) : (
          groups.map((group, index) => (
            <ChakraLink
              key={group.name}
              as={NextLink}
              href={`/groups/${group.key}`}
              textDecoration="none"
            >
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                _hover={{
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s',
                }}
                bg="teal.100" // Lighter background color
                color="teal.800" // Text color
                minW="200px" // Set minimum width for the Box
                margin="0.5rem" // Add margin to separate the boxes
              >
                <Text fontSize="xl" fontWeight="bold">
                  {group.name}
                </Text>
                <Text fontSize="sm" mt={2}>
                  {group.totalLastPrice !== undefined && (
                    <>
                      Total Last Price: {formatCurrency(group.totalLastPrice)}{' '}
                      <br />
                    </>
                  )}
                  Products: {group.numProducts}
                </Text>
              </Box>
            </ChakraLink>
          ))
        )}
      </Flex>
    </Box>
  );
}
