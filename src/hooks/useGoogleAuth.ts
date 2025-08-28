import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { loginAsAdmin } = useAuth();

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Usar Supabase OAuth com Google em vez do Firebase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Erro no login com Google:', error);
        return { user: null, error };
      }

      console.log('✅ Redirecionamento para Google OAuth iniciado');
      return { user: null, error: null };
    } catch (error: any) {
      console.error('💥 Erro inesperado no login com Google:', error);
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading };
};