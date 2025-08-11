-- Remove políticas restritivas e cria políticas mais permissivas para facilitar o uso

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow public read access on comunicados" ON public.comunicados;
DROP POLICY IF EXISTS "Allow admin operations on comunicados" ON public.comunicados;
DROP POLICY IF EXISTS "Allow public read access on coleta_lixo" ON public.coleta_lixo;
DROP POLICY IF EXISTS "Allow admin operations on coleta_lixo" ON public.coleta_lixo;
DROP POLICY IF EXISTS "Allow public read access on encomendas" ON public.encomendas;
DROP POLICY IF EXISTS "Allow admin operations on encomendas" ON public.encomendas;
DROP POLICY IF EXISTS "Allow public read access on servicos_moradores" ON public.servicos_moradores;
DROP POLICY IF EXISTS "Allow admin operations on servicos_moradores" ON public.servicos_moradores;

-- Create permissive policies for comunicados
CREATE POLICY "Enable all access for comunicados" ON public.comunicados FOR ALL USING (true) WITH CHECK (true);

-- Create permissive policies for coleta_lixo
CREATE POLICY "Enable all access for coleta_lixo" ON public.coleta_lixo FOR ALL USING (true) WITH CHECK (true);

-- Create permissive policies for encomendas
CREATE POLICY "Enable all access for encomendas" ON public.encomendas FOR ALL USING (true) WITH CHECK (true);

-- Create permissive policies for servicos_moradores
CREATE POLICY "Enable all access for servicos_moradores" ON public.servicos_moradores FOR ALL USING (true) WITH CHECK (true);

-- Also ensure existing tables with newer policies work correctly
DROP POLICY IF EXISTS "Classificados are readable by everyone" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can insert classificados" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can update classificados" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can delete classificados" ON public.classificados;

CREATE POLICY "Enable all access for classificados" ON public.classificados FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Agendamentos are readable by everyone" ON public.agendamentos_salao;
DROP POLICY IF EXISTS "Anyone can insert agendamentos" ON public.agendamentos_salao;
DROP POLICY IF EXISTS "Anyone can update agendamentos" ON public.agendamentos_salao;
DROP POLICY IF EXISTS "Anyone can delete agendamentos" ON public.agendamentos_salao;

CREATE POLICY "Enable all access for agendamentos_salao" ON public.agendamentos_salao FOR ALL USING (true) WITH CHECK (true);
