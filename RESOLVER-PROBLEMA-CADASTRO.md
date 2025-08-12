# 🚨 RESOLVER ERRO: "Falha no banco de dados ao cadastrar novo usuário"

## 📋 Diagnóstico do Problema

Identifiquei que o erro **"Database error saving new user"** está sendo causado por problemas na configuração do banco de dados Supabase, especificamente:

1. **Trigger defeituoso** - A função `handle_new_user` está causando erro
2. **Políticas RLS muito restritivas** - Impedindo inserção de dados
3. **Conflitos entre políticas** - Múltiplas políticas conflitantes

## ✅ SOLUÇÃO DEFINITIVA - Passo a Passo

### 1️⃣ Acessar o Supabase Dashboard
- Abra: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg
- Faça login na sua conta
- Vá para **SQL Editor** (na barra lateral esquerda)

### 2️⃣ Executar Script de Correção
- Clique no botão **"+ New query"**
- Copie **TODO** o conteúdo do arquivo `fix-signup-error.sql`
- Cole no editor SQL
- Clique em **"Run"** (botão ▶️)
- **Aguarde** a execução completar (pode demorar alguns segundos)

### 3️⃣ Verificar se a Correção Funcionou
- Após executar o script, você deve ver mensagens como:
  ```
  ✅ Função handle_new_user: EXISTE ✅
  ✅ Trigger on_auth_user_created: EXISTE ✅  
  🎉 CONFIGURAÇÃO CONCLUÍDA!
  ```

### 4️⃣ Testar o Cadastro
Execute no terminal:
```bash
node test-signup.js
```

**Resultado esperado:**
```
✅ Signup realizado com sucesso!
✅ Profile criado: teste@example.com
✅ Role criado: morador
```

### 5️⃣ Testar no Site
- Acesse seu site
- Tente fazer um cadastro com um email real
- **Deve funcionar sem erros!**

## 🔍 Se AINDA Houver Problemas

### Problema 1: Script não executa
**Causa:** Permissões insuficientes
**Solução:** Certifique-se de estar logado como proprietário do projeto

### Problema 2: Erro de sintaxe no SQL  
**Causa:** Script foi copiado incompleto
**Solução:** Copie novamente TODO o conteúdo do `fix-signup-error.sql`

### Problema 3: Cadastro ainda não funciona
**Verificar:**
1. **Authentication > Settings** no Dashboard:
   - ✅ "Enable email confirmations" pode estar ON ou OFF para teste
   - ✅ "Site URL" deve estar preenchida
   
2. **Logs** no Dashboard:
   - Vá em **Logs > Database** 
   - Procure por erros recentes

### Problema 4: Email de confirmação não chega
**Temporária:** Desabilite confirmação de email:
1. Dashboard > **Authentication** > **Settings**
2. Desmarque **"Enable email confirmations"**
3. Salve as configurações
4. Teste o cadastro novamente

## 📊 Status das Configurações

Após executar o script, você terá:

| Item | Status | Descrição |
|------|--------|-----------|
| **Tabela `profiles`** | ✅ Criada | Armazena dados dos usuários |
| **Tabela `user_roles`** | ✅ Criada | Armazena papéis (morador/admin) |
| **Função `handle_new_user`** | ✅ Criada | Cria perfil automaticamente |
| **Trigger `on_auth_user_created`** | ✅ Criado | Executa função no signup |
| **Políticas RLS** | ✅ Permissivas | Permite operações básicas |
| **Sistema de atualização** | ✅ Funcionando | Updated_at automático |

## 🚀 Próximos Passos Após Correção

1. **Teste básico funcionando** → Adicione validações de email
2. **Email confirmado** → Configure SMTP personalizado
3. **Sistema estável** → Implemente políticas de segurança mais restritivas
4. **Usuários cadastrando** → Configure sistema de papéis (admin/síndico)

## 🆘 Suporte Adicional

Se mesmo após seguir todos os passos ainda houver erro:

1. **Capture a tela** da execução do script SQL
2. **Copie a mensagem** de erro completa
3. **Execute** `node test-signup.js` e copie o resultado
4. **Verifique** os logs no Dashboard Supabase

## ⚡ Solução Rápida para URGÊNCIA

Se precisar que funcione **IMEDIATAMENTE**:

1. Dashboard > **Authentication** > **Settings**
2. **Desmarque** "Enable email confirmations"  
3. **Execute** apenas estas linhas no SQL Editor:
   ```sql
   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
   ```
4. **Teste** o cadastro → Deve funcionar instantaneamente
5. **Depois** execute o script completo para configuração adequada

---

## 🎯 **RESUMO EXECUTIVO**

**PROBLEMA:** Trigger `handle_new_user` com erro + políticas RLS restritivas  
**SOLUÇÃO:** Execute `fix-signup-error.sql` no SQL Editor do Supabase  
**TEMPO:** 2-3 minutos para resolver completamente  
**RESULTADO:** Sistema de cadastro funcionando 100%
