import { Box, Flex, Spacer, Text, Button } from '@chakra-ui/react';
import { AuthContext } from '@/contexts/AuthContext'; // You'll need to create this context
import { useContext } from 'react';
import Link from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';

const Navbar = () => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <Box bg="teal.500" color="white" p={4}>
      <Flex alignItems="center">
      <Flex align="center" mr={5}>
        {/* Wrap the "Product Tracker" text with a Link component */}
        <ChakraLink href='/' fontSize="xl" fontWeight="bold">
          Product Tracker
        </ChakraLink>
      </Flex>
        <Spacer />
        {user ? (
          <Flex alignItems="center">
            <Text mr={2}>{user.displayName}</Text>
            <Button onClick={signOut}>Sign Out</Button>
          </Flex>
        ) : null}
      </Flex>
    </Box>
  );
};

export default Navbar;