-- DEBUG E CORREÇÃO DO BANCO DE DADOS
-- Execute este SQL no Supabase SQL Editor para resolver problemas de cadastro

-- 1. Verificar se as tabelas existem
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'user_roles', 'users')
    AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 2. Verificar se RLS está habilitado
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'user_roles');

-- 3. Verificar políticas existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'user_roles');

-- 4. Verificar se função handle_new_user existe
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user'
    AND routine_schema = 'public';

-- 5. Verificar se trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 6. CORREÇÃO: Remover políticas restritivas temporariamente
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "user_roles_select_own" ON user_roles;
DROP POLICY IF EXISTS "user_roles_insert_own" ON user_roles;

-- 7. CORREÇÃO: Criar políticas permissivas para teste
CREATE POLICY "allow_all_profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_user_roles" ON user_roles FOR ALL USING (true) WITH CHECK (true);

-- 8. CORREÇÃO: Recriar função handle_new_user com mais logs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Log para debug
  RAISE LOG 'handle_new_user: Starting for user %', NEW.id;
  
  -- Inserir perfil básico
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, now())
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    updated_at = now();
  
  RAISE LOG 'handle_new_user: Profile created for %', NEW.email;
  
  -- Criar papel padrão como morador
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (NEW.id, 'morador', now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RAISE LOG 'handle_new_user: Role assigned for %', NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user: ERROR - %', SQLERRM;
    RAISE; -- Re-throw the error
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. CORREÇÃO: Recriar trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Teste manual: Tentar inserir dados de teste
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    -- Simular inserção na tabela profiles
    INSERT INTO public.profiles (id, email, created_at)
    VALUES (test_user_id, 'teste@example.com', now());
    
    -- Simular inserção na tabela user_roles
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (test_user_id, 'morador', now());
    
    -- Limpar dados de teste
    DELETE FROM public.user_roles WHERE user_id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    
    RAISE NOTICE 'Teste manual OK: Tabelas funcionando corretamente';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Erro no teste manual: %', SQLERRM;
END$$;

-- 11. Verificar configuração de autenticação no Supabase
SELECT 'Verificar no Dashboard do Supabase:' as instrucoes
UNION ALL
SELECT '1. Authentication > Settings > Enable email confirmations deve estar ON'
UNION ALL
SELECT '2. Authentication > Settings > Site URL deve estar configurada'
UNION ALL
SELECT '3. Se ainda der erro, desabilitar temporariamente email confirmation'
UNION ALL
SELECT '4. Testar cadastro sem confirmação de email primeiro';

-- 12. Script para debug de logs em tempo real
SELECT 'Para ver logs em tempo real:' as debug_info
UNION ALL
SELECT 'No terminal: tail -f /var/log/postgresql/postgresql-*.log'
UNION ALL  
SELECT 'Ou no Supabase Dashboard: Logs > Database';
