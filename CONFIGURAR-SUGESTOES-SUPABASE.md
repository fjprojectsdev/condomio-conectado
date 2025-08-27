# 🚀 Configurar Sistema de Sugestões no Supabase

## 📋 **Passo a Passo para Configurar**

### **1. Acessar o Supabase Dashboard**
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: `ddzmibbhtjrgzdgflujg`

### **2. Executar o Script SQL CORRETO**
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New Query"**
- **IMPORTANTE:** Use o arquivo `fix-sugestoes-table.sql` (NÃO o test-sugestoes.sql)
- Copie e cole o conteúdo do arquivo `fix-sugestoes-table.sql`
- Clique em **"Run"** para executar

### **3. Por que usar fix-sugestoes-table.sql?**
- ✅ Remove tabela existente com estrutura incorreta
- ✅ Cria nova tabela com todas as colunas necessárias
- ✅ Resolve o erro "column status does not exist"
- ✅ Configura tudo do zero, garantindo funcionamento

### **4. Verificar se Funcionou**
Após executar o script, você deve ver:
- ✅ Tabela `sugestoes` recriada corretamente
- ✅ Todas as colunas criadas (incluindo `status`)
- ✅ Índices criados
- ✅ RLS habilitado
- ✅ Políticas de segurança configuradas
- ✅ Dados de teste inseridos

### **5. Testar no Aplicativo**
- Acesse a página "Caixa de Sugestões"
- Tente enviar uma nova sugestão
- Verifique se aparece na lista
- Acesse o painel administrativo para ver todas

---

## 🔧 **Se Houver Erros**

### **Erro: "column status does not exist"**
- ✅ **SOLUÇÃO:** Use o arquivo `fix-sugestoes-table.sql`
- ✅ Este script remove a tabela antiga e cria uma nova
- ✅ Garante que todas as colunas existam

### **Erro: "column user_id does not exist"**
- ✅ **SOLUÇÃO:** Use o arquivo `fix-sugestoes-table.sql`
- ✅ Este script resolve todos os problemas de colunas

### **Erro de Permissão**
- Verifique se o RLS está habilitado
- Confirme se as políticas foram criadas
- Teste com um usuário autenticado

---

## 📊 **Estrutura da Tabela (GARANTIDA)**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | ID do usuário |
| `user_name` | TEXT | Nome do usuário |
| `titulo` | TEXT | Título da sugestão |
| `descricao` | TEXT | Descrição detalhada |
| `imagem` | TEXT | URL da imagem (opcional) |
| `status` | TEXT | Status: Recebida, Em análise, Aprovada, Recusada |
| `resposta_admin` | TEXT | Resposta da administração |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Data de atualização |

---

## 🔐 **Políticas de Segurança (RLS)**

### **Leitura:**
- ✅ Usuários autenticados podem ver todas as sugestões

### **Inserção:**
- ✅ Usuários autenticados podem criar sugestões

### **Atualização:**
- ✅ Usuários podem editar suas próprias sugestões
- ✅ Admin (fjprojects2025@gmail.com) pode editar todas

### **Exclusão:**
- ✅ Usuários podem deletar suas próprias sugestões
- ✅ Admin (fjprojects2025@gmail.com) pode deletar todas

---

## 🧪 **Dados de Teste**

O script insere automaticamente:
1. **Sugestão de Melhoria na Academia**
2. **Sugestão de Segurança no Estacionamento**

---

## ✅ **Verificação Final**

Após configurar, teste:
1. ✅ Enviar sugestão como usuário
2. ✅ Ver sugestão na lista pessoal
3. ✅ Ver todas as sugestões como admin
4. ✅ Atualizar status de sugestões
5. ✅ Deletar sugestões (apenas admin)

---

## 🚨 **IMPORTANTE - Use o Script Correto**

**❌ NÃO use:** `test-sugestoes.sql`
**✅ USE:** `fix-sugestoes-table.sql`

O segundo script resolve todos os problemas de colunas e garante funcionamento!

---

**🎯 Execute o script `fix-sugestoes-table.sql` no Supabase e as sugestões funcionarão perfeitamente!**
