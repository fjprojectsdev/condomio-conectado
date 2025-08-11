
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Registra um novo usuário.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário (mínimo 6 caracteres).
 * @returns {Promise<{user: object, error: object}>}
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user: data.user, error };
}

/**
 * Confirma o email do usuário com um token OTP.
 * @param {string} email - O email do usuário.
 * @param {string} token - O token OTP de 6 dígitos.
 * @returns {Promise<{session: object, error: object}>}
 */
export async function confirmEmail(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });
  return { session: data.session, error };
}

/**
 * Realiza o login do usuário.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<{session: object, error: object}>}
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, error };
}

/**
 * Envia um email de redefinição de senha.
 * @param {string} email - O email do usuário.
 * @returns {Promise<{error: object}>}
 */
export async function resetPasswordForEmail(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://example.com/update-password', // TODO: Atualize com o URL da sua página de redefinição de senha
  });
  return { error };
}

/**
 * Retorna o usuário logado atualmente.
 * @returns {Promise<object|null>}
 */
export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Realiza o logout do usuário.
 * @returns {Promise<{error: object}>}
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

