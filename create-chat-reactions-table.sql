-- Script para criar tabela de reações do chat
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de reações
CREATE TABLE IF NOT EXISTS chat_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_chat_reactions_message_id ON chat_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_reactions_user_id ON chat_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_reactions_emoji ON chat_reactions(emoji);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE chat_reactions ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS
CREATE POLICY "Usuários autenticados podem ver reações" ON chat_reactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem criar reações" ON chat_reactions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem remover suas próprias reações" ON chat_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Função para obter reações agrupadas por mensagem
CREATE OR REPLACE FUNCTION get_message_reactions()
RETURNS TABLE (
    message_id UUID,
    emoji TEXT,
    user_count BIGINT,
    user_ids UUID[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cr.message_id,
        cr.emoji,
        COUNT(*)::BIGINT as user_count,
        ARRAY_AGG(cr.user_id) as user_ids
    FROM chat_reactions cr
    GROUP BY cr.message_id, cr.emoji
    ORDER BY cr.message_id, cr.emoji;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Verificar se tudo foi criado
SELECT 'Tabela de reações criada com sucesso!' as resultado;

-- 7. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'chat_reactions'
ORDER BY ordinal_position;
