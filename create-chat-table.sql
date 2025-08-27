-- Criar tabela para mensagens do chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT NOT NULL,
    text TEXT NOT NULL,
    user_id UUID NOT NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    image TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler mensagens do chat" ON chat_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Criar política para permitir inserção para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir mensagens" ON chat_messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Criar política para permitir atualização apenas pelo autor
CREATE POLICY "Usuários podem atualizar apenas suas mensagens" ON chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Criar política para permitir exclusão apenas pelo autor
CREATE POLICY "Usuários podem deletar apenas suas mensagens" ON chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_chat_messages_updated_at 
    BEFORE UPDATE ON chat_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir algumas mensagens de exemplo (opcional)
INSERT INTO chat_messages (room_id, text, user_id, user_name, user_avatar) VALUES
    ('geral', 'Bem-vindos ao chat do condomínio! 👋', '00000000-0000-0000-0000-000000000000', 'Sistema', ''),
    ('geral', 'Olá pessoal! Como estão? 😊', '00000000-0000-0000-0000-000000000000', 'Sistema', ''),
    ('geral', 'Lembrem-se de manter o condomínio limpo! 🧹', '00000000-0000-0000-0000-000000000000', 'Sistema', '');

-- Comentários sobre a estrutura
COMMENT ON TABLE chat_messages IS 'Tabela para armazenar mensagens do chat do condomínio';
COMMENT ON COLUMN chat_messages.room_id IS 'ID da sala de chat (ex: geral, admin, etc)';
COMMENT ON COLUMN chat_messages.text IS 'Texto da mensagem';
COMMENT ON COLUMN chat_messages.user_id IS 'ID do usuário que enviou a mensagem';
COMMENT ON COLUMN chat_messages.user_name IS 'Nome do usuário que enviou a mensagem';
COMMENT ON COLUMN chat_messages.user_avatar IS 'URL do avatar do usuário';
COMMENT ON COLUMN chat_messages.image IS 'URL da imagem anexada (se houver)';
COMMENT ON COLUMN chat_messages.timestamp IS 'Timestamp de quando a mensagem foi enviada';
COMMENT ON COLUMN chat_messages.created_at IS 'Timestamp de criação do registro';
COMMENT ON COLUMN chat_messages.updated_at IS 'Timestamp da última atualização';
