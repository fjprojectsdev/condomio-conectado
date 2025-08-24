import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface User {
  id: string;
  email?: string;
  created_at?: string;
}

interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  apartamento?: string;
  telefone?: string;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'sindico' | 'morador';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isSindico: () => boolean;
  hasPermission: (permission: string) => boolean;
  supabase: typeof supabase;
  loginAsAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      console.log('🔍 Verificando sessão atual...');
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('📋 Resposta do getSession:', { session, error });
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error);
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
          setLoading(false);
          return;
        }
        
        // Verificação mais rigorosa
        if (session && session.user && session.access_token) {
          console.log('✅ Usuário válido encontrado:', session.user.email);
          console.log('🔑 Token válido:', !!session.access_token);
          setUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
        } else {
          console.log('❌ Nenhuma sessão válida encontrada');
          console.log('   - Session exists:', !!session);
          console.log('   - User exists:', !!session?.user);
          console.log('   - Token exists:', !!session?.access_token);
          setUser(null);
          setUserProfile(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('💥 Erro inesperado ao verificar sessão:', error);
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
      }
      
      setLoading(false);
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
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

  const fetchUserProfile = async (userId: string, currentUser?: any) => {
    try {
      const userToUse = currentUser || user;
      
      // Tentar buscar perfil salvo primeiro
      try {
        const { data: savedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (savedProfile && savedProfile.first_name) {
          setUserProfile(savedProfile);
        } else {
          throw new Error('Perfil não encontrado');
        }
      } catch {
        // Se não encontrar, criar perfil básico
        setUserProfile({ 
          id: userId,
          email: userToUse?.email,
          full_name: userToUse?.email?.split('@')[0] || 'Usuário',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      // Papel padrão (morador)
      setUserRole({ 
        id: '',
        user_id: userId,
        role: 'morador',
        created_at: '',
        updated_at: ''
      });
      
    } catch (error) {
      console.error('Erro ao configurar perfil:', error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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

  const hasPermission = (permission: string) => {
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

  const loginAsAdmin = () => {
    console.log('🔐 Fazendo login como administrador...');
    
    // Criar usuário admin simulado com UUID válido
    const adminUser: User = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@condominio.com',
      created_at: new Date().toISOString()
    };
    
    // Definir usuário
    setUser(adminUser);
    
    // Criar perfil admin
    setUserProfile({
      id: adminUser.id,
      email: adminUser.email,
      full_name: 'Administrador',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Definir papel como admin
    setUserRole({
      id: '00000000-0000-0000-0000-000000000002',
      user_id: adminUser.id,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Login admin concluído!');
  };

  const value: AuthContextType = {
    user,
    userProfile,
    userRole,
    loading,
    logout,
    isAdmin,
    isSindico,
    hasPermission,
    supabase,
    loginAsAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
