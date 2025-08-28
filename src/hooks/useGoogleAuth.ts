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
      console.log('🚀 Iniciando login com Google via Firebase...');
      
      const provider = new GoogleAuthProvider();
      // Configurar escopos adicionais se necessário
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      console.log('✅ Login com Google realizado:', firebaseUser.email);
      console.log('🔑 UID do Firebase:', firebaseUser.uid);

      // Criar ou atualizar usuário no Supabase
      try {
        const { data: existingUser, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', firebaseUser.uid)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('❌ Erro ao buscar usuário existente:', fetchError);
        }

        if (!existingUser) {
          // Criar novo usuário no Supabase
          console.log('👤 Criando novo usuário no Supabase...');
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              first_name: firebaseUser.displayName?.split(' ')[0] || '',
              last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              full_name: firebaseUser.displayName || '',
              avatar_url: firebaseUser.photoURL || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('❌ Erro ao criar usuário no Supabase:', insertError);
          } else {
            console.log('✅ Usuário criado no Supabase com sucesso!');
          }
        } else {
          // Atualizar usuário existente
          console.log('🔄 Atualizando usuário existente no Supabase...');
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              email: firebaseUser.email,
              first_name: firebaseUser.displayName?.split(' ')[0] || existingUser.first_name,
              last_name: firebaseUser.displayName?.split(' ').slice(1).join(' ') || existingUser.last_name,
              full_name: firebaseUser.displayName || existingUser.full_name,
              avatar_url: firebaseUser.photoURL || existingUser.avatar_url,
              updated_at: new Date().toISOString()
            })
            .eq('id', firebaseUser.uid);

          if (updateError) {
            console.error('❌ Erro ao atualizar usuário no Supabase:', updateError);
          } else {
            console.log('✅ Usuário atualizado no Supabase com sucesso!');
          }
        }

        // Criar ou atualizar role do usuário
        try {
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({
              user_id: firebaseUser.uid,
              role: 'morador', // Role padrão para novos usuários
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });

          if (roleError) {
            console.error('❌ Erro ao configurar role do usuário:', roleError);
          } else {
            console.log('✅ Role do usuário configurada com sucesso!');
          }
        } catch (roleError) {
          console.error('❌ Erro ao configurar role:', roleError);
        }

      } catch (supabaseError) {
        console.error('❌ Erro geral no Supabase:', supabaseError);
      }

      // Simular login no contexto (mantém compatibilidade)
      loginAsAdmin();
      
      console.log('🎉 Login com Google concluído com sucesso!');
      return { user: firebaseUser, error: null };
      
    } catch (error: any) {
      console.error('💥 Erro no login com Google:', error);
      
      // Tratamento específico de erros comuns
      if (error.code === 'auth/popup-closed-by-user') {
        return { 
          user: null, 
          error: { message: 'Login cancelado pelo usuário' } 
        };
      }
      
      if (error.code === 'auth/popup-blocked') {
        return { 
          user: null, 
          error: { message: 'Popup bloqueado pelo navegador. Permita popups para este site.' } 
        };
      }
      
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading };
};