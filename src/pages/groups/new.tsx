import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useContext, useState } from "react";


function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const { fetchWithAuth } = useContext(AuthContext);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
        console.error('Group creation failed.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
      <h1>Create a New Group</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </label>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateGroup;
