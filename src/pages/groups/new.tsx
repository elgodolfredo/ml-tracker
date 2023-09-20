import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useContext, useState, FormEvent } from "react";
import {
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface CreateGroupProps {
  // Add any props here if needed
}

function CreateGroup({}: CreateGroupProps) {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchWithAuth } = useContext(AuthContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send a POST request to the create-group API route
      const response = await fetchWithAuth('/api/groups/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: groupName }),
      });

      if (response.ok) {
        // Group creation was successful, redirect to another page
        router.push('/');
      } else {
        // Handle errors here
        setError('Group creation failed.');
        console.error('Group creation failed.');
      }
    } catch (error) {
      setError('An error occurred.');
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Heading size="lg">Create a New Group</Heading>
      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <FormControl mt={4}>
          <Input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Create Group'}
        </Button>
      </form>
    </Box>
  );
}

export default CreateGroup;
