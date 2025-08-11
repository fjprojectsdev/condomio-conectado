-- Script simplificado para configurar autenticação
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos criar ou modificar a tabela user_roles para usar TEXT ao invés de ENUM
-- Se a tabela já existir, esta operação será ignorada
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT DEFAULT 'morador' NOT NULL CHECK (role IN ('admin', 'sindico', 'morador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Modificar a coluna role se ela for do tipo enum
DO $$
BEGIN
  -- Tentar alterar a coluna role para TEXT se for enum
  BEGIN
    ALTER TABLE public.user_roles ALTER COLUMN role TYPE TEXT;
  EXCEPTION
    WHEN OTHERS THEN
      -- Se der erro, a coluna provavelmente já é TEXT ou não existe
      NULL;
  END;
END$$;

-- Garantir que a tabela profiles existe
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  apartamento TEXT,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Habilitar Row Level Security (RLS) em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Tentar habilitar RLS nas outras tabelas (pode dar erro se não existirem)
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY['comunicados', 'coleta_lixo', 'encomendas', 'servicos_moradores', 'classificados', 'agendamentos_salao', 'sugestoes'])
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    EXCEPTION
      WHEN undefined_table THEN
        -- Tabela não existe, pular
        NULL;
    END;
  END LOOP;
END$$;

-- Políticas para a tabela profiles
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON profiles;
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON profiles;
CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Administradores podem ver todos os perfis" ON profiles;
CREATE POLICY "Administradores podem ver todos os perfis" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Políticas para a tabela user_roles
DROP POLICY IF EXISTS "Usuários podem ver seus próprios papéis" ON user_roles;
CREATE POLICY "Usuários podem ver seus próprios papéis" 
ON user_roles FOR SELECT 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Usuários podem inserir seus próprios papéis" ON user_roles;
CREATE POLICY "Usuários podem inserir seus próprios papéis" 
ON user_roles FOR INSERT 
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Apenas administradores podem gerenciar papéis" ON user_roles;
CREATE POLICY "Apenas administradores podem gerenciar papéis" 
ON user_roles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Políticas condicionais para outras tabelas
DO $$
BEGIN
  -- Comunicados
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comunicados') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Todos podem ver comunicados" ON comunicados';
    EXECUTE 'CREATE POLICY "Todos podem ver comunicados" ON comunicados FOR SELECT TO authenticated USING (true)';
    
    EXECUTE 'DROP POLICY IF EXISTS "Apenas admins e síndicos podem criar comunicados" ON comunicados';
    EXECUTE 'CREATE POLICY "Apenas admins e síndicos podem criar comunicados" ON comunicados FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
    
    EXECUTE 'DROP POLICY IF EXISTS "Apenas admins e síndicos podem atualizar comunicados" ON comunicados';
    EXECUTE 'CREATE POLICY "Apenas admins e síndicos podem atualizar comunicados" ON comunicados FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
  END IF;
  
  -- Coleta de lixo
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coleta_lixo') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Todos podem ver horários de coleta" ON coleta_lixo';
    EXECUTE 'CREATE POLICY "Todos podem ver horários de coleta" ON coleta_lixo FOR SELECT TO authenticated USING (true)';
    
    EXECUTE 'DROP POLICY IF EXISTS "Apenas admins podem inserir coleta de lixo" ON coleta_lixo';
    EXECUTE 'CREATE POLICY "Apenas admins podem inserir coleta de lixo" ON coleta_lixo FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
    
    EXECUTE 'DROP POLICY IF EXISTS "Apenas admins podem atualizar coleta de lixo" ON coleta_lixo';
    EXECUTE 'CREATE POLICY "Apenas admins podem atualizar coleta de lixo" ON coleta_lixo FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
    
    EXECUTE 'DROP POLICY IF EXISTS "Apenas admins podem deletar coleta de lixo" ON coleta_lixo';
    EXECUTE 'CREATE POLICY "Apenas admins podem deletar coleta de lixo" ON coleta_lixo FOR DELETE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
  END IF;
  
  -- Encomendas
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'encomendas') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Usuários podem ver suas próprias encomendas" ON encomendas';
    EXECUTE 'CREATE POLICY "Usuários podem ver suas próprias encomendas" ON encomendas FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
    
    EXECUTE 'DROP POLICY IF EXISTS "Administradores podem inserir encomendas" ON encomendas';
    EXECUTE 'CREATE POLICY "Administradores podem inserir encomendas" ON encomendas FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
    
    EXECUTE 'DROP POLICY IF EXISTS "Administradores podem atualizar encomendas" ON encomendas';
    EXECUTE 'CREATE POLICY "Administradores podem atualizar encomendas" ON encomendas FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
  END IF;
  
  -- Classificados
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'classificados') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Todos podem ver classificados ativos" ON classificados';
    EXECUTE 'CREATE POLICY "Todos podem ver classificados ativos" ON classificados FOR SELECT TO authenticated USING (ativo = true OR user_id = auth.uid())';
    
    EXECUTE 'DROP POLICY IF EXISTS "Usuários podem criar classificados" ON classificados';
    EXECUTE 'CREATE POLICY "Usuários podem criar classificados" ON classificados FOR INSERT WITH CHECK (user_id = auth.uid())';
    
    EXECUTE 'DROP POLICY IF EXISTS "Usuários podem editar seus próprios classificados" ON classificados';
    EXECUTE 'CREATE POLICY "Usuários podem editar seus próprios classificados" ON classificados FOR UPDATE USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
  END IF;
  
  -- Sugestões
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sugestoes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Usuários podem criar sugestões" ON sugestoes';
    EXECUTE 'CREATE POLICY "Usuários podem criar sugestões" ON sugestoes FOR INSERT WITH CHECK (user_id = auth.uid())';
    
    EXECUTE 'DROP POLICY IF EXISTS "Administradores podem ver todas as sugestões" ON sugestoes';
    EXECUTE 'CREATE POLICY "Administradores podem ver todas as sugestões" ON sugestoes FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN (''admin'', ''sindico'')))';
  END IF;
END$$;

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Inserir perfil básico
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, now())
  ON CONFLICT (id) DO UPDATE SET
    email = new.email,
    updated_at = now();
  
  -- Criar papel padrão como morador
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (new.id, 'morador', now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função após signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON user_roles;
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
