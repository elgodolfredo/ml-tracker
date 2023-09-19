import { useEffect, useState } from 'react';
import { auth } from '@/utils/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Index () {
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // If the user is already signed in, redirect to home page
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/home');
      }
    });
    return () => {
      unsub();
    };
  }, []);
  const handleSignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Sign in with Google using Firebase Auth
      const result = await signInWithPopup(auth, provider);

      // The user is signed in with Google
      console.log('Successfully signed in with Google', result.user);
      router.push('/home');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
      {error && <p>{error}</p>}
    </div>
  );
};
