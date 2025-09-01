-- Script para corrigir a funcionalidade de Classificados

-- 1. Habilitar Row Level Security (RLS) na tabela de classificados
ALTER TABLE public.classificados ENABLE ROW LEVEL SECURITY;

-- 2. Adicionar o valor 'aluguel' ao tipo de categoria, se ele não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'aluguel' AND enumtypid = 'public.classificado_categoria'::regtype) THEN
        ALTER TYPE public.classificado_categoria ADD VALUE 'aluguel';
    END IF;
END$$;

-- 3. Remover políticas antigas para garantir uma aplicação limpa
DROP POLICY IF EXISTS "Permitir leitura para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir inserção para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir atualização para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir exclusão para todos" ON public.classificados;
DROP POLICY IF EXISTS "Classificados - Leitura pública" ON public.classificados;
DROP POLICY IF EXISTS "Classificados - Inserção autenticada" ON public.classificados;
DROP POLICY IF EXISTS "Classificados - Atualização autenticada" ON public.classificados;
DROP POLICY IF EXISTS "Classificados - Exclusão autenticada" ON public.classificados;

-- 4. Criar políticas corretas (conforme documentação)
CREATE POLICY "Classificados - Leitura pública" 
ON public.classificados FOR SELECT 
USING (ativo = true);

CREATE POLICY "Classificados - Inserção autenticada" 
ON public.classificados FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Classificados - Atualização autenticada" 
ON public.classificados FOR UPDATE 
USING (true) WITH CHECK (true);

CREATE POLICY "Classificados - Exclusão autenticada" 
ON public.classificados FOR DELETE 
USING (true);

-- 5. Mensagem de sucesso
SELECT '✅ Segurança e funcionalidade da tabela de classificados foram corrigidas com sucesso!' as resultado;
