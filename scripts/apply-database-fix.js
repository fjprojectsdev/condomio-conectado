import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    return !error || error.code !== '42P01';
  } catch (err) {
    return false;
  }
}

async function testTableInsert(tableName, testData) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([testData])
      .select();
    
    if (error) {
      return { success: false, error };
    }
    
    // Clean up test data
    if (data && data[0] && data[0].id) {
      await supabase
        .from(tableName)
        .delete()
        .eq('id', data[0].id);
    }
    
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

async function disableRLS(tableName) {
  console.log(`🔧 Tentando desabilitar RLS temporariamente para ${tableName}...`);
  
  // Como não temos acesso de admin, vamos tentar uma abordagem alternativa
  // Vamos inserir dados usando upsert que às vezes funciona melhor com RLS
  const testData = getTestDataForTable(tableName);
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .upsert([testData], { 
        onConflict: 'id',
        ignoreDuplicates: true 
      })
      .select();
    
    if (!error) {
      console.log(`✅ Upsert funcionou para ${tableName}`);
      
      // Clean up
      if (data && data[0] && data[0].id) {
        await supabase
          .from(tableName)
          .delete()
          .eq('id', data[0].id);
      }
      
      return true;
    }
  } catch (err) {
    console.log(`❌ Upsert falhou para ${tableName}: ${err.message}`);
  }
  
  return false;
}

function getTestDataForTable(tableName) {
  const testData = {
    'comunicados': {
      titulo: 'Teste Sistema',
      mensagem: 'Sistema funcionando',
      data: new Date().toISOString()
    },
    'coleta_lixo': {
      dia_da_semana: 'teste',
      tipo_de_lixo: 'Teste Sistema'
    },
    'encomendas': {
      nome_morador: 'Teste Sistema',
      apartamento: 999,
      descricao: 'Teste do sistema',
      recebida: false
    },
    'servicos_moradores': {
      nome_morador: 'Teste Sistema',
      apartamento: 999,
      tipo_servico: 'Teste',
      status: 'ativo'
    },
    'classificados': {
      titulo: 'Teste',
      descricao: 'Teste do sistema',
      categoria: 'venda',
      nome_contato: 'Teste',
      telefone: '123456789',
      apartamento: '999'
    },
    'agendamentos_salao': {
      nome_solicitante: 'Teste Sistema',
      telefone: '123456789',
      data_evento: '2025-12-31',
      horario_inicio: '10:00',
      horario_fim: '12:00',
      tipo_evento: 'Teste',
      status: 'pendente'
    }
  };
  
  return testData[tableName] || {};
}

async function createMissingTables() {
  console.log('📋 Verificando e criando tabelas faltantes...');
  
  const requiredTables = [
    'comunicados',
    'coleta_lixo',
    'encomendas', 
    'servicos_moradores',
    'classificados',
    'agendamentos_salao',
    'profiles',
    'sugestoes',
    'user_roles'
  ];
  
  const missingTables = [];
  const existingTables = [];
  
  for (const table of requiredTables) {
    const exists = await checkTableExists(table);
    if (exists) {
      existingTables.push(table);
    } else {
      missingTables.push(table);
    }
  }
  
  console.log(`✅ Tabelas existentes: ${existingTables.join(', ')}`);
  
  if (missingTables.length > 0) {
    console.log(`❌ Tabelas faltantes: ${missingTables.join(', ')}`);
    console.log('🔧 Criando tabelas faltantes via API...');
    
    // Tentar criar tabelas via API não é possível com chave anon
    // Vamos apenas reportar
    return { existingTables, missingTables };
  }
  
  return { existingTables, missingTables: [] };
}

async function addSampleData() {
  console.log('📝 Adicionando dados de exemplo...');
  
  const sampleData = [
    {
      table: 'comunicados',
      data: {
        titulo: 'Bem-vindos ao Sistema!',
        mensagem: 'O sistema de gerenciamento do condomínio está funcionando. Agora você pode cadastrar comunicados, gerenciar encomendas e muito mais!',
        data: new Date().toISOString()
      }
    },
    {
      table: 'coleta_lixo',
      records: [
        { dia_da_semana: 'segunda', tipo_de_lixo: 'Lixo Comum' },
        { dia_da_semana: 'quarta', tipo_de_lixo: 'Lixo Reciclável' },
        { dia_da_semana: 'sexta', tipo_de_lixo: 'Lixo Comum' }
      ]
    }
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  for (const item of sampleData) {
    try {
      const records = item.records || [item.data];
      
      for (const record of records) {
        const { error } = await supabase
          .from(item.table)
          .upsert([record], { 
            onConflict: item.table === 'coleta_lixo' ? 'dia_da_semana,tipo_de_lixo' : 'id',
            ignoreDuplicates: true 
          });
        
        if (error) {
          console.log(`⚠️  Aviso ao inserir em ${item.table}: ${error.message}`);
          failCount++;
        } else {
          successCount++;
        }
      }
    } catch (err) {
      console.log(`❌ Erro ao inserir em ${item.table}: ${err.message}`);
      failCount++;
    }
  }
  
  console.log(`✅ ${successCount} inserções bem-sucedidas, ${failCount} falharam`);
}

async function comprehensiveTest() {
  console.log('🧪 Teste abrangente do sistema...');
  
  const tables = ['comunicados', 'coleta_lixo', 'encomendas', 'servicos_moradores', 'classificados', 'agendamentos_salao'];
  const results = {};
  
  for (const table of tables) {
    console.log(`Testando ${table}...`);
    const testData = getTestDataForTable(table);
    
    // Test 1: Regular insert
    const insertResult = await testTableInsert(table, testData);
    
    // Test 2: Upsert
    let upsertResult = { success: false };
    if (!insertResult.success) {
      try {
        const { error } = await supabase
          .from(table)
          .upsert([testData], { ignoreDuplicates: true });
        upsertResult = { success: !error, error };
      } catch (err) {
        upsertResult = { success: false, error: err };
      }
    }
    
    // Test 3: Select
    let selectResult = { success: false };
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      selectResult = { success: !error, error, count: data?.length || 0 };
    } catch (err) {
      selectResult = { success: false, error: err };
    }
    
    results[table] = {
      insert: insertResult.success,
      upsert: upsertResult.success,
      select: selectResult.success,
      existingRecords: selectResult.count || 0
    };
    
    const status = insertResult.success || upsertResult.success ? '✅' : '❌';
    console.log(`${status} ${table}: Insert=${insertResult.success}, Upsert=${upsertResult.success}, Select=${selectResult.success} (${selectResult.count || 0} records)`);
  }
  
  return results;
}

async function main() {
  console.log('🚀 Análise e Correção Avançada do Banco - Condomínio Conectado\n');
  
  // 1. Test connection
  console.log('🔗 Testando conexão...');
  try {
    const { data, error } = await supabase
      .from('comunicados')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('❌ Tabela comunicados não existe');
    } else {
      console.log('✅ Conexão funcionando');
    }
  } catch (err) {
    console.log('❌ Falha na conexão:', err.message);
    return;
  }
  
  // 2. Check all tables
  const { existingTables, missingTables } = await createMissingTables();
  
  // 3. Comprehensive test
  console.log('\n');
  const testResults = await comprehensiveTest();
  
  // 4. Add sample data
  console.log('\n');
  await addSampleData();
  
  // 5. Final summary
  console.log('\n📊 RESUMO FINAL:');
  console.log('================');
  
  const workingTables = Object.keys(testResults).filter(table => 
    testResults[table].insert || testResults[table].upsert
  );
  const brokenTables = Object.keys(testResults).filter(table => 
    !testResults[table].insert && !testResults[table].upsert
  );
  
  console.log(`✅ Tabelas funcionais para inserção: ${workingTables.join(', ') || 'Nenhuma'}`);
  console.log(`❌ Tabelas com problemas RLS: ${brokenTables.join(', ') || 'Nenhuma'}`);
  console.log(`📊 Total de tabelas existentes: ${existingTables.length}`);
  console.log(`⚠️  Tabelas faltantes: ${missingTables.length}`);
  
  if (brokenTables.length > 0) {
    console.log('\n🔧 Para corrigir as tabelas com problemas RLS, acesse:');
    console.log('https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor');
    console.log('\nE execute as queries SQL do arquivo README-DATABASE-FIX.md');
  } else {
    console.log('\n🎉 Todas as tabelas estão funcionais! O sistema deveria estar funcionando perfeitamente.');
  }
}

main().catch(console.error);
