-- =====================================================
-- CONFIGURAÇÃO DE AUTENTICAÇÃO E PERMISSÕES SUPABASE
-- =====================================================

-- 1. Ativar confirmação de email (configurar no dashboard do Supabase)
-- Ir em: Authentication > Settings
-- - Enable email confirmations: ON
-- - Site URL: https://condominioconectado.netlify.app
-- - Redirect URLs: 
--   - https://condominioconectado.netlify.app/auth/callback
--   - http://localhost:8080/auth/callback

-- 2. Configurar templates de email (Authentication > Email Templates)
-- Confirma Account (signup):
-- Subject: Confirme sua conta no Condomínio Conectado
-- Body:
-- <h2>Bem-vindo ao Condomínio Conectado!</h2>
-- <p>Clique no link abaixo para confirmar sua conta:</p>
-- <p><a href="{{ .ConfirmationURL }}">Confirmar minha conta</a></p>
-- <p>Se você não criou uma conta, ignore este email.</p>

-- 3. Criar tabelas necessárias
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    apartamento TEXT,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'sindico', 'morador')) DEFAULT 'morador',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- 4. Criar tabela de comunicados
CREATE TABLE IF NOT EXISTS public.comunicados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT DEFAULT 'info' CHECK (tipo IN ('info', 'warning', 'important', 'success')),
    data TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Criar tabelas para outros recursos
CREATE TABLE IF NOT EXISTS public.coleta_lixo (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_de_lixo TEXT NOT NULL,
    dia_da_semana TEXT NOT NULL,
    horario TEXT DEFAULT '06:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.encomendas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_morador TEXT NOT NULL,
    apartamento INTEGER NOT NULL,
    bloco TEXT,
    descricao TEXT,
    recebida BOOLEAN DEFAULT FALSE,
    data_recebimento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.servicos_moradores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_morador TEXT NOT NULL,
    apartamento INTEGER NOT NULL,
    tipo_servico TEXT NOT NULL,
    telefone TEXT,
    descricao TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Configurar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coleta_lixo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encomendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos_moradores ENABLE ROW LEVEL SECURITY;

-- 7. Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Perfis são criados automaticamente" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. Políticas de segurança para user_roles
CREATE POLICY "Todos podem ver roles" ON public.user_roles
    FOR SELECT USING (true);

-- 9. Políticas para comunicados
CREATE POLICY "Todos podem ver comunicados" ON public.comunicados
    FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem criar comunicados" ON public.comunicados
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'sindico')
        )
    );

CREATE POLICY "Apenas admins podem atualizar comunicados" ON public.comunicados
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'sindico')
        )
    );

CREATE POLICY "Apenas admins podem deletar comunicados" ON public.comunicados
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'sindico')
        )
    );

-- 10. Políticas para outros recursos (liberadas para todos por enquanto)
CREATE POLICY "Todos podem ver coleta_lixo" ON public.coleta_lixo FOR SELECT USING (true);
CREATE POLICY "Todos podem modificar coleta_lixo" ON public.coleta_lixo FOR ALL USING (true);

CREATE POLICY "Todos podem ver encomendas" ON public.encomendas FOR SELECT USING (true);
CREATE POLICY "Todos podem modificar encomendas" ON public.encomendas FOR ALL USING (true);

CREATE POLICY "Todos podem ver servicos" ON public.servicos_moradores FOR SELECT USING (true);
CREATE POLICY "Todos podem modificar servicos" ON public.servicos_moradores FOR ALL USING (true);

-- 11. Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NOW(),
        NOW()
    );
    
    -- Criar role padrão de morador
    INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
    VALUES (NEW.id, 'morador', NOW(), NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Trigger para executar a função após signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 13. Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Triggers para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.comunicados
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.coleta_lixo
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.encomendas
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.servicos_moradores
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 15. Inserir alguns dados de exemplo
INSERT INTO public.comunicados (titulo, mensagem, tipo, data) VALUES 
('Bem-vindos ao Sistema', 'O sistema de gerenciamento do condomínio está funcionando!', 'success', NOW()),
('Manutenção Programada', 'Haverá manutenção do elevador no próximo sábado das 8h às 12h.', 'warning', NOW()),
('Assembleia Geral', 'Assembleia geral marcada para o dia 25 às 19h30 no salão de festas.', 'important', NOW());

INSERT INTO public.coleta_lixo (tipo_de_lixo, dia_da_semana) VALUES 
('Lixo Comum', 'segunda'),
('Lixo Comum', 'quarta'),
('Lixo Comum', 'sexta'),
('Reciclável', 'terça'),
('Reciclável', 'quinta');

-- =====================================================
-- INSTRUÇÕES DE CONFIGURAÇÃO NO DASHBOARD SUPABASE:
-- =====================================================
-- 1. Vá em Authentication > Settings
-- 2. Configure:
--    - Enable email confirmations: ON
--    - Site URL: https://condominioconectado.netlify.app
--    - Redirect URLs: adicione https://condominioconectado.netlify.app/auth/callback
-- 3. Em Authentication > Email Templates, personalize os emails
-- 4. Execute este script SQL no SQL Editor do Supabase
-- 5. Teste criando um usuário e verificando se recebe o email
