import { Box, Flex, Spacer, Text, Button } from '@chakra-ui/react';
import { AuthContext } from '@/contexts/AuthContext'; // You'll need to create this context
import { useContext } from 'react';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { user, signOut } = useContext(AuthContext);
  const router = useRouter();
  const onClickSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <Box bg="teal.500" color="white" p={4}>
      <Flex alignItems="center">
      <Flex align="center" mr={5}>
        {/* Wrap the "Product Tracker" text with a Link component */}
        <ChakraLink as={NextLink} href='/' fontSize="xl" fontWeight="bold">
          Product Tracker
        </ChakraLink>
      </Flex>
        <Spacer />
        {user ? (
          <Flex alignItems="center">
            <Text mr={2}>{user.displayName}</Text>
            <Button onClick={onClickSignOut}>Sign Out</Button>
          </Flex>
        ) : null}
      </Flex>
    </Box>
  );
};

export default Navbar;