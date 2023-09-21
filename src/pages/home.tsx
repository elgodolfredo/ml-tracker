import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Group } from '@/utils/interfaces';
import { AuthContext } from '@/contexts/AuthContext';
import { Box, Heading, Text, Button, Link as ChakraLink, Flex } from '@chakra-ui/react';
import NextLink from 'next/link'

export default function Home() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const { fetchWithAuth } = useContext(AuthContext);
  
  useEffect(() => {
    // Make a GET request to the get-groups API route
    fetchWithAuth('/api/groups')
      .then((response) => response.json())
      .then((data: Group[]) => {
        setGroups(data);
      })
      .catch((error) => {
        console.error('Error fetching groups:', error);
      });
  }, []);

  return (
    <Box p={4}>
    <Heading>Welcome!</Heading>

    <Box mt={4}>
      <Text>Create a new group to add products to it.</Text>
      <Button onClick={() => router.push('/groups/new')}>Create Group</Button>
    </Box>

    <Flex mt={4} flexWrap="wrap">
      {groups.map((group, index) => (
        <Box key={group.name} p={4}>
          <ChakraLink as={NextLink} href={`/groups/${group.key}`} key={index}>
            {group.name}
          </ChakraLink>
        </Box>
      ))}
    </Flex>
  </Box>
  )
}
