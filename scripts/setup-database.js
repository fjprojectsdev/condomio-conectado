import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔗 Testando conexão com Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('comunicados')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error);
      return false;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    return true;
  } catch (err) {
    console.error('❌ Erro na conexão:', err);
    return false;
  }
}

async function checkTables() {
  console.log('📋 Verificando tabelas necessárias...');
  
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
  
  const existingTables = [];
  const missingTables = [];
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        missingTables.push(table);
      } else {
        existingTables.push(table);
      }
    } catch (err) {
      missingTables.push(table);
    }
  }
  
  console.log(`✅ Tabelas existentes: ${existingTables.join(', ')}`);
  if (missingTables.length > 0) {
    console.log(`❌ Tabelas faltantes: ${missingTables.join(', ')}`);
  }
  
  return { existingTables, missingTables };
}

async function insertTestData() {
  console.log('📝 Inserindo dados de teste...');
  
  try {
    // Inserir dados de teste em coleta_lixo se não existirem
    const { data: coletaData, error: coletaError } = await supabase
      .from('coleta_lixo')
      .select('id')
      .limit(1);
    
    if (!coletaError && coletaData.length === 0) {
      await supabase.from('coleta_lixo').insert([
        { dia_da_semana: 'segunda', tipo_de_lixo: 'Lixo Comum' },
        { dia_da_semana: 'quarta', tipo_de_lixo: 'Lixo Reciclável' },
        { dia_da_semana: 'sexta', tipo_de_lixo: 'Lixo Comum' }
      ]);
      console.log('✅ Dados de coleta de lixo inseridos');
    }
    
    // Inserir comunicado de teste se não existir
    const { data: comunicadosData, error: comunicadosError } = await supabase
      .from('comunicados')
      .select('id')
      .limit(1);
    
    if (!comunicadosError && comunicadosData.length === 0) {
      await supabase.from('comunicados').insert([{
        titulo: 'Sistema Funcionando!',
        mensagem: 'O sistema de gerenciamento do condomínio está funcionando corretamente. Você pode começar a usar todas as funcionalidades.',
        data: new Date().toISOString()
      }]);
      console.log('✅ Comunicado de teste inserido');
    }
    
    console.log('✅ Dados de teste configurados com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao inserir dados de teste:', err);
  }
}

async function testInsert() {
  console.log('🧪 Testando inserção em cada tabela...');
  
  const tests = [
    {
      table: 'comunicados',
      data: {
        titulo: 'Teste de Inserção',
        mensagem: 'Testando se a inserção funciona corretamente',
        data: new Date().toISOString()
      }
    },
    {
      table: 'coleta_lixo',
      data: {
        dia_da_semana: 'domingo',
        tipo_de_lixo: 'Teste'
      }
    },
    {
      table: 'encomendas',
      data: {
        nome_morador: 'Teste',
        apartamento: 999,
        descricao: 'Teste de inserção',
        recebida: false
      }
    }
  ];
  
  for (const test of tests) {
    try {
      const { data, error } = await supabase
        .from(test.table)
        .insert([test.data])
        .select();
      
      if (error) {
        console.error(`❌ Erro ao inserir em ${test.table}:`, error);
      } else {
        console.log(`✅ Inserção em ${test.table} funcionou!`);
        
        // Limpar dados de teste
        if (data && data[0] && data[0].id) {
          await supabase
            .from(test.table)
            .delete()
            .eq('id', data[0].id);
        }
      }
    } catch (err) {
      console.error(`❌ Erro ao testar ${test.table}:`, err);
    }
  }
}

async function main() {
  console.log('🚀 Configuração do Banco de Dados - Condomínio Conectado\n');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('❌ Não foi possível conectar ao banco. Verifique as configurações.');
    process.exit(1);
  }
  
  console.log('');
  await checkTables();
  
  console.log('');
  await insertTestData();
  
  console.log('');
  await testInsert();
  
  console.log('\n✅ Configuração concluída! O sistema deveria estar funcionando agora.');
  console.log('💡 Se ainda houver erros, verifique o console do navegador para mais detalhes.');
}

main().catch(console.error);
