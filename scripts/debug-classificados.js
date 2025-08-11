import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugClassificados() {
  console.log('🔍 DIAGNÓSTICO DETALHADO DA TABELA CLASSIFICADOS\n');
  
  // Test 1: Basic select
  console.log('1️⃣ Testando SELECT...');
  try {
    const { data, error } = await supabase
      .from('classificados')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ Erro SELECT: ${error.message}`);
    } else {
      console.log(`✅ SELECT funcionou - ${data.length} registros encontrados`);
      if (data.length > 0) {
        console.log('   Estrutura do registro:', Object.keys(data[0]));
      }
    }
  } catch (err) {
    console.log(`❌ Exceção SELECT: ${err.message}`);
  }
  
  // Test 2: Try different data variations
  const testVariations = [
    {
      name: 'Dados completos',
      data: {
        titulo: 'Test Debug',
        descricao: 'Test Debug',
        categoria: 'venda',
        nome_contato: 'Test',
        telefone: '123456789',
        apartamento: '999'
      }
    },
    {
      name: 'Dados mínimos',
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
      name: 'Dados com preco',
      data: {
        titulo: 'Test Price',
        descricao: 'Test',
        categoria: 'venda',
        preco: 100.00,
        nome_contato: 'Test',
        telefone: '123',
        apartamento: '1'
      }
    },
    {
      name: 'Dados com bloco',
      data: {
        titulo: 'Test Block',
        descricao: 'Test',
        categoria: 'venda',
        nome_contato: 'Test',
        telefone: '123',
        apartamento: '1',
        bloco: 'A'
      }
    },
    {
      name: 'Categoria servico',
      data: {
        titulo: 'Test Servico',
        descricao: 'Test',
        categoria: 'servico',
        nome_contato: 'Test',
        telefone: '123',
        apartamento: '1'
      }
    }
  ];
  
  console.log('\n2️⃣ Testando diferentes variações de dados...\n');
  
  for (const variation of testVariations) {
    console.log(`🧪 ${variation.name}:`);
    try {
      const { data, error } = await supabase
        .from('classificados')
        .insert([variation.data])
        .select();
      
      if (error) {
        console.log(`   ❌ ${error.message}`);
        if (error.details) {
          console.log(`   📋 Detalhes: ${error.details}`);
        }
      } else {
        console.log(`   ✅ SUCESSO! Registro criado`);
        
        // Clean up
        if (data && data[0] && data[0].id) {
          await supabase
            .from('classificados')
            .delete()
            .eq('id', data[0].id);
          console.log(`   🗑️  Registro removido para limpeza`);
        }
        
        // If we found a working variation, we can stop
        break;
      }
    } catch (err) {
      console.log(`   ❌ Exceção: ${err.message}`);
    }
    console.log('');
  }
  
  // Test 3: Check existing data structure
  console.log('3️⃣ Verificando estrutura dos dados existentes...');
  try {
    const { data, error } = await supabase
      .from('classificados')
      .select('*');
    
    if (error) {
      console.log(`❌ Erro ao consultar dados existentes: ${error.message}`);
    } else {
      console.log(`✅ Consulta realizada - ${data.length} registros existentes`);
      
      if (data.length > 0) {
        console.log('   📋 Estrutura do primeiro registro:');
        const first = data[0];
        for (const [key, value] of Object.entries(first)) {
          const type = value === null ? 'null' : typeof value;
          console.log(`      ${key}: ${type} = ${value}`);
        }
      }
    }
  } catch (err) {
    console.log(`❌ Exceção: ${err.message}`);
  }
  
  // Test 4: Show SQL for manual fix
  console.log('\n4️⃣ SQL para correção manual:');
  console.log(`
-- SQL para executar no Supabase Dashboard:

-- Remove todas as políticas existentes
DROP POLICY IF EXISTS "Classificados are readable by everyone" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can insert classificados" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can update classificados" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can delete classificados" ON public.classificados;
DROP POLICY IF EXISTS "Enable all access for classificados" ON public.classificados;
DROP POLICY IF EXISTS "Complete access for classificados" ON public.classificados;

-- Desabilitar RLS temporariamente (apenas para teste)
ALTER TABLE public.classificados DISABLE ROW LEVEL SECURITY;

-- Ou criar política super permissiva
-- ALTER TABLE public.classificados ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Super permissive policy" ON public.classificados FOR ALL TO public USING (true) WITH CHECK (true);
`);
  
  console.log('\n🌐 Link do Dashboard: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor');
}

debugClassificados().catch(console.error);
