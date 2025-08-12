import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');
  
  try {
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('classificados')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Erro de conexão:', connectionError);
      return;
    }
    
    console.log('✅ Conexão funcionando! Total de registros:', connectionTest?.length || 0);
    
    // 2. Verificar se a tabela existe e buscar dados
    console.log('\n2️⃣ Buscando classificados existentes...');
    const { data: classificados, error: fetchError } = await supabase
      .from('classificados')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Erro ao buscar dados:', fetchError);
      console.log('💡 Possível causa: problema com enum ou estrutura da tabela');
      return;
    }
    
    console.log('📊 Classificados encontrados:', classificados?.length || 0);
    if (classificados && classificados.length > 0) {
      console.log('📝 Primeiros registros:');
      classificados.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.titulo} - Categoria: ${item.categoria}`);
      });
    }
    
    // 3. Testar inserção com categoria existente
    console.log('\n3️⃣ Testando inserção com categoria "venda"...');
    const testInsert = {
      titulo: 'Teste de Conexão',
      descricao: 'Este é um teste para verificar se a inserção está funcionando',
      categoria: 'venda',
      nome_contato: 'Teste',
      telefone: '11999999999',
      apartamento: '999',
      ativo: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('classificados')
      .insert([testInsert])
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError);
      console.log('💡 Detalhes do erro:');
      console.log('   Código:', insertError.code);
      console.log('   Mensagem:', insertError.message);
      console.log('   Dica:', insertError.hint);
      
      if (insertError.message.includes('enum') || insertError.message.includes('categoria')) {
        console.log('\n🔧 SOLUÇÃO NECESSÁRIA:');
        console.log('   Execute o seguinte SQL no Supabase Dashboard:');
        console.log('   ALTER TYPE public.classificado_categoria ADD VALUE \'aluguel\';');
      }
    } else {
      console.log('✅ Inserção bem-sucedida!');
      console.log('📝 Registro inserido:', insertResult?.[0]?.titulo);
      
      // Remover o registro de teste
      console.log('\n4️⃣ Removendo registro de teste...');
      const { error: deleteError } = await supabase
        .from('classificados')
        .delete()
        .eq('id', insertResult[0].id);
      
      if (deleteError) {
        console.error('❌ Erro ao remover teste:', deleteError);
      } else {
        console.log('✅ Registro de teste removido');
      }
    }
    
    // 4. Verificar enum atual
    console.log('\n5️⃣ Verificando enum classificado_categoria...');
    const { data: enumData, error: enumError } = await supabase
      .rpc('get_enum_values', { enum_name: 'classificado_categoria' });
      
    if (enumError) {
      console.log('⚠️ Não foi possível verificar enum (normal se função não existe)');
    } else {
      console.log('📋 Valores do enum:', enumData);
    }
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

// Executar teste
testConnection().then(() => {
  console.log('\n🏁 Teste concluído!');
  process.exit(0);
});
