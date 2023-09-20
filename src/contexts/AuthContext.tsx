import React, { createContext, useContext, useEffect, useState } from 'react';
import {auth, provider} from '../utils/firebase';
import { User, UserCredential, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';

type FirebaseContextType = {
  user: User | null;
  auth: ReturnType<typeof getAuth>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  waitingForAuth: boolean;
};

export const AuthContext = createContext({
  user: null,
  auth: auth,
  fetchWithAuth: async (url: string, options?: RequestInit) => {
    throw new Error('Not implemented');
  },
  signOut: async () => {
    throw new Error('Not implemented');
  },
  signInWithGoogle: async () => {
    throw new Error('Not implemented');
  },
  waitingForAuth: true,
} as FirebaseContextType);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const auth = getAuth();
  const [user, setUser] = useState<User|null>(null);
  const [waitingForAuth, setWaitingForAuth] = useState(true);

  useEffect(() => {
    // Listen for changes in Firebase Authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setWaitingForAuth(false);
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

  const signInWithGoogle = async () => {
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, auth, fetchWithAuth, signInWithGoogle, signOut, waitingForAuth }}>
      {children}
    </AuthContext.Provider>
  );
}