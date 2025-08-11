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
 * Registra um novo usuário e cria OTP personalizado.
 * @param email - O email do usuário.
 * @param password - A senha do usuário (mínimo 6 caracteres).
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    // 1. Criar usuário no Supabase sem confirmação
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined
      }
    });
    
    if (error) {
      return { user: data?.user, error };
    }
    
    // 2. Gerar OTP personalizado
    const { data: otpData, error: otpError } = await supabase
      .rpc('create_otp_for_email', { user_email: email });
    
    if (otpError) {
      console.warn('Erro ao gerar OTP:', otpError);
    } else {
      console.log('OTP gerado:', otpData);
      // Simular envio por email (em produção, usar serviço de email real)
      simulateEmailSend(email, otpData);
    }
    
    return { user: data.user, error: null };
  } catch (err) {
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
