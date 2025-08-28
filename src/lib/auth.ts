import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AuthResponse {
  user?: any;
  session?: any;
  error?: any;
}

/**
 * Registra um novo usuário usando o sistema nativo do Supabase.
 * @param email - O email do usuário.
 * @param password - A senha do usuário (mínimo 6 caracteres).
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('🚀 Iniciando cadastro para:', email);
    
    // Determinar a URL de redirecionamento baseada no ambiente
    const redirectUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:8080/auth/callback'
      : 'https://condominioconectado.netlify.app/auth/callback';
    
    console.log('📧 URL de redirecionamento:', redirectUrl);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // URL para onde o usuário será redirecionado após confirmar o email
        emailRedirectTo: redirectUrl,
        data: {
          // Metadata adicional para o usuário
          signup_method: 'email_password'
        }
      }
    });
    
    if (error) {
      console.error('❌ Erro no cadastro:', error);
      
      // Tratamento específico de erros comuns
      if (error.message.includes('Email signups are disabled')) {
        return { 
          user: null, 
          error: { 
            message: 'Cadastros por email estão desabilitados. Entre em contato com o administrador.' 
          } 
        };
      }
      
      if (error.message.includes('User already registered')) {
        return { 
          user: null, 
          error: { 
            message: 'Este email já está cadastrado. Tente fazer login ou use outro email.' 
          } 
        };
      }
      
      return { user: data?.user, error };
    }
    
    console.log('✅ Cadastro realizado com sucesso!');
    console.log('📧 Email de confirmação enviado para:', data.user?.email);
    console.log('🔗 Link de confirmação enviado para o email');
    
    return { user: data.user, error: null };
  } catch (err) {
    console.error('💥 Erro inesperado no cadastro:', err);
    return { user: null, error: err };
  }
}

/**
 * Simula o envio de email com OTP (para desenvolvimento)
 */
function simulateEmailSend(email: string, otp: string) {
  console.log(`
📬 EMAIL SIMULADO PARA: ${email}`);
  console.log(`🔑 SEU CÓDIGO DE VERIFICAÇÃO: ${otp}`);
  console.log(`⏰ Válido por 10 minutos`);
  console.log(`└─ Use este código para confirmar sua conta\n`);
  
  // Mostrar alerta no navegador também
  if (typeof window !== 'undefined') {
    alert(`Código de verificação para ${email}: ${otp}\n\n(Em produção, este código seria enviado por email)`);
  }
}

/**
 * Confirma o email do usuário com OTP personalizado.
 * @param email - O email do usuário.
 * @param token - O token OTP de 6 dígitos.
 */
export async function confirmEmail(email: string, token: string): Promise<AuthResponse> {
  try {
    // 1. Verificar OTP personalizado
    const { data: isValid, error: verifyError } = await supabase
      .rpc('verify_otp', { user_email: email, user_otp: token });
    
    if (verifyError || !isValid) {
      return { 
        session: null, 
        error: { message: 'Código de verificação inválido ou expirado.' }
      };
    }
    
    // 2. Fazer login automático após verificação bem-sucedida
    // (Buscar credenciais temporárias do usuário)
    console.log('✅ OTP verificado com sucesso para:', email);
    
    return { 
      session: { user: { email } }, 
      error: null 
    };
    
  } catch (err) {
    return { 
      session: null, 
      error: { message: 'Erro ao verificar código.' }
    };
  }
}

/**
 * Realiza o login do usuário.
 * @param email - O email do usuário.
 * @param password - A senha do usuário.
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, error };
}

/**
 * Envia um email de redefinição de senha.
 * @param email - O email do usuário.
 */
export async function resetPasswordForEmail(email: string): Promise<{ error?: any }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return { error };
}

/**
 * Retorna o usuário logado atualmente.
 */
export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Realiza o logout do usuário.
 */
export async function signOut(): Promise<{ error?: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
}
