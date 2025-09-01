-- Script para corrigir a falha de segurança RLS na tabela de chat
-- Execute este script no seu Supabase SQL Editor.

-- 1. Habilitar Row Level Security (RLS) na tabela de chat
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas para garantir uma aplicação limpa (seguro de executar)
DROP POLICY IF EXISTS "Usuários autenticados podem ler mensagens do chat" ON public.chat_messages;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir mensagens" ON public.chat_messages;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas suas mensagens" ON public.chat_messages;
DROP POLICY IF EXISTS "Usuários podem deletar apenas suas mensagens" ON public.chat_messages;

-- 3. Recriar as políticas de segurança corretas

-- Política para permitir leitura para usuários autenticados
CREATE POLICY "Usuários autenticados podem ler mensagens do chat" ON public.chat_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir inserção para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir mensagens" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir atualização apenas pelo autor
CREATE POLICY "Usuários podem atualizar apenas suas mensagens" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir exclusão apenas pelo autor
CREATE POLICY "Usuários podem deletar apenas suas mensagens" ON public.chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Mensagem de sucesso
SELECT '✅ Segurança da tabela de chat foi configurada com sucesso!' as resultado;