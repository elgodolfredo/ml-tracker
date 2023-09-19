import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css'
import { useRouter } from 'next/router'
import { Group } from '@/utils/interfaces';
import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthContext';

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
    <>
      <div className={styles.description}>
        <h1>Welcome!</h1>
      </div>

      <div>
        <div>
          {groups.map((group, index) => (
            <div key={group.name}>
              <Link href={`/groups/${group.name}`} key={index}>{group.name}</Link>
            </div>
          ))}
        </div>
        <p>Create a new group to add products to it.</p>
        <button onClick={() => {router.push('/groups/new')}}>Create Group</button>
      </div>
    </>
  )
}
