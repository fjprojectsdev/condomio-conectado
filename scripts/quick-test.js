import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function quickInsertTest(tableName, testData) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([testData])
      .select();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    // Clean up immediately
    if (data && data[0] && data[0].id) {
      await supabase
        .from(tableName)
        .delete()
        .eq('id', data[0].id);
    }
    
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('🚀 TESTE RÁPIDO DAS POLÍTICAS RLS\n');
  
  const tests = [
    {
      table: 'comunicados',
      data: { titulo: 'Test Quick', mensagem: 'Test', data: new Date().toISOString() }
    },
    {
      table: 'coleta_lixo',
      data: { dia_da_semana: 'test', tipo_de_lixo: 'Test' }
    },
    {
      table: 'encomendas',
      data: { nome_morador: 'Test', apartamento: 1, descricao: 'Test', recebida: false }
    },
    {
      table: 'servicos_moradores',
      data: { nome_morador: 'Test', apartamento: 1, tipo_servico: 'Test', status: 'ativo' }
    },
    {
      table: 'classificados',
      data: { 
        titulo: 'Test', 
        descricao: 'Test', 
        categoria: 'venda', 
        nome_contato: 'Test', 
        telefone: '123', 
        apartamento: '1' 
      }
    },
    {
      table: 'agendamentos_salao',
      data: {
        nome_solicitante: 'Test',
        telefone: '123',
        data_evento: '2025-12-31',
        horario_inicio: '10:00',
        horario_fim: '11:00',
        tipo_evento: 'Test',
        status: 'pendente'
      }
    }
  ];
  
  let working = 0;
  let broken = 0;
  
  for (const test of tests) {
    const result = await quickInsertTest(test.table, test.data);
    const status = result.success ? '✅' : '❌';
    const message = result.success ? 'FUNCIONANDO!' : 'RLS ainda bloqueando';
    
    console.log(`${status} ${test.table.padEnd(20)} ${message}`);
    
    if (result.success) {
      working++;
    } else {
      broken++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 RESULTADO: ${working}/${tests.length} tabelas funcionais`);
  
  if (working === tests.length) {
    console.log('\n🎉 TODAS AS TABELAS ESTÃO FUNCIONANDO!');
    console.log('✅ O sistema está pronto para uso!');
    console.log('🚀 Execute: npm run dev');
  } else if (working > 0) {
    console.log(`\n⚠️  ${broken} tabela(s) ainda com problema de RLS`);
    console.log('🔧 Execute as queries SQL no painel do Supabase');
  } else {
    console.log('\n❌ Nenhuma tabela foi corrigida ainda');
    console.log('🔧 Execute as queries SQL fornecidas no painel do Supabase');
    console.log('🌐 https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor');
  }
}

main().catch(console.error);
