import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testTableOperation(tableName, operation, testData) {
  try {
    let result;
    
    switch (operation) {
      case 'insert':
        result = await supabase
          .from(tableName)
          .insert([testData])
          .select();
        break;
        
      case 'upsert':
        result = await supabase
          .from(tableName)
          .upsert([testData], { ignoreDuplicates: true });
        break;
        
      case 'select':
        result = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        break;
        
      default:
        return { success: false, error: 'Unknown operation' };
    }
    
    const { data, error } = result;
    
    if (error) {
      return { 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details 
      };
    }
    
    // Clean up if we inserted data
    if (operation === 'insert' && data && data[0] && data[0].id) {
      await supabase
        .from(tableName)
        .delete()
        .eq('id', data[0].id);
    }
    
    return { 
      success: true, 
      data: data,
      recordCount: data?.length || 0
    };
    
  } catch (err) {
    return { 
      success: false, 
      error: err.message,
      stack: err.stack
    };
  }
}

function getTestData(tableName) {
  const testData = {
    'comunicados': {
      titulo: 'Teste RLS',
      mensagem: 'Testando políticas RLS',
      data: new Date().toISOString()
    },
    'coleta_lixo': {
      dia_da_semana: 'teste-rls',
      tipo_de_lixo: 'Teste RLS'
    },
    'encomendas': {
      nome_morador: 'Teste RLS',
      apartamento: 999,
      descricao: 'Teste de RLS',
      recebida: false
    },
    'servicos_moradores': {
      nome_morador: 'Teste RLS',
      apartamento: 999,
      tipo_servico: 'Teste RLS',
      status: 'ativo'
    },
    'classificados': {
      titulo: 'Teste RLS',
      descricao: 'Teste de RLS',
      categoria: 'venda',
      nome_contato: 'Teste',
      telefone: '123456789',
      apartamento: '999'
    },
    'agendamentos_salao': {
      nome_solicitante: 'Teste RLS',
      telefone: '123456789',
      data_evento: '2025-12-31',
      horario_inicio: '20:00',
      horario_fim: '22:00',
      tipo_evento: 'Teste RLS',
      status: 'pendente'
    }
  };
  
  return testData[tableName] || {};
}

async function comprehensiveRLSTest() {
  console.log('🔍 TESTE COMPLETO DAS POLÍTICAS RLS');
  console.log('=====================================\n');
  
  const tables = [
    'comunicados', 
    'coleta_lixo', 
    'encomendas', 
    'servicos_moradores', 
    'classificados', 
    'agendamentos_salao'
  ];
  
  const results = {};
  
  for (const table of tables) {
    console.log(`📋 Testando tabela: ${table}`);
    
    const testData = getTestData(table);
    
    // Test SELECT first (should always work)
    const selectResult = await testTableOperation(table, 'select', testData);
    console.log(`   SELECT: ${selectResult.success ? '✅' : '❌'} ${selectResult.success ? `(${selectResult.recordCount} records)` : selectResult.error}`);
    
    // Test INSERT 
    const insertResult = await testTableOperation(table, 'insert', testData);
    console.log(`   INSERT: ${insertResult.success ? '✅' : '❌'} ${insertResult.success ? 'Funcionando!' : insertResult.error}`);
    
    // Test UPSERT if INSERT failed
    let upsertResult = { success: false };
    if (!insertResult.success) {
      upsertResult = await testTableOperation(table, 'upsert', testData);
      console.log(`   UPSERT: ${upsertResult.success ? '✅' : '❌'} ${upsertResult.success ? 'Funcionando!' : upsertResult.error}`);
    }
    
    results[table] = {
      select: selectResult.success,
      insert: insertResult.success,
      upsert: upsertResult.success,
      existingRecords: selectResult.recordCount || 0,
      errors: {
        select: selectResult.error || null,
        insert: insertResult.error || null,
        upsert: upsertResult.error || null
      }
    };
    
    console.log(''); // Empty line for spacing
  }
  
  return results;
}

async function detectRLSIssues(results) {
  console.log('🔍 ANÁLISE DOS PROBLEMAS RLS');
  console.log('============================\n');
  
  const workingTables = [];
  const brokenTables = [];
  const rlsErrors = [];
  
  for (const [table, result] of Object.entries(results)) {
    if (result.insert || result.upsert) {
      workingTables.push(table);
    } else {
      brokenTables.push(table);
      
      // Analyze error messages
      if (result.errors.insert && result.errors.insert.includes('row-level security policy')) {
        rlsErrors.push({
          table,
          error: 'RLS Policy Violation',
          message: result.errors.insert
        });
      }
    }
  }
  
  console.log(`✅ Tabelas funcionais: ${workingTables.length > 0 ? workingTables.join(', ') : 'Nenhuma'}`);
  console.log(`❌ Tabelas com problemas: ${brokenTables.length > 0 ? brokenTables.join(', ') : 'Nenhuma'}`);
  
  if (rlsErrors.length > 0) {
    console.log('\n🔒 ERROS DE RLS DETECTADOS:');
    rlsErrors.forEach(error => {
      console.log(`   • ${error.table}: ${error.error}`);
    });
  }
  
  return { workingTables, brokenTables, rlsErrors };
}

async function tryAlternativeApproaches(brokenTables) {
  console.log('\n🧪 TENTATIVAS DE CORREÇÃO ALTERNATIVA');
  console.log('======================================\n');
  
  for (const table of brokenTables) {
    console.log(`🔧 Tentando correções para: ${table}`);
    
    const testData = getTestData(table);
    
    // Approach 1: Try with explicit ID
    const dataWithId = { 
      ...testData, 
      id: crypto.randomUUID ? crypto.randomUUID() : `test-${Date.now()}` 
    };
    
    const idResult = await testTableOperation(table, 'insert', dataWithId);
    console.log(`   Com ID explícito: ${idResult.success ? '✅' : '❌'}`);
    
    // Approach 2: Try minimal data
    let minimalData = {};
    if (table === 'comunicados') {
      minimalData = { titulo: 'Test', mensagem: 'Test' };
    } else if (table === 'coleta_lixo') {
      minimalData = { dia_da_semana: 'test', tipo_de_lixo: 'Test' };
    } else if (table === 'encomendas') {
      minimalData = { nome_morador: 'Test', apartamento: 1, descricao: 'Test' };
    }
    
    if (Object.keys(minimalData).length > 0) {
      const minResult = await testTableOperation(table, 'insert', minimalData);
      console.log(`   Com dados mínimos: ${minResult.success ? '✅' : '❌'}`);
    }
    
    console.log('');
  }
}

async function showSQLFix(brokenTables) {
  if (brokenTables.length === 0) {
    console.log('🎉 TODAS AS TABELAS ESTÃO FUNCIONANDO!');
    console.log('====================================\n');
    console.log('O sistema está pronto para uso! Execute "npm run dev" para iniciar.');
    return;
  }
  
  console.log('🔧 SQL PARA CORREÇÃO');
  console.log('====================\n');
  console.log('Execute o seguinte SQL no painel do Supabase:\n');
  
  for (const table of brokenTables) {
    console.log(`-- Corrigir ${table}`);
    console.log(`DROP POLICY IF EXISTS "Allow public read access on ${table}" ON public.${table};`);
    console.log(`DROP POLICY IF EXISTS "Allow admin operations on ${table}" ON public.${table};`);
    console.log(`CREATE POLICY "Enable all access for ${table}" ON public.${table} FOR ALL USING (true) WITH CHECK (true);`);
    console.log('');
  }
  
  console.log('🌐 Link direto: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor');
}

async function main() {
  console.log('🚀 VERIFICAÇÃO AUTOMÁTICA DAS POLÍTICAS RLS\n');
  
  // 1. Test all tables comprehensively
  const results = await comprehensiveRLSTest();
  
  // 2. Analyze the issues
  const { workingTables, brokenTables, rlsErrors } = await detectRLSIssues(results);
  
  // 3. Try alternative approaches for broken tables
  if (brokenTables.length > 0) {
    await tryAlternativeApproaches(brokenTables);
  }
  
  // 4. Show SQL fix or success message
  await showSQLFix(brokenTables);
  
  // 5. Final status
  console.log('\n📊 RESUMO FINAL:');
  console.log('================');
  console.log(`✅ Funcionais: ${workingTables.length}/${Object.keys(results).length} tabelas`);
  console.log(`❌ Com problemas: ${brokenTables.length}/${Object.keys(results).length} tabelas`);
  
  if (brokenTables.length === 0) {
    console.log('\n🎉 Sistema 100% funcional! Pode iniciar com "npm run dev"');
  } else {
    console.log(`\n⚠️  Execute as queries SQL acima para corrigir ${brokenTables.length} tabela(s)`);
  }
}

main().catch(console.error);
