-- CORREÇÃO COMPLETA DO BANCO DE DADOS - CONDOMÍNIO CONECTADO
-- Execute este SQL completo no painel do Supabase

-- =====================================================
-- 1. CORREÇÃO DAS POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Remover políticas restritivas e criar políticas permissivas

-- Comunicados
DROP POLICY IF EXISTS "Allow public read access on comunicados" ON public.comunicados;
DROP POLICY IF EXISTS "Allow admin operations on comunicados" ON public.comunicados;
CREATE POLICY "Enable all access for comunicados" ON public.comunicados FOR ALL USING (true) WITH CHECK (true);

-- Coleta de Lixo
DROP POLICY IF EXISTS "Allow public read access on coleta_lixo" ON public.coleta_lixo;
DROP POLICY IF EXISTS "Allow admin operations on coleta_lixo" ON public.coleta_lixo;
CREATE POLICY "Enable all access for coleta_lixo" ON public.coleta_lixo FOR ALL USING (true) WITH CHECK (true);

-- Encomendas
DROP POLICY IF EXISTS "Allow public read access on encomendas" ON public.encomendas;
DROP POLICY IF EXISTS "Allow admin operations on encomendas" ON public.encomendas;
CREATE POLICY "Enable all access for encomendas" ON public.encomendas FOR ALL USING (true) WITH CHECK (true);

-- Serviços dos Moradores
DROP POLICY IF EXISTS "Allow public read access on servicos_moradores" ON public.servicos_moradores;
DROP POLICY IF EXISTS "Allow admin operations on servicos_moradores" ON public.servicos_moradores;
CREATE POLICY "Enable all access for servicos_moradores" ON public.servicos_moradores FOR ALL USING (true) WITH CHECK (true);

-- Classificados (ajustar políticas existentes)
DROP POLICY IF EXISTS "Classificados are readable by everyone" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can insert classificados" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can update classificados" ON public.classificados;
DROP POLICY IF EXISTS "Anyone can delete classificados" ON public.classificados;
CREATE POLICY "Enable all access for classificados" ON public.classificados FOR ALL USING (true) WITH CHECK (true);

-- Agendamentos do Salão (ajustar políticas existentes)
DROP POLICY IF EXISTS "Agendamentos are readable by everyone" ON public.agendamentos_salao;
DROP POLICY IF EXISTS "Anyone can insert agendamentos" ON public.agendamentos_salao;
DROP POLICY IF EXISTS "Anyone can update agendamentos" ON public.agendamentos_salao;
DROP POLICY IF EXISTS "Anyone can delete agendamentos" ON public.agendamentos_salao;
CREATE POLICY "Enable all access for agendamentos_salao" ON public.agendamentos_salao FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 2. CORREÇÃO DE ÍNDICES E CONSTRAINTS
-- =====================================================

-- Adicionar índice único para coleta_lixo para permitir UPSERT
CREATE UNIQUE INDEX IF NOT EXISTS unique_coleta_lixo_dia_tipo 
ON public.coleta_lixo (dia_da_semana, tipo_de_lixo);

-- =====================================================
-- 3. DADOS DE EXEMPLO INICIAIS
-- =====================================================

-- Limpar dados existentes (opcional - remova se quiser manter dados)
-- TRUNCATE public.comunicados CASCADE;
-- TRUNCATE public.coleta_lixo CASCADE;

-- Comunicados de exemplo
INSERT INTO public.comunicados (titulo, mensagem, data) VALUES
('🎉 Sistema Funcionando!', 'O sistema de gerenciamento do condomínio está online e funcionando perfeitamente! Agora você pode cadastrar comunicados, gerenciar encomendas, consultar serviços e muito mais.', NOW()),
('📋 Como Usar o Sistema', 'Para acessar as funcionalidades administrativas, clique no botão Admin no menu e use a senha configurada. Você pode gerenciar comunicados, encomendas, classificados e agendamentos.', NOW() - INTERVAL '1 hour'),
('🏠 Bem-vindos Moradores', 'Este é o novo sistema digital do nosso condomínio. Aqui você encontra todas as informações importantes, pode consultar classificados de outros moradores e agendar o salão de festas.', NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- Cronograma de coleta de lixo
INSERT INTO public.coleta_lixo (dia_da_semana, tipo_de_lixo) VALUES
('segunda-feira', 'Lixo Comum'),
('quarta-feira', 'Lixo Reciclável'),  
('sexta-feira', 'Lixo Comum'),
('sábado', 'Lixo Orgânico')
ON CONFLICT (dia_da_semana, tipo_de_lixo) DO NOTHING;

-- Alguns serviços de moradores exemplo
INSERT INTO public.servicos_moradores (nome_morador, apartamento, tipo_servico, telefone, status) VALUES
('João Silva', 101, 'Encanador', '(11) 99999-1234', 'ativo'),
('Maria Santos', 205, 'Diarista', '(11) 98888-5678', 'ativo'),
('Pedro Costa', 310, 'Eletricista', '(11) 97777-9012', 'ativo'),
('Ana Oliveira', 150, 'Jardineira', '(11) 96666-3456', 'ativo')
ON CONFLICT DO NOTHING;

-- Alguns classificados exemplo
INSERT INTO public.classificados (titulo, descricao, categoria, preco, nome_contato, telefone, apartamento) VALUES
('Bike Infantil', 'Bicicleta aro 16 em ótimo estado, pouco usada. Cor azul com rodinhas laterais.', 'venda', 150.00, 'Carlos Mendes', '(11) 95555-7890', '204'),
('Aulas de Piano', 'Professora de piano oferece aulas particulares para crianças e adultos. Experiência de 10 anos.', 'servico', NULL, 'Lucia Fernandes', '(11) 94444-1234', '308'),
('Procuro Diarista', 'Procuro diarista para limpeza quinzenal. Preferencialmente com referências.', 'compra', NULL, 'Roberto Lima', '(11) 93333-5678', '102')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. VERIFICAÇÕES E TESTES
-- =====================================================

-- Verificar se as tabelas têm dados
SELECT 'comunicados' as tabela, COUNT(*) as registros FROM public.comunicados
UNION ALL
SELECT 'coleta_lixo' as tabela, COUNT(*) as registros FROM public.coleta_lixo  
UNION ALL
SELECT 'servicos_moradores' as tabela, COUNT(*) as registros FROM public.servicos_moradores
UNION ALL
SELECT 'classificados' as tabela, COUNT(*) as registros FROM public.classificados
UNION ALL
SELECT 'encomendas' as tabela, COUNT(*) as registros FROM public.encomendas
UNION ALL
SELECT 'agendamentos_salao' as tabela, COUNT(*) as registros FROM public.agendamentos_salao;

-- =====================================================
-- FINALIZADO! 
-- =====================================================
-- Após executar este SQL:
-- 1. Todas as políticas RLS estarão corrigidas
-- 2. O sistema terá dados de exemplo
-- 3. As inserções via aplicação devem funcionar
-- 4. Execute 'npm run setup-db' para testar
-- =====================================================
