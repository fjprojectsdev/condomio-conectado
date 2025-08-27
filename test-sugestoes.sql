-- Script de teste para verificar e configurar sugestões
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'sugestoes'
);

-- 2. Se não existir, criar a tabela
CREATE TABLE IF NOT EXISTS sugestoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_name TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    imagem TEXT,
    status TEXT DEFAULT 'Recebida' CHECK (status IN ('Recebida', 'Em análise', 'Aprovada', 'Recusada')),
    resposta_admin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'sugestoes'
ORDER BY ordinal_position;

-- 4. Criar índices
CREATE INDEX IF NOT EXISTS idx_sugestoes_user_id ON sugestoes(user_id);
CREATE INDEX IF NOT EXISTS idx_sugestoes_status ON sugestoes(status);
CREATE INDEX IF NOT EXISTS idx_sugestoes_created_at ON sugestoes(created_at);

-- 5. Habilitar RLS
ALTER TABLE sugestoes ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas RLS
DROP POLICY IF EXISTS "Usuários autenticados podem ler sugestões" ON sugestoes;
CREATE POLICY "Usuários autenticados podem ler sugestões" ON sugestoes
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários autenticados podem inserir sugestões" ON sugestoes;
CREATE POLICY "Usuários autenticados podem inserir sugestões" ON sugestoes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem atualizar suas sugestões ou admins podem atualizar todas" ON sugestoes;
CREATE POLICY "Usuários podem atualizar suas sugestões ou admins podem atualizar todas" ON sugestoes
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'fjprojects2025@gmail.com'
    );

DROP POLICY IF EXISTS "Usuários podem deletar suas sugestões ou admins podem deletar todas" ON sugestoes;
CREATE POLICY "Usuários podem deletar suas sugestões ou admins podem deletar todas" ON sugestoes
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'fjprojects2025@gmail.com'
    );

-- 7. Criar função e trigger para updated_at
CREATE OR REPLACE FUNCTION update_sugestoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_sugestoes_updated_at ON sugestoes;
CREATE TRIGGER update_sugestoes_updated_at
    BEFORE UPDATE ON sugestoes
    FOR EACH ROW
    EXECUTE FUNCTION update_sugestoes_updated_at();

-- 8. Inserir dados de teste (opcional)
INSERT INTO sugestoes (user_id, user_name, titulo, descricao, status) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Usuário Teste', 'Melhoria na área de lazer', 'Seria interessante adicionar mais equipamentos na academia', 'Recebida'),
    ('00000000-0000-0000-0000-000000000002', 'Morador Exemplo', 'Segurança no estacionamento', 'Instalar mais câmeras de segurança', 'Em análise')
ON CONFLICT (id) DO NOTHING;

-- 9. Verificar dados inseridos
SELECT * FROM sugestoes ORDER BY created_at DESC;

-- 10. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'sugestoes';
