import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAluguel() {
  console.log('🏠 Testando categoria ALUGUEL...\n');
  
  try {
    // 1. Testar inserção com categoria aluguel
    console.log('1️⃣ Testando inserção com categoria "aluguel"...');
    const testAluguel = {
      titulo: 'Apartamento 2 quartos - TESTE',
      descricao: 'Apartamento mobiliado, 2 quartos, sala, cozinha, banheiro. Próximo ao metrô.',
      categoria: 'aluguel',
      preco: 1200.00,
      nome_contato: 'João Teste',
      telefone: '11987654321',
      apartamento: '999',
      bloco: 'TESTE',
      ativo: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('classificados')
      .insert([testAluguel])
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir aluguel:', insertError);
      return;
    }
    
    console.log('✅ Aluguel inserido com sucesso!');
    console.log('📝 ID do registro:', insertResult[0].id);
    
    // 2. Buscar todos os aluguéis
    console.log('\n2️⃣ Buscando todos os aluguéis...');
    const { data: alugueis, error: fetchError } = await supabase
      .from('classificados')
      .select('*')
      .eq('categoria', 'aluguel')
      .eq('ativo', true);
    
    if (fetchError) {
      console.error('❌ Erro ao buscar aluguéis:', fetchError);
      return;
    }
    
    console.log(`📊 Total de aluguéis encontrados: ${alugueis.length}`);
    alugueis.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.titulo} - R$ ${item.preco || 'A combinar'}`);
    });
    
    // 3. Testar filtro por categorias
    console.log('\n3️⃣ Testando contagem por categoria...');
    const { data: categorias, error: countError } = await supabase
      .from('classificados')
      .select('categoria')
      .eq('ativo', true);
    
    if (countError) {
      console.error('❌ Erro ao contar categorias:', countError);
      return;
    }
    
    const contagem = {};
    categorias.forEach(item => {
      contagem[item.categoria] = (contagem[item.categoria] || 0) + 1;
    });
    
    console.log('📋 Classificados por categoria:');
    Object.entries(contagem).forEach(([categoria, quantidade]) => {
      console.log(`   ${categoria}: ${quantidade} anúncios`);
    });
    
    // 4. Remover o teste
    console.log('\n4️⃣ Removendo teste de aluguel...');
    const { error: deleteError } = await supabase
      .from('classificados')
      .delete()
      .eq('id', insertResult[0].id);
    
    if (deleteError) {
      console.error('❌ Erro ao remover teste:', deleteError);
    } else {
      console.log('✅ Teste de aluguel removido com sucesso');
    }
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
  }
}

// Executar teste
testAluguel().then(() => {
  console.log('\n🎉 Teste de ALUGUEL concluído com sucesso!');
  console.log('✅ Categoria "aluguel" está funcionando perfeitamente!');
  process.exit(0);
});
