-- Script adicional para configurar políticas das outras tabelas
-- Execute APÓS setup-auth-minimal.sql ter funcionado

-- Habilitar RLS em outras tabelas (execute apenas se as tabelas existirem)

-- Comunicados
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comunicados_select_all" ON comunicados;
CREATE POLICY "comunicados_select_all" 
ON comunicados FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "comunicados_insert_admin" ON comunicados;
CREATE POLICY "comunicados_insert_admin" 
ON comunicados FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "comunicados_update_admin" ON comunicados;
CREATE POLICY "comunicados_update_admin" 
ON comunicados FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Coleta de lixo
ALTER TABLE coleta_lixo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coleta_lixo_select_all" ON coleta_lixo;
CREATE POLICY "coleta_lixo_select_all" 
ON coleta_lixo FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "coleta_lixo_modify_admin" ON coleta_lixo;
CREATE POLICY "coleta_lixo_modify_admin" 
ON coleta_lixo FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Encomendas
ALTER TABLE encomendas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "encomendas_select_own_or_admin" ON encomendas;
CREATE POLICY "encomendas_select_own_or_admin" 
ON encomendas FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "encomendas_modify_admin" ON encomendas;
CREATE POLICY "encomendas_modify_admin" 
ON encomendas FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Classificados
ALTER TABLE classificados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "classificados_select_active_or_own" ON classificados;
CREATE POLICY "classificados_select_active_or_own" 
ON classificados FOR SELECT 
TO authenticated 
USING (ativo = true OR user_id = auth.uid());

DROP POLICY IF EXISTS "classificados_insert_own" ON classificados;
CREATE POLICY "classificados_insert_own" 
ON classificados FOR INSERT 
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "classificados_update_own_or_admin" ON classificados;
CREATE POLICY "classificados_update_own_or_admin" 
ON classificados FOR UPDATE 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

-- Sugestões
ALTER TABLE sugestoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sugestoes_select_own_or_admin" ON sugestoes;
CREATE POLICY "sugestoes_select_own_or_admin" 
ON sugestoes FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "sugestoes_insert_own" ON sugestoes;
CREATE POLICY "sugestoes_insert_own" 
ON sugestoes FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Agendamentos do salão
ALTER TABLE agendamentos_salao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "agendamentos_select_own_or_admin" ON agendamentos_salao;
CREATE POLICY "agendamentos_select_own_or_admin" 
ON agendamentos_salao FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "agendamentos_insert_own" ON agendamentos_salao;
CREATE POLICY "agendamentos_insert_own" 
ON agendamentos_salao FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Serviços de moradores
ALTER TABLE servicos_moradores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "servicos_select_own_or_admin" ON servicos_moradores;
CREATE POLICY "servicos_select_own_or_admin" 
ON servicos_moradores FOR SELECT 
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'sindico')
  )
);

DROP POLICY IF EXISTS "servicos_insert_own" ON servicos_moradores;
CREATE POLICY "servicos_insert_own" 
ON servicos_moradores FOR INSERT 
WITH CHECK (user_id = auth.uid());
