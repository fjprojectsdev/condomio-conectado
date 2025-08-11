-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  apartamento TEXT,
  bloco TEXT,
  telefone TEXT,
  is_prestador BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela sugestoes se não existir
CREATE TABLE IF NOT EXISTS public.sugestoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT,
  telefone TEXT,
  apartamento INTEGER,
  bloco TEXT,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar enum app_role se não existir
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Criar tabela user_roles se não existir
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar campos faltantes nas tabelas existentes (se não existirem)
ALTER TABLE public.servicos_moradores ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.agendamentos_salao ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sugestoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para profiles
DO $$ BEGIN
  CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Políticas permissivas para sugestoes
DO $$ BEGIN
  CREATE POLICY "Anyone can read sugestoes"
  ON public.sugestoes FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can insert sugestoes"
  ON public.sugestoes FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can update sugestoes"
  ON public.sugestoes FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can delete sugestoes"
  ON public.sugestoes FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Políticas para user_roles
DO $$ BEGIN
  CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can manage user roles"
  ON public.user_roles FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Função para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers para updated_at nas novas tabelas
DO $$ BEGIN
  CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_sugestoes_updated_at
  BEFORE UPDATE ON public.sugestoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Inserir alguns dados de exemplo para testar
INSERT INTO public.coleta_lixo (dia_da_semana, tipo_de_lixo) 
VALUES 
  ('segunda', 'Lixo Comum'),
  ('quarta', 'Lixo Reciclável'),
  ('sexta', 'Lixo Comum')
ON CONFLICT DO NOTHING;

-- Inserir um comunicado de exemplo
INSERT INTO public.comunicados (titulo, mensagem, data) 
VALUES (
  'Bem-vindos ao Sistema do Condomínio!',
  'Sistema de gerenciamento do condomínio funcionando corretamente. Agora você pode cadastrar e gerenciar todas as informações do condomínio.',
  now()
) ON CONFLICT DO NOTHING;
