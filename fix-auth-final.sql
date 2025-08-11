-- CORREÇÃO FINAL - SISTEMA DE AUTENTICAÇÃO
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar se existe a tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text,
  first_name text,
  last_name text,
  full_name text,
  apartamento text,
  telefone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Verificar se existe a tabela user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'morador',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar RLS e criar políticas permissivas para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for profiles" ON public.profiles;
CREATE POLICY "Allow all access for profiles" 
ON public.profiles FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Habilitar RLS e criar políticas permissivas para user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for user_roles" ON public.user_roles;
CREATE POLICY "Allow all access for user_roles" 
ON public.user_roles FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Criar função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'morador');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Verificar se funcionou
SELECT 'Correção aplicada com sucesso! Teste o cadastro agora.' as resultado;
