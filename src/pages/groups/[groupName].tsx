import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { Group, Product } from '@/utils/interfaces';
import Link from 'next/link';
import { formatCurrency } from '@/utils';
import { AuthContext } from '@/contexts/AuthContext';

function GroupDetails() {
  const router = useRouter();
  const { groupName } = router.query;
  const [group, setGroup] = useState<Group|null>(null);
  const [productName, setProductName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [total, setTotal] = useState(0);
  const [lastPrice, setLastPrice] = useState(0);
  const  {fetchWithAuth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch the group data and products based on groupName
    if (groupName) {
      // Make an API request to retrieve the group details
      fetchWithAuth(`/api/groups/${groupName}`)
        .then((response) => response.json())
        .then((data: Group) => {
          setGroup(data);
          // Calculate the total
          calculateNewTotals(data);
        })
        .catch((error) => {
          console.error('Error fetching group details:', error);
        });
    }
  }, [groupName]);

  const calculateNewTotals = (group: Group) => {
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

    // Make an API request to add the product to the group
    const response = await fetchWithAuth(`/api/groups/${groupName}/new`, {
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
        const updatedGroupResponse = await fetchWithAuth(`/api/groups/${groupName}`);
        const updatedGroupData = await updatedGroupResponse.json();
        setGroup(updatedGroupData);
        calculateNewTotals(updatedGroupData);
    } else {
    console.error('Product creation failed.');
    }
  }

  return (
    <div>
      {group ? (
        <>
          <h1>{group.name} Details</h1>
          <p>Total: {formatCurrency(total)}</p>
          <p>Last Price: {formatCurrency(lastPrice)}</p>
          <p>Difference: {lastPrice > total && ('+')} {formatCurrency(lastPrice - total)}</p>
          <h2>Products:</h2>
          <ul>
            {group.products.map((product, index) => (
              <li key={index}>
                <Link href={`/products/${product.name}`}>
                  {product.name} - Base Price: {formatCurrency(product.basePrice)}
                </Link>
              </li>
            ))}
          </ul>
          <h2>Add a New Product:</h2>
          <form onSubmit={handleAddProduct}>
            <label>
              Product Name:
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </label>
            <label>
              Base Price:
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
            </label>
            <button type="submit">Add Product</button>
          </form>
        </>
      ) : (
        <p>Loading group details...</p>
      )}
    </div>
  );
}

export default GroupDetails;