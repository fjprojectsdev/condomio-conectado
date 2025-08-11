import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getUser, signOut } from '../lib/auth';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileError && profile) {
        setUserProfile(profile);
      } else if (profileError && profileError.code === 'PGRST116') {
        // Perfil não existe, criar um básico
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: user?.email,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (!createError) {
          setUserProfile(newProfile);
        }
      }

      // Buscar papel/função do usuário
      const { data: role, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!roleError && role) {
        setUserRole(role);
      } else {
        // Usuário padrão (morador)
        setUserRole({ role: 'morador', user_id: userId });
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isAdmin = () => {
    return userRole?.role === 'admin' || userRole?.role === 'sindico';
  };

  const isSindico = () => {
    return userRole?.role === 'sindico';
  };

  const hasPermission = (permission) => {
    if (!userRole) return false;
    
    // Admins e síndicos têm todas as permissões
    if (isAdmin()) return true;
    
    // Moradores têm permissões básicas
    const moradorPermissions = [
      'view_comunicados',
      'view_coleta_lixo',
      'view_encomendas',
      'create_sugestoes',
      'view_servicos',
      'create_classificados',
      'create_agendamentos'
    ];
    
    return moradorPermissions.includes(permission);
  };

  const value = {
    user,
    userProfile,
    userRole,
    loading,
    logout,
    isAdmin,
    isSindico,
    hasPermission,
    supabase // Expor cliente Supabase para casos especiais
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
