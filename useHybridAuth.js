import React, { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase'; // Sua config do Firebase
import { supabase } from '../lib/supabaseClient'; // Seu cliente Supabase
import { useNotifications } from './useNotifications'; // Hook de notificações que criamos

const AuthContext = createContext(null);

/**
 * Provedor de autenticação que gerencia o estado do usuário (Firebase + Supabase)
 * e integra com as notificações.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setupAndSaveToken } = useNotifications();

  useEffect(() => {
    // Listener que observa mudanças no estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // 1. Usuário logado no Firebase, agora buscamos seu perfil no Supabase
          const { data: profile, error: profileError } = await supabase
            .from('profiles') // ou 'users'
            .select('*')
            .eq('uid', firebaseUser.uid)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows found
            throw profileError;
          }
  
          // 2. Combinamos os dados do Firebase Auth com o perfil do Supabase
          setUser({
            ...firebaseUser,
            profile, // Contém roles, etc.
          });
  
          // 3. Após o login, configuramos e salvamos o token de notificação
          await setupAndSaveToken();
  
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Erro no onAuthStateChanged:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setupAndSaveToken]);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (e) {
      console.error("Erro no login com Google:", e);
      setError(e);
    }
  };

  const logout = async () => {
    await signOut(firebaseAuth);
  };

  const value = {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para acessar o contexto de autenticação em qualquer componente.
 * @returns {{
 *   user: object | null;
 *   loading: boolean;
 *   error: Error | null;
 *   loginWithGoogle: () => Promise<void>;
 *   logout: () => Promise<void>;
 * }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};