import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { supabase, loginAsAdmin } = useAuth();

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Criar usuário com dados do Google
      const adminUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        created_at: new Date().toISOString()
      };
      
      // Simular login no contexto
      loginAsAdmin();
      
      // Opcional: Salvar no Supabase para histórico
      try {
        await supabase.from('users').upsert({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: firebaseUser.displayName,
          avatar_url: firebaseUser.photoURL,
          provider: 'google'
        });
      } catch (supabaseError) {
        console.log('Erro ao salvar no Supabase (não crítico):', supabaseError);
      }

      return { user: firebaseUser, error: null };
    } catch (error: any) {
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading };
};