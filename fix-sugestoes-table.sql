-- Script para corrigir a tabela de sugestões
-- Execute este script no SQL Editor do Supabase

-- 1. Remover tabela existente (se houver)
DROP TABLE IF EXISTS sugestoes CASCADE;

-- 2. Criar nova tabela com estrutura correta
CREATE TABLE sugestoes (
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

-- 3. Criar índices para melhor performance
CREATE INDEX idx_sugestoes_user_id ON sugestoes(user_id);
CREATE INDEX idx_sugestoes_status ON sugestoes(status);
CREATE INDEX idx_sugestoes_created_at ON sugestoes(created_at);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE sugestoes ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS
CREATE POLICY "Usuários autenticados podem ler sugestões" ON sugestoes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir sugestões" ON sugestoes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem atualizar suas sugestões ou admins podem atualizar todas" ON sugestoes
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'fjprojects2025@gmail.com'
    );

CREATE POLICY "Usuários podem deletar suas sugestões ou admins podem deletar todas" ON sugestoes
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'fjprojects2025@gmail.com'
    );

-- 6. Criar função e trigger para updated_at
CREATE OR REPLACE FUNCTION update_sugestoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sugestoes_updated_at
    BEFORE UPDATE ON sugestoes
    FOR EACH ROW
    EXECUTE FUNCTION update_sugestoes_updated_at();

-- 7. Inserir dados de teste
INSERT INTO sugestoes (user_id, user_name, titulo, descricao, status) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Usuário Teste', 'Melhoria na área de lazer', 'Seria interessante adicionar mais equipamentos na academia', 'Recebida'),
    ('00000000-0000-0000-0000-000000000002', 'Morador Exemplo', 'Segurança no estacionamento', 'Instalar mais câmeras de segurança', 'Em análise');

-- 8. Verificar se tudo foi criado corretamente
SELECT 'Tabela criada com sucesso!' as resultado;

-- 9. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'sugestoes'
ORDER BY ordinal_position;

-- 10. Verificar dados inseridos
SELECT * FROM sugestoes ORDER BY created_at DESC;

-- 11. Verificar políticas RLS
SELECT policyname, cmd, permissive
FROM pg_policies 
WHERE tablename = 'sugestoes';
