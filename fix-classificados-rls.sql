-- Script para corrigir Row Level Security dos classificados
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, adicionar o valor 'aluguel' ao enum (se ainda não foi feito)
ALTER TYPE public.classificado_categoria ADD VALUE 'aluguel';

-- 2. Verificar se RLS está ativo na tabela classificados
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'classificados';

-- 3. Remover políticas existentes para recriar
DROP POLICY IF EXISTS "Permitir leitura para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir inserção para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir atualização para todos" ON public.classificados;
DROP POLICY IF EXISTS "Permitir exclusão para todos" ON public.classificados;

-- 4. Criar políticas mais permissivas para classificados

-- Política de leitura: qualquer pessoa pode ver classificados ativos
CREATE POLICY "Classificados - Leitura pública" 
ON public.classificados FOR SELECT 
USING (ativo = true);

-- Política de inserção: qualquer pessoa autenticada pode criar
CREATE POLICY "Classificados - Inserção autenticada" 
ON public.classificados FOR INSERT 
WITH CHECK (true);

-- Política de atualização: qualquer pessoa autenticada pode atualizar
CREATE POLICY "Classificados - Atualização autenticada" 
ON public.classificados FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Política de exclusão: qualquer pessoa autenticada pode excluir
CREATE POLICY "Classificados - Exclusão autenticada" 
ON public.classificados FOR DELETE 
USING (true);

-- 5. Para desenvolvimento, podemos temporariamente desabilitar RLS
-- CUIDADO: Só use isso em desenvolvimento!
-- ALTER TABLE public.classificados DISABLE ROW LEVEL SECURITY;

-- 6. Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'classificados';

-- 7. Inserir alguns dados de exemplo para teste
INSERT INTO public.classificados (titulo, descricao, categoria, preco, nome_contato, telefone, apartamento, bloco, ativo) VALUES
('Sofá 3 lugares', 'Sofá em ótimo estado, cor bege, muito confortável', 'venda', 800.00, 'Maria Silva', '(11) 99999-1111', '101', 'A', true),
('Procuro babá', 'Preciso de babá para criança de 3 anos, meio período', 'servico', NULL, 'João Santos', '(11) 99999-2222', '202', 'B', true),
('Apartamento para alugar', 'Apto 2 quartos, sala, cozinha, 1 banheiro', 'aluguel', 1500.00, 'Ana Costa', '(11) 99999-3333', '303', 'C', true),
('Doação de roupas', 'Roupas de bebê em bom estado para doação', 'doacao', NULL, 'Pedro Lima', '(11) 99999-4444', '404', 'D', true);

-- 8. Verificar se os dados foram inseridos
SELECT COUNT(*) as total_classificados FROM public.classificados;
SELECT categoria, COUNT(*) as quantidade FROM public.classificados GROUP BY categoria;

COMMIT;
