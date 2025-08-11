-- Script para configurar autenticação e políticas de segurança
-- Execute este script no SQL Editor do Supabase

-- Primeiro, verificar e atualizar o enum app_role para incluir 'sindico'
DO $$
BEGIN
  -- Verificar se o enum app_role existe e adicionar 'sindico' se não existir
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sindico' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
    ALTER TYPE app_role ADD VALUE 'sindico';
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    -- Se o enum não existe, criar com todos os valores
    CREATE TYPE app_role AS ENUM ('admin', 'sindico', 'morador');
END$$;

-- Habilitar Row Level Security (RLS) em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE coleta_lixo ENABLE ROW LEVEL SECURITY;
ALTER TABLE encomendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos_moradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE classificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos_salao ENABLE ROW LEVEL SECURITY;
ALTER TABLE sugestoes ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela profiles
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON profiles;
CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

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

-- Políticas para comunicados
DROP POLICY IF EXISTS "Todos podem ver comunicados" ON comunicados;
CREATE POLICY "Todos podem ver comunicados" 
ON comunicados FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Apenas admins e síndicos podem criar comunicados" ON comunicados;
CREATE POLICY "Apenas admins e síndicos podem criar comunicados" 
ON comunicados FOR INSERT 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "Apenas admins e síndicos podem atualizar comunicados" ON comunicados;
CREATE POLICY "Apenas admins e síndicos podem atualizar comunicados" 
ON comunicados FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Políticas para coleta_lixo
DROP POLICY IF EXISTS "Todos podem ver horários de coleta" ON coleta_lixo;
CREATE POLICY "Todos podem ver horários de coleta" 
ON coleta_lixo FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Apenas admins podem gerenciar coleta de lixo" ON coleta_lixo;
CREATE POLICY "Apenas admins podem gerenciar coleta de lixo" 
ON coleta_lixo FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Políticas para encomendas
DROP POLICY IF EXISTS "Usuários podem ver suas próprias encomendas" ON encomendas;
CREATE POLICY "Usuários podem ver suas próprias encomendas" 
ON encomendas FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "Administradores podem gerenciar encomendas" ON encomendas;
CREATE POLICY "Administradores podem gerenciar encomendas" 
ON encomendas FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Políticas para serviços de moradores
DROP POLICY IF EXISTS "Usuários podem ver seus próprios serviços" ON servicos_moradores;
CREATE POLICY "Usuários podem ver seus próprios serviços" 
ON servicos_moradores FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "Usuários podem criar serviços" ON servicos_moradores;
CREATE POLICY "Usuários podem criar serviços" 
ON servicos_moradores FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Políticas para classificados
DROP POLICY IF EXISTS "Todos podem ver classificados ativos" ON classificados;
CREATE POLICY "Todos podem ver classificados ativos" 
ON classificados FOR SELECT 
TO authenticated
USING (ativo = true);

DROP POLICY IF EXISTS "Usuários podem criar classificados" ON classificados;
CREATE POLICY "Usuários podem criar classificados" 
ON classificados FOR INSERT 
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Usuários podem editar seus próprios classificados" ON classificados;
CREATE POLICY "Usuários podem editar seus próprios classificados" 
ON classificados FOR UPDATE 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Políticas para agendamentos do salão
DROP POLICY IF EXISTS "Usuários podem ver seus agendamentos" ON agendamentos_salao;
CREATE POLICY "Usuários podem ver seus agendamentos" 
ON agendamentos_salao FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "Usuários podem criar agendamentos" ON agendamentos_salao;
CREATE POLICY "Usuários podem criar agendamentos" 
ON agendamentos_salao FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Políticas para sugestões
DROP POLICY IF EXISTS "Administradores podem ver todas as sugestões" ON sugestoes;
CREATE POLICY "Administradores podem ver todas as sugestões" 
ON sugestoes FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "Usuários podem criar sugestões" ON sugestoes;
CREATE POLICY "Usuários podem criar sugestões" 
ON sugestoes FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, now())
  ON CONFLICT (id) DO NOTHING;
  
  -- Criar papel padrão como morador
  INSERT INTO public.user_roles (user_id, role, created_at)
  VALUES (new.id, 'morador'::app_role, now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função após signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
