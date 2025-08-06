-- Create comunicados table
CREATE TABLE public.comunicados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coleta_lixo table
CREATE TABLE public.coleta_lixo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dia_da_semana TEXT NOT NULL,
  tipo_de_lixo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create encomendas table
CREATE TABLE public.encomendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_morador TEXT NOT NULL,
  apartamento INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  recebida BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create servicos_moradores table
CREATE TABLE public.servicos_moradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_morador TEXT NOT NULL,
  apartamento INTEGER NOT NULL,
  tipo_servico TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coleta_lixo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encomendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos_moradores ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a condominium app)
CREATE POLICY "Allow public read access on comunicados" 
ON public.comunicados FOR SELECT USING (true);

CREATE POLICY "Allow public read access on coleta_lixo" 
ON public.coleta_lixo FOR SELECT USING (true);

CREATE POLICY "Allow public read access on encomendas" 
ON public.encomendas FOR SELECT USING (true);

CREATE POLICY "Allow public read access on servicos_moradores" 
ON public.servicos_moradores FOR SELECT USING (true);

-- Admin insert/update/delete policies (you can modify these later for proper authentication)
CREATE POLICY "Allow admin operations on comunicados" 
ON public.comunicados FOR ALL USING (true);

CREATE POLICY "Allow admin operations on coleta_lixo" 
ON public.coleta_lixo FOR ALL USING (true);

CREATE POLICY "Allow admin operations on encomendas" 
ON public.encomendas FOR ALL USING (true);

CREATE POLICY "Allow admin operations on servicos_moradores" 
ON public.servicos_moradores FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_comunicados_updated_at
  BEFORE UPDATE ON public.comunicados
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coleta_lixo_updated_at
  BEFORE UPDATE ON public.coleta_lixo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_encomendas_updated_at
  BEFORE UPDATE ON public.encomendas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_servicos_moradores_updated_at
  BEFORE UPDATE ON public.servicos_moradores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();