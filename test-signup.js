import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSignup() {
  console.log('🧪 Testando cadastro de usuário...\n');

  // Email de teste único
  const testEmail = `teste${Date.now()}@test.com`;
  const testPassword = '123456789';

  console.log(`📧 Email de teste: ${testEmail}`);
  console.log(`🔑 Senha de teste: ${testPassword}\n`);

  try {
    console.log('1️⃣ Tentando realizar signup...');
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Erro no signup:', error);
      console.error('   - Código:', error.status || 'N/A');
      console.error('   - Mensagem:', error.message);
      console.error('   - Detalhes:', JSON.stringify(error, null, 2));
      
      // Diagnosticar possíveis causas
      console.log('\n🔍 Possíveis causas:');
      
      if (error.message.includes('database')) {
        console.log('   ❌ Problema no banco de dados');
        console.log('   💡 Solução: Execute o script debug-database.sql');
      }
      
      if (error.message.includes('trigger')) {
        console.log('   ❌ Problema no trigger handle_new_user');
        console.log('   💡 Solução: Verifique se a função existe e está correta');
      }
      
      if (error.message.includes('policy')) {
        console.log('   ❌ Problema nas políticas RLS');
        console.log('   💡 Solução: Desabilite temporariamente RLS para teste');
      }
      
      if (error.message.includes('confirmation')) {
        console.log('   ❌ Problema na confirmação de email');
        console.log('   💡 Solução: Desabilite confirmação no Dashboard Supabase');
      }
      
      return;
    }

    console.log('✅ Signup realizado com sucesso!');
    console.log('👤 Usuário:', data.user?.id);
    console.log('📧 Email:', data.user?.email);
    console.log('✉️ Email confirmado:', data.user?.email_confirmed_at ? 'Sim' : 'Não');
    
    // Verificar se as tabelas foram populadas
    console.log('\n2️⃣ Verificando se dados foram criados...');
    
    // Verificar profiles
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.log('❌ Erro ao buscar profile:', profileError.message);
      } else if (profileData) {
        console.log('✅ Profile criado:', profileData.email);
      } else {
        console.log('❌ Profile não encontrado');
      }
    } catch (err) {
      console.log('❌ Erro no profile:', err.message);
    }
    
    // Verificar user_roles
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
      
      if (roleError) {
        console.log('❌ Erro ao buscar role:', roleError.message);
      } else if (roleData) {
        console.log('✅ Role criado:', roleData.role);
      } else {
        console.log('❌ Role não encontrado');
      }
    } catch (err) {
      console.log('❌ Erro no role:', err.message);
    }

  } catch (err) {
    console.error('💥 Erro inesperado:', err);
  }
}

async function testDatabaseConnectivity() {
  console.log('🔌 Testando conectividade com o banco...\n');
  
  try {
    // Teste simples de conexão
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Erro de conectividade com profiles:', error.message);
    } else {
      console.log(`✅ Conectividade OK - Tabela 'profiles' acessível. Contagem: ${count}`);
    }

    // Testar user_roles
    const { count: rolesCount, error: rolesError } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true });

    if (rolesError) {
      console.log('❌ Erro de conectividade com user_roles:', rolesError.message);
    } else {
      console.log(`✅ Conectividade OK - Tabela 'user_roles' acessível. Contagem: ${rolesCount}`);
    }
    
  } catch (err) {
    console.log('❌ Erro de conectividade:', err.message);
  }
}

async function main() {
  console.log('🚀 Teste de Cadastro - Condomínio Conectado\n');
  
  await testDatabaseConnectivity();
  console.log('\n' + '='.repeat(50) + '\n');
  await testSignup();
  
  console.log('\n📝 Próximos passos se houve erro:');
  console.log('1. Execute debug-database.sql no Supabase SQL Editor');
  console.log('2. Verifique Authentication > Settings no Dashboard');
  console.log('3. Se necessário, desabilite temporariamente email confirmation');
  console.log('4. Execute este teste novamente');
}

main().catch(console.error);
