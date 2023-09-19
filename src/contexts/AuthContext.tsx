import React, { createContext, useContext, useEffect, useState } from 'react';
import {auth} from '../utils/firebase';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

type FirebaseContextType = {
  user: User | null;
  auth: ReturnType<typeof getAuth>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

export const AuthContext = createContext({
  user: null,
  auth: auth,
  fetchWithAuth: async (url: string, options?: RequestInit) => {
    throw new Error('Not implemented');
  }
} as FirebaseContextType);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const auth = getAuth();
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    // Listen for changes in Firebase Authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the subscription when unmounting
    return () => unsubscribe();
  }, [auth]);

  const fetchWithAuth = async (url: string, options?: RequestInit): Promise<Response> => {
    if (!user) {
      throw new Error('User is not authenticated.');
    }
  
    const idToken = await user.getIdToken();
    const headers = {
      ...options?.headers,
      'Authorization': `Bearer ${idToken}`,
    };
  
    return await fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ user, auth, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}