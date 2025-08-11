# 🔧 Correção do Banco de Dados - Condomínio Conectado

## ✅ Status da Análise

**CONEXÃO**: ✅ Funcionando perfeitamente
**TABELAS**: ✅ Todas as 9 tabelas necessárias existem
**PROBLEMA IDENTIFICADO**: ❌ Políticas RLS muito restritivas

### Resultado da Análise Completa:
- 📊 **9 tabelas existentes**: comunicados, coleta_lixo, encomendas, servicos_moradores, classificados, agendamentos_salao, profiles, sugestoes, user_roles
- ✅ **1 tabela funcional**: agendamentos_salao 
- ❌ **5 tabelas com problemas**: comunicados, coleta_lixo, encomendas, servicos_moradores, classificados
- 🔒 **Causa**: Row Level Security (RLS) impedindo inserções

## Problema Identificado
As políticas de Row Level Security (RLS) do Supabase estão muito restritivas, impedindo inserções mesmo com a chave pública.

## Solução

### 1. Acesse o Painel do Supabase
Vá para: [https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor](https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor)

### 2. Solução Completa (RECOMENDADA)

**OPÇÃO MAIS FÁCIL**: Copie todo o conteúdo do arquivo `database-complete-fix.sql` e cole no SQL Editor do Supabase. Este arquivo contém:
- ✅ Correção de todas as políticas RLS
- ✅ Dados de exemplo para testar
- ✅ Índices necessários
- ✅ Verificações automáticas

### 2.1 Solução Manual (Alternativa)
Se preferir executar manualmente, use as queries abaixo no **SQL Editor** do Supabase:

```sql
-- Corrigir políticas restritivas para comunicados
DROP POLICY IF EXISTS "Allow public read access on comunicados" ON public.comunicados;
DROP POLICY IF EXISTS "Allow admin operations on comunicados" ON public.comunicados;
CREATE POLICY "Enable all access for comunicados" ON public.comunicados FOR ALL USING (true) WITH CHECK (true);

-- Corrigir políticas restritivas para coleta_lixo
DROP POLICY IF EXISTS "Allow public read access on coleta_lixo" ON public.coleta_lixo;
DROP POLICY IF EXISTS "Allow admin operations on coleta_lixo" ON public.coleta_lixo;
CREATE POLICY "Enable all access for coleta_lixo" ON public.coleta_lixo FOR ALL USING (true) WITH CHECK (true);

-- Corrigir políticas restritivas para encomendas
DROP POLICY IF EXISTS "Allow public read access on encomendas" ON public.encomendas;
DROP POLICY IF EXISTS "Allow admin operations on encomendas" ON public.encomendas;
CREATE POLICY "Enable all access for encomendas" ON public.encomendas FOR ALL USING (true) WITH CHECK (true);

-- Corrigir políticas restritivas para servicos_moradores
DROP POLICY IF EXISTS "Allow public read access on servicos_moradores" ON public.servicos_moradores;
DROP POLICY IF EXISTS "Allow admin operations on servicos_moradores" ON public.servicos_moradores;
CREATE POLICY "Enable all access for servicos_moradores" ON public.servicos_moradores FOR ALL USING (true) WITH CHECK (true);
```

### 3. Teste a Correção
Após executar as queries, execute no terminal:

```bash
npm run setup-db
```

Este comando irá testar se as inserções estão funcionando corretamente.

### 4. Inicie o Sistema
Se tudo estiver funcionando, inicie o sistema normalmente:

```bash
npm run dev
```

## Scripts Disponíveis

- `npm run analyze-db` - Análise completa do banco de dados (MAIS DETALHADO)
- `npm run setup-db` - Testa a conexão e funcionalidade do banco de dados  
- `npm run fix-db` - Mostra as queries SQL necessárias para corrigir as políticas RLS
- `npm run dev` - Inicia o servidor de desenvolvimento

## Estrutura do Banco de Dados

O sistema possui as seguintes tabelas principais:
- **comunicados** - Avisos e comunicados do condomínio
- **coleta_lixo** - Cronograma de coleta de lixo
- **encomendas** - Controle de encomendas dos moradores
- **servicos_moradores** - Serviços oferecidos por moradores
- **classificados** - Anúncios classificados
- **agendamentos_salao** - Reservas do salão de festas
- **profiles** - Perfis de usuários
- **sugestoes** - Sugestões dos moradores

## Configuração de Ambiente

O arquivo `.env` foi criado automaticamente com as configurações necessárias:
- Senha de admin padrão: `admin123`
- Conexão com Supabase já configurada

## ⚠️ Importante

As políticas RLS foram configuradas de forma permissiva para facilitar o desenvolvimento e teste. Em um ambiente de produção, você deve implementar políticas de segurança mais específicas baseadas na autenticação de usuários.

## 🆘 Problemas Persistentes?

Se ainda houver problemas após seguir estas instruções:

1. Verifique se você está logado no projeto correto do Supabase
2. Certifique-se de que as queries foram executadas sem erro
3. Execute `npm run setup-db` novamente para verificar o status
4. Verifique o console do navegador (F12) para erros específicos

O sistema deveria funcionar perfeitamente após a correção das políticas RLS!
