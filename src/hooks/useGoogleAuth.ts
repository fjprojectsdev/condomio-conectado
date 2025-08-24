import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { supabase } = useAuth();

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Salvar no Supabase
      await supabase.from('users').upsert({
        uid: user.uid,
        email: user.email,
        full_name: user.displayName,
        avatar_url: user.photoURL,
        provider: 'google'
      });

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading };
};