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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'; // Import the delete icon
import GroupHeading from '@/components/GroupHeading';

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
  const [editedGroupName, setEditedGroupName] = useState(group?.name || '');
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const { fetchWithAuth } = useContext(AuthContext);
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure()

  useEffect(() => {
    // Fetch the group data and products based on groupKey
    if (groupKey) {
      // Make an API request to retrieve the group details
      fetchWithAuth(`/api/groups/${groupKey}`)
        .then((response) => response.json())
        .then((data: Group) => {
          setGroup(data);
          setEditedGroupName(data.name);
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

  const toggleEditGroupName = () => {
    setIsEditingGroupName(!isEditingGroupName);
  };

  const handleSaveGroupName = async () => {
    try {
      // Make an API request to update the group name
      const response = await fetchWithAuth(`/api/groups/${groupKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedGroupName }),
      });

      if (response.ok) {
        // Update the group's name in the UI
        setGroup((prevGroup) => ({
          ...prevGroup,
          name: editedGroupName,
          key: groupKey as string,
        }));

        // Exit editing mode
        setIsEditingGroupName(false);
      } else {
        setError('Group name update failed.');
        console.error('Group name update failed.');
      }
    } catch (error) {
      setError('An error occurred.');
      console.error('An error occurred:', error);
    }
  };

  const handleRemoveProduct = async (productKey: string) => {
    try {
      // Make an API request to remove the product from the group
      const response = await fetchWithAuth(`/api/groups/${groupKey}/products/${productKey}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the group data to reflect the updated list of products
        const updatedGroupResponse = await fetchWithAuth(`/api/groups/${groupKey}`);
        const updatedGroupData = await updatedGroupResponse.json();
        setGroup(updatedGroupData);
        calculateNewTotals(updatedGroupData);
      } else {
        setError('Product removal failed.');
        console.error('Product removal failed.');
      }
    } catch (error) {
      setError('An error occurred.');
      console.error('An error occurred:', error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      // Make an API request to remove the product from the group
      const response = await fetchWithAuth(`/api/groups/${groupKey}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push("/");
      } else {
        setError('Product removal failed.');
        console.error('Product removal failed.');
      }
    } catch (error) {
      setError('An error occurred.');
      console.error('An error occurred:', error);
    }
  };

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
              {/* Use the GroupHeading component */}
              <GroupHeading
                groupName={group?.name || ''}
                onEditClick={toggleEditGroupName}
                onGroupNameChange={setEditedGroupName}
                onSaveClick={handleSaveGroupName}
                onCancelClick={() => setIsEditingGroupName(false)}
                onDeleteClick={onOpenDelete}
                isEditing={isEditingGroupName}
                editedGroupName={editedGroupName}
              />
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
                  <ListItem key={index} maxW="600px">
                    <Flex justifyContent="space-between" alignItems="center">
                      <ChakraLink as={NextLink} href={`/groups/${groupKey}/products/${product.key}`} textDecoration="none">
                        <Text fontSize="md">{product.name}</Text>
                      </ChakraLink>
                      <Text fontSize="md" textAlign="right">
                        {formatCurrency(product.basePrice)}
                        {"->"} {formatCurrency(product.avgLastPrice)}
                        <IconButton
                          aria-label={`Remove ${product.name}`}
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          ml={2}
                          onClick={() => handleRemoveProduct(product.key)}
                        />
                      </Text>
                    </Flex>
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
      <DeleteGroupModal isOpen={isOpenDelete} onClose={onCloseDelete} handleDeleteGroup={handleDeleteGroup}></DeleteGroupModal>
    </Box>
  );
}

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDeleteGroup: () => void;
}

function DeleteGroupModal(props: DeleteGroupModalProps) {
  const { isOpen, onClose, handleDeleteGroup } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this group? This action cannot be reversed.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme='red' onClick={handleDeleteGroup}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default GroupDetails;
