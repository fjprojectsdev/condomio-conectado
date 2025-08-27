-- Criar tabela para sugestões dos usuários
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_sugestoes_user_id ON sugestoes(user_id);
CREATE INDEX IF NOT EXISTS idx_sugestoes_status ON sugestoes(status);
CREATE INDEX IF NOT EXISTS idx_sugestoes_created_at ON sugestoes(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE sugestoes ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler sugestões" ON sugestoes
    FOR SELECT USING (auth.role() = 'authenticated');

-- Criar política para permitir inserção para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir sugestões" ON sugestoes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Criar política para permitir atualização apenas pelo autor ou admin
CREATE POLICY "Usuários podem atualizar suas sugestões ou admins podem atualizar todas" ON sugestoes
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'fjprojects2025@gmail.com'
    );

-- Criar política para permitir exclusão apenas pelo autor ou admin
CREATE POLICY "Usuários podem deletar suas sugestões ou admins podem deletar todas" ON sugestoes
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = 'fjprojects2025@gmail.com'
    );

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_sugestoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_sugestoes_updated_at
    BEFORE UPDATE ON sugestoes
    FOR EACH ROW
    EXECUTE FUNCTION update_sugestoes_updated_at();

-- Comentários sobre a estrutura
COMMENT ON TABLE sugestoes IS 'Tabela para armazenar sugestões dos moradores do condomínio';
COMMENT ON COLUMN sugestoes.user_id IS 'ID do usuário que enviou a sugestão';
COMMENT ON COLUMN sugestoes.user_name IS 'Nome do usuário que enviou a sugestão';
COMMENT ON COLUMN sugestoes.titulo IS 'Título da sugestão';
COMMENT ON COLUMN sugestoes.descricao IS 'Descrição detalhada da sugestão';
COMMENT ON COLUMN sugestoes.imagem IS 'URL da imagem anexada (se houver)';
COMMENT ON COLUMN sugestoes.status IS 'Status da sugestão: Recebida, Em análise, Aprovada, Recusada';
COMMENT ON COLUMN sugestoes.resposta_admin IS 'Resposta da administração para a sugestão';
COMMENT ON COLUMN sugestoes.created_at IS 'Timestamp de criação da sugestão';
COMMENT ON COLUMN sugestoes.updated_at IS 'Timestamp da última atualização';
