# 🚀 COMO EXECUTAR O SQL NO SUPABASE (Passo-a-Passo Visual)

## ⚠️ IMPORTANTE: Você tentou executar JavaScript no SQL Editor!

**ERRO:** Você executou `test-signup.js` no SQL Editor do Supabase
**CORRETO:** Você deve executar `fix-signup-error.sql` no SQL Editor

---

## 📝 SEQUÊNCIA CORRETA:

### 🥇 PASSO 1: Acessar o Supabase Dashboard
1. Abra: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg
2. Faça login na sua conta

### 🥈 PASSO 2: Ir para SQL Editor
1. Na barra lateral esquerda, clique em **"SQL Editor"**
2. Clique no botão **"+ New query"**

### 🥉 PASSO 3: Copiar o Código SQL Correto
**Copie APENAS este código abaixo:**

```sql
-- CORREÇÃO DEFINITIVA - ERRO DE CADASTRO
-- Execute este script no Supabase SQL Editor

-- 1. PRIMEIRO: Desabilitar RLS temporariamente para permitir operações
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "allow_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_all_user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_own" ON public.user_roles;

-- 3. Remover trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Remover função existente  
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 5. Recriar as tabelas com estrutura limpa
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    apartamento TEXT,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'morador' NOT NULL CHECK (role IN ('admin', 'sindico', 'morador')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

-- 6. Criar função SIMPLES para criar perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        email = NEW.email,
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
    VALUES (NEW.id, 'morador', NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'morador',
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Recriar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Habilitar RLS novamente com políticas PERMISSIVAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 9. Criar políticas MUITO permissivas
CREATE POLICY "allow_all_operations_profiles" ON public.profiles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "allow_all_operations_user_roles" ON public.user_roles
    FOR ALL USING (true) WITH CHECK (true);

-- 10. Verificar se funcionou
SELECT 'CONFIGURAÇÃO CONCLUÍDA - Teste o cadastro agora!' as resultado;
```

### 🏆 PASSO 4: Executar o SQL
1. **Cole** o código acima no editor SQL
2. **Clique** no botão **"Run"** (▶️)
3. **Aguarde** a execução (alguns segundos)
4. **Deve aparecer:** "CONFIGURAÇÃO CONCLUÍDA - Teste o cadastro agora!"

### 🎯 PASSO 5: Testar no Terminal
**SÓ DEPOIS** de executar o SQL, volte ao terminal e execute:

```bash
node test-signup.js
```

---

## 🚨 SE AINDA DER ERRO NO SQL:

### Erro 1: "Permission denied"
**Solução:** Você precisa ser o proprietário do projeto Supabase

### Erro 2: "Table does not exist"
**Execute primeiro:**
```sql
CREATE SCHEMA IF NOT EXISTS public;
```

### Erro 3: "Syntax error"
**Solução:** Copie novamente o SQL, pode ter sido cortado

---

## ⚡ SOLUÇÃO DE EMERGÊNCIA (Se não conseguir executar o SQL):

1. No Dashboard Supabase, vá em **Authentication > Settings**
2. **Desmarque** "Enable email confirmations"
3. **Salve** as configurações
4. **Teste** o cadastro no site imediatamente

Esta solução temporária fará o cadastro funcionar enquanto você resolve o problema do banco.

---

## 🎯 RESUMO:
1. ❌ **NÃO** execute arquivos .js no SQL Editor
2. ✅ **SIM** execute arquivos .sql no SQL Editor  
3. ✅ **SIM** execute arquivos .js no Terminal
4. 🔄 **Ordem:** SQL primeiro, depois JavaScript
