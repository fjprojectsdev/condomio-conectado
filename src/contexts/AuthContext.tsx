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
  clearCorruptedSession: () => Promise<void>;
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
    let isMounted = true;
    let hasInitialized = false;
    let authTimeout: NodeJS.Timeout;
    
    // Função para limpar estado e parar loading
    const clearAuthState = () => {
      if (isMounted) {
        setUser(null);
        setUserProfile(null);
        setUserRole(null);
        setLoading(false);
        hasInitialized = true;
      }
    };
    
    // Verificar sessão atual com timeout de segurança
    const getSession = async () => {
      if (!isMounted) return;
      
      console.log('🔍 Verificando sessão atual...');
      
      // Timeout de segurança para evitar loop infinito
      authTimeout = setTimeout(() => {
        console.log('⏰ Timeout de segurança - limpando estado');
        clearAuthState();
      }, 10000); // 10 segundos
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('📋 Resposta do getSession:', { session, error });
        
        // Limpar timeout se chegou aqui
        clearTimeout(authTimeout);
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error);
          clearAuthState();
          return;
        }
        
        // Verificação mais rigorosa da sessão
        if (session && session.user && session.access_token) {
          // Verificar se o token não expirou
          const now = Math.floor(Date.now() / 1000);
          const tokenExp = session.expires_at;
          
          if (tokenExp && now > tokenExp) {
            console.log('⏰ Token expirado, fazendo logout automático');
            await supabase.auth.signOut();
            clearAuthState();
            return;
          }
          
          console.log('✅ Usuário válido encontrado:', session.user.email);
          console.log('🔑 Token válido:', !!session.access_token);
          
          if (isMounted) {
            setUser(session.user);
            await fetchUserProfile(session.user.id, session.user);
            setLoading(false);
            hasInitialized = true;
          }
        } else {
          console.log('❌ Nenhuma sessão válida encontrada');
          console.log('   - Session exists:', !!session);
          console.log('   - User exists:', !!session?.user);
          console.log('   - Token exists:', !!session?.access_token);
          clearAuthState();
        }
      } catch (error) {
        console.error('💥 Erro inesperado ao verificar sessão:', error);
        clearTimeout(authTimeout);
        clearAuthState();
      }
    };

    getSession();

    // Escutar mudanças de autenticação com debounce
    let authChangeTimeout: NodeJS.Timeout;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        if (!isMounted) return;
        
        // Debounce para evitar múltiplas chamadas
        clearTimeout(authChangeTimeout);
        authChangeTimeout = setTimeout(async () => {
          if (!isMounted) return;
          
          if (session?.user) {
            setUser(session.user);
            await fetchUserProfile(session.user.id, session.user);
          } else {
            setUser(null);
            setUserProfile(null);
            setUserRole(null);
          }
          
          // Só definir loading como false se ainda não foi inicializado
          if (!hasInitialized) {
            setLoading(false);
            hasInitialized = true;
          }
        }, 100); // 100ms de debounce
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(authTimeout);
      clearTimeout(authChangeTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, currentUser?: any) => {
    try {
      const userToUse = currentUser || user;
      
      // Evitar buscar perfil se já temos um válido
      if (userProfile && userProfile.id === userId) {
        console.log('📋 Perfil já carregado, pulando busca...');
        return;
      }
      
      console.log('🔍 Buscando perfil do usuário:', userId);
      
      // Tentar buscar perfil salvo primeiro
      try {
        const { data: savedProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.log('⚠️ Erro ao buscar perfil:', profileError.message);
          throw profileError;
        }
        
        if (savedProfile && savedProfile.first_name) {
          console.log('✅ Perfil encontrado:', savedProfile.full_name);
          setUserProfile(savedProfile);
        } else {
          console.log('⚠️ Perfil sem nome, criando básico...');
          throw new Error('Perfil sem nome válido');
        }
      } catch (profileError) {
        console.log('📝 Criando perfil básico para usuário:', userId);
        // Se não encontrar, criar perfil básico
        const basicProfile = { 
          id: userId,
          email: userToUse?.email,
          full_name: userToUse?.email?.split('@')[0] || 'Usuário',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserProfile(basicProfile);
      }
      
      // Definir papel baseado no email
      const role: 'admin' | 'sindico' | 'morador' = userToUse?.email === 'fjprojects2025@gmail.com' ? 'admin' : 'morador';
      const userRoleData: UserRole = { 
        id: `role-${userId}`,
        user_id: userId,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('👤 Papel definido:', role);
      setUserRole(userRoleData);
      
    } catch (error) {
      console.error('❌ Erro ao configurar perfil:', error);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      
      // Limpar todos os estados locais primeiro
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
      
      // Fazer logout no Supabase
      await supabase.auth.signOut();
      
      // Limpar dados locais para garantir
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      console.log('✅ Logout concluído com sucesso');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
      // Mesmo com erro, limpar estados locais
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
    }
  };

  // Função para limpar sessão corrompida
  const clearCorruptedSession = async () => {
    try {
      console.log('🧹 Limpando sessão corrompida...');
      
      // Forçar logout
      await supabase.auth.signOut();
      
      // Limpar estados
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
      setLoading(false);
      
      // Limpar dados locais
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      console.log('✅ Sessão limpa com sucesso');
    } catch (error) {
      console.error('❌ Erro ao limpar sessão:', error);
      // Mesmo com erro, limpar estados
      setUser(null);
      setUserProfile(null);
      setUserRole(null);
      setLoading(false);
    }
  };

  const isAdmin = () => {
    // Verificar se é o email autorizado como admin
    if (user?.email === 'fjprojects2025@gmail.com') {
      return true;
    }
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
    
    // Verificar se é o email autorizado
    const currentEmail = user?.email;
    const isAuthorizedAdmin = currentEmail === 'fjprojects2025@gmail.com';
    
    // Criar usuário admin simulado com UUID válido
    const adminUser: User = {
      id: isAuthorizedAdmin ? user?.id || '00000000-0000-0000-0000-000000000001' : '00000000-0000-0000-0000-000000000001',
      email: isAuthorizedAdmin ? currentEmail : 'admin@condominio.com',
      created_at: new Date().toISOString()
    };
    
    // Definir usuário
    setUser(adminUser);
    
    // Criar perfil admin
    setUserProfile({
      id: adminUser.id,
      email: adminUser.email,
      full_name: isAuthorizedAdmin ? 'Administrador Principal' : 'Administrador',
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
    clearCorruptedSession,
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
