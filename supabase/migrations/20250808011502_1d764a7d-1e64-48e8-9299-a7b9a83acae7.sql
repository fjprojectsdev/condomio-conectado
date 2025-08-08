-- Adicionar campo bloco às tabelas que têm apartamento
ALTER TABLE public.encomendas ADD COLUMN bloco text;
ALTER TABLE public.servicos_moradores ADD COLUMN bloco text;

-- Adicionar campo telefone para prestadores de serviço
ALTER TABLE public.servicos_moradores ADD COLUMN telefone text;