import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

function LoginWithGmail() {
  const { signInWithGoogle, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <Center>
      <Box p={8} borderWidth={1} borderRadius="md" boxShadow="lg">
        <Heading as="h1" size="xl" mb={4}>
          Welcome to Product Tracker
        </Heading>
        <Text fontSize="lg" mb={4}>
          Log in with your Google account to start tracking your products.
        </Text>
        <Button
          colorScheme="teal"
          size="lg"
          onClick={handleSignInWithGoogle}
          mb={4}
        >
          Log in with Gmail
        </Button>
        <Text fontSize="sm" color="gray.500">
          By clicking "Log in with Gmail," you agree to our Terms of Service
          and Privacy Policy.
        </Text>
      </Box>
    </Center>
  );
}

export default LoginWithGmail;
