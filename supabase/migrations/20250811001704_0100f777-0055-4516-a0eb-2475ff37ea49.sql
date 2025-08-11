-- Create enums for controlled values
DO $$ BEGIN
  CREATE TYPE public.classificado_categoria AS ENUM ('venda', 'compra', 'servico', 'doacao', 'troca');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.agendamento_status AS ENUM ('pendente', 'confirmado', 'cancelado');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create table: classificados
CREATE TABLE IF NOT EXISTS public.classificados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria public.classificado_categoria NOT NULL,
  preco NUMERIC(10,2),
  nome_contato TEXT NOT NULL,
  telefone TEXT NOT NULL,
  apartamento TEXT NOT NULL,
  bloco TEXT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table: agendamentos_salao
CREATE TABLE IF NOT EXISTS public.agendamentos_salao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_solicitante TEXT NOT NULL,
  telefone TEXT NOT NULL,
  data_evento DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  tipo_evento TEXT NOT NULL,
  observacoes TEXT,
  status public.agendamento_status NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.classificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos_salao ENABLE ROW LEVEL SECURITY;

-- Policies (permissive for now; refine later when auth is in place)
DO $$ BEGIN
  CREATE POLICY "Classificados are readable by everyone"
  ON public.classificados FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can insert classificados"
  ON public.classificados FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can update classificados"
  ON public.classificados FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can delete classificados"
  ON public.classificados FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Agendamentos are readable by everyone"
  ON public.agendamentos_salao FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can insert agendamentos"
  ON public.agendamentos_salao FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can update agendamentos"
  ON public.agendamentos_salao FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can delete agendamentos"
  ON public.agendamentos_salao FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Triggers for updated_at
DO $$ BEGIN
  CREATE TRIGGER update_classificados_updated_at
  BEFORE UPDATE ON public.classificados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER update_agendamentos_salao_updated_at
  BEFORE UPDATE ON public.agendamentos_salao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_classificados_ativo_created_at ON public.classificados (ativo, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agendamentos_salao_data_evento ON public.agendamentos_salao (data_evento);
