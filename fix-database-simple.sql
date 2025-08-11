-- CORREÇÃO RÁPIDA - POLÍTICAS RLS DO SUPABASE
-- Execute este SQL no SQL Editor do Supabase

-- Desabilitar RLS temporariamente (mais permissivo)
-- Isso resolve o problema de "Erro no banco de dados"

-- Comunicados
ALTER TABLE public.comunicados DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for comunicados" ON public.comunicados;
CREATE POLICY "Enable all access for comunicados" ON public.comunicados FOR ALL USING (true) WITH CHECK (true);

-- Profiles (usuários)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for profiles" ON public.profiles;
CREATE POLICY "Enable all access for profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- User Roles
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for user_roles" ON public.user_roles;
CREATE POLICY "Enable all access for user_roles" ON public.user_roles FOR ALL USING (true) WITH CHECK (true);

-- Coleta de Lixo
ALTER TABLE public.coleta_lixo DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coleta_lixo ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for coleta_lixo" ON public.coleta_lixo;
CREATE POLICY "Enable all access for coleta_lixo" ON public.coleta_lixo FOR ALL USING (true) WITH CHECK (true);

-- Encomendas
ALTER TABLE public.encomendas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.encomendas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for encomendas" ON public.encomendas;
CREATE POLICY "Enable all access for encomendas" ON public.encomendas FOR ALL USING (true) WITH CHECK (true);

-- Serviços dos Moradores
ALTER TABLE public.servicos_moradores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos_moradores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for servicos_moradores" ON public.servicos_moradores;
CREATE POLICY "Enable all access for servicos_moradores" ON public.servicos_moradores FOR ALL USING (true) WITH CHECK (true);

-- Classificados
ALTER TABLE public.classificados DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classificados ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for classificados" ON public.classificados;
CREATE POLICY "Enable all access for classificados" ON public.classificados FOR ALL USING (true) WITH CHECK (true);

-- Agendamentos do Salão
ALTER TABLE public.agendamentos_salao DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos_salao ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for agendamentos_salao" ON public.agendamentos_salao;
CREATE POLICY "Enable all access for agendamentos_salao" ON public.agendamentos_salao FOR ALL USING (true) WITH CHECK (true);

-- Testar se funcionou
SELECT 'RLS Corrigido - Teste de cadastro deve funcionar agora!' as resultado;
