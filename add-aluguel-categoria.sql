-- Script para adicionar a opção "aluguel" ao enum classificado_categoria
-- Execute este comando no painel SQL do Supabase

ALTER TYPE public.classificado_categoria ADD VALUE 'aluguel';

-- Verificar se foi adicionado corretamente
SELECT 
    t.typname AS enum_name,
    STRING_AGG(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public' AND t.typname = 'classificado_categoria'
GROUP BY t.typname;
