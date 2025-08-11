import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ddzmibbhtjrgzdgflujg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkem1pYmJodGpyZ3pkZ2ZsdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDc0NDUsImV4cCI6MjA3MDAyMzQ0NX0.lB6bQ--g86TIwDkvo6n-pOKONsNYfxMTBvZUH-fBvNk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function applyRLSFix() {
  console.log('🔧 Aplicando correção das políticas RLS...');
  
  const fixQueries = [
    // Fix comunicados policies
    "DROP POLICY IF EXISTS \"Allow public read access on comunicados\" ON public.comunicados",
    "DROP POLICY IF EXISTS \"Allow admin operations on comunicados\" ON public.comunicados", 
    "CREATE POLICY \"Enable all access for comunicados\" ON public.comunicados FOR ALL USING (true) WITH CHECK (true)",
    
    // Fix coleta_lixo policies
    "DROP POLICY IF EXISTS \"Allow public read access on coleta_lixo\" ON public.coleta_lixo",
    "DROP POLICY IF EXISTS \"Allow admin operations on coleta_lixo\" ON public.coleta_lixo",
    "CREATE POLICY \"Enable all access for coleta_lixo\" ON public.coleta_lixo FOR ALL USING (true) WITH CHECK (true)",
    
    // Fix encomendas policies
    "DROP POLICY IF EXISTS \"Allow public read access on encomendas\" ON public.encomendas",
    "DROP POLICY IF EXISTS \"Allow admin operations on encomendas\" ON public.encomendas",
    "CREATE POLICY \"Enable all access for encomendas\" ON public.encomendas FOR ALL USING (true) WITH CHECK (true)",
    
    // Fix servicos_moradores policies
    "DROP POLICY IF EXISTS \"Allow public read access on servicos_moradores\" ON public.servicos_moradores",
    "DROP POLICY IF EXISTS \"Allow admin operations on servicos_moradores\" ON public.servicos_moradores",
    "CREATE POLICY \"Enable all access for servicos_moradores\" ON public.servicos_moradores FOR ALL USING (true) WITH CHECK (true)"
  ];
  
  for (const query of fixQueries) {
    try {
      console.log(`Executando: ${query.substring(0, 50)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql_query: query });
      
      if (error) {
        console.log(`⚠️  Aviso ao executar query: ${error.message}`);
      } else {
        console.log('✅ Query executada com sucesso');
      }
    } catch (err) {
      console.log(`⚠️  Aviso: ${err.message}`);
    }
  }
}

async function testAfterFix() {
  console.log('\n🧪 Testando inserções após correção...');
  
  const tests = [
    {
      table: 'comunicados',
      data: {
        titulo: 'Teste Pós-Correção',
        mensagem: 'Testando inserção após correção RLS',
        data: new Date().toISOString()
      }
    },
    {
      table: 'coleta_lixo',
      data: {
        dia_da_semana: 'sabado',
        tipo_de_lixo: 'Teste Correção'
      }
    },
    {
      table: 'encomendas',
      data: {
        nome_morador: 'Teste Correção',
        apartamento: 888,
        descricao: 'Teste após correção RLS',
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
        console.error(`❌ Ainda com erro em ${test.table}:`, error);
      } else {
        console.log(`✅ Inserção em ${test.table} funcionou após correção!`);
        
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
  console.log('🔧 Correção do Banco de Dados - Condomínio Conectado\n');
  
  // Note: The RLS fix requires superuser access which we don't have with anon key
  // So we'll just test the current state and provide instructions
  
  console.log('ℹ️  As políticas RLS precisam ser corrigidas diretamente no painel do Supabase.');
  console.log('📋 Acesse: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor');
  console.log('🔧 Execute as seguintes queries no SQL Editor:\n');
  
  console.log(`-- Corrigir políticas restritivas
DROP POLICY IF EXISTS "Allow public read access on comunicados" ON public.comunicados;
DROP POLICY IF EXISTS "Allow admin operations on comunicados" ON public.comunicados;
CREATE POLICY "Enable all access for comunicados" ON public.comunicados FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on coleta_lixo" ON public.coleta_lixo;
DROP POLICY IF EXISTS "Allow admin operations on coleta_lixo" ON public.coleta_lixo;
CREATE POLICY "Enable all access for coleta_lixo" ON public.coleta_lixo FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on encomendas" ON public.encomendas;
DROP POLICY IF EXISTS "Allow admin operations on encomendas" ON public.encomendas;
CREATE POLICY "Enable all access for encomendas" ON public.encomendas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on servicos_moradores" ON public.servicos_moradores;
DROP POLICY IF EXISTS "Allow admin operations on servicos_moradores" ON public.servicos_moradores;
CREATE POLICY "Enable all access for servicos_moradores" ON public.servicos_moradores FOR ALL USING (true) WITH CHECK (true);`);

  await testAfterFix();
  
  console.log('\n💡 Após executar as queries acima no painel do Supabase, execute novamente: npm run setup-db');
}

main().catch(console.error);
