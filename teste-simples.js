import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testeSimples() {
  console.log('🧪 TESTE SIMPLES DE CADASTRO\n');

  // Email único para teste
  const email = `teste${Date.now()}@teste.com`;
  const password = '123456';

  console.log(`📧 Testando com: ${email}`);
  console.log('🔑 Senha: 123456\n');

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log('❌ ERRO:', error.message);
      
      if (error.message.includes('Database error')) {
        console.log('\n💡 SOLUÇÃO:');
        console.log('1. Vá para: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/auth/settings');
        console.log('2. DESMARQUE "Enable email confirmations"');
        console.log('3. SALVE as configurações');
        console.log('4. TESTE o cadastro no site novamente');
      }
    } else {
      console.log('✅ SUCESSO! Cadastro funcionou!');
      console.log('👤 ID do usuário:', data.user?.id);
      console.log('📧 Email confirmado:', data.user?.email_confirmed_at ? 'Sim' : 'Não');
    }
    
  } catch (err) {
    console.log('❌ Erro inesperado:', err.message);
  }
}

testeSimples();
