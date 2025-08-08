-- Safe migration: add columns only if they don't exist
-- Adicionar campo bloco às tabelas que têm apartamento
ALTER TABLE public.encomendas ADD COLUMN IF NOT EXISTS bloco text;
ALTER TABLE public.servicos_moradores ADD COLUMN IF NOT EXISTS bloco text;

-- Adicionar campo telefone para prestadores de serviço
ALTER TABLE public.servicos_moradores ADD COLUMN IF NOT EXISTS telefone text;