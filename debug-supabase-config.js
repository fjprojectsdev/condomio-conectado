import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZUludGVuZGVkVGVtcGxhdGUiOiJhbm9uIiwiaWF0IjoxNzU0NDQ3NDQ1LCJleHAiOjIwNzAwMjM0NDV9.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugSupabaseConfig() {
  console.log('🔍 DIAGNÓSTICO COMPLETO - SUPABASE AUTH\n');
  
  // 1. Testar conectividade básica
  console.log('1️⃣ TESTE DE CONECTIVIDADE');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('✅ Conectividade com Supabase: OK');
    console.log('👤 Usuário atual:', user ? user.email : 'Nenhum');
  } catch (err) {
    console.log('❌ Erro de conectividade:', err.message);
  }
  
  // 2. Tentar cadastro com diferentes configurações
  console.log('\n2️⃣ TESTE DE CADASTRO DIRETO');
  const testEmail = `debug${Date.now()}@teste.com`;
  
  try {
    console.log(`📧 Testando cadastro: ${testEmail}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: '123456',
      options: {
        emailRedirectTo: undefined, // Sem redirect
        data: {} // Sem metadata extra
      }
    });

    if (error) {
      console.log('❌ ERRO DETALHADO:', error);
      console.log('   Status:', error.status);
      console.log('   Código:', error.code || 'N/A');
      console.log('   Mensagem:', error.message);
      
      // Analisar tipo de erro
      if (error.message.includes('Email signups are disabled')) {
        console.log('\n🚨 PROBLEMA IDENTIFICADO: Cadastros por email DESABILITADOS');
        console.log('💡 SOLUÇÃO:');
        console.log('   1. Vá para: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/auth/settings');
        console.log('   2. Na seção "User Signups", HABILITE "Allow new users to sign up"');
        console.log('   3. Salve as configurações');
        
      } else if (error.message.includes('Database error')) {
        console.log('\n🚨 PROBLEMA IDENTIFICADO: Erro no banco de dados (trigger)');
        console.log('💡 SOLUÇÃO:');
        console.log('   1. Execute o SQL de correção no Supabase SQL Editor');
        console.log('   2. Ou desabilite RLS temporariamente');
        
      } else if (error.message.includes('confirmation')) {
        console.log('\n🚨 PROBLEMA IDENTIFICADO: Problema na confirmação de email');
        console.log('💡 SOLUÇÃO:');
        console.log('   1. Configure confirmação de email corretamente');
        console.log('   2. Ou desabilite temporariamente');
      }
      
    } else {
      console.log('✅ CADASTRO FUNCIONOU!');
      console.log('👤 Usuário criado:', data.user?.id);
      console.log('📧 Email:', data.user?.email);
      console.log('✉️ Confirmação necessária:', data.user?.email_confirmed_at ? 'Não' : 'Sim');
    }
    
  } catch (err) {
    console.log('💥 Erro inesperado:', err.message);
  }
  
  // 3. Verificar configurações de autenticação
  console.log('\n3️⃣ VERIFICAÇÃO DE CONFIGURAÇÕES');
  
  try {
    // Tentar acessar algumas configurações via API
    const { data: session } = await supabase.auth.getSession();
    console.log('✅ Sessão atual:', session.session ? 'Ativa' : 'Inativa');
    
  } catch (err) {
    console.log('⚠️ Não foi possível verificar sessão:', err.message);
  }
  
  // 4. Testar acesso às tabelas
  console.log('\n4️⃣ TESTE DE ACESSO ÀS TABELAS');
  
  const tables = ['profiles', 'user_roles'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`   💡 Tabela ${table} não existe - execute SQL para criar`);
        }
      } else {
        console.log(`✅ ${table}: Acessível`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log('\n📋 RESUMO DO DIAGNÓSTICO:');
  console.log('================================');
  console.log('✅ Execute as soluções indicadas acima');
  console.log('🔄 Depois execute este teste novamente');
  console.log('📞 Se persistir, há problema de configuração no Dashboard');
}

debugSupabaseConfig();
