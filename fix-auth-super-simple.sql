-- CORREÇÃO ULTRA-SIMPLES - DESABILITAR RLS TEMPORARIAMENTE
-- Execute este SQL no Supabase para resolver o erro de cadastro

-- Desabilitar RLS em todas as tabelas relacionadas à autenticação
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY;

-- Remover triggers problemáticos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Resultado
SELECT 'RLS desabilitado - Teste o cadastro agora!' as resultado;
