# 🚀 Guia Rápido - Configurar Sistema de Login

## 📋 Status Atual
- ✅ Tabelas `profiles` e `user_roles` existem
- ❌ Função `handle_new_user` não existe ainda
- ✅ Todos os componentes React criados

## 🎯 O Que Fazer Agora

### 1. Abrir o Supabase
Acesse: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/editor

### 2. Ir para SQL Editor
- Clique em "SQL Editor" na barra lateral esquerda
- Clique no botão "+" para criar uma nova query

### 3. Copiar o Script
Copie TODO o conteúdo do arquivo: `scripts/setup-auth-minimal.sql`

**Dica**: Use Ctrl+A para selecionar tudo, depois Ctrl+C para copiar.

### 4. Colar e Executar
- Cole o script no SQL Editor (Ctrl+V)
- Clique no botão "Run" (▶️)
- Aguarde a execução

### 5. Verificar se Funcionou
Execute novamente no terminal:
```bash
node scripts/test-auth-setup.js
```

Se aparecer "✅ Função handle_new_user existe", está pronto! 🎉

## 🔧 Se Ainda Houver Erros

1. **Erro de ENUM**: O script resolve automaticamente
2. **Erro de permissão**: Execute como está, deve funcionar
3. **Erro de sintaxe**: Verifique se copiou todo o script

## 📝 Depois de Configurar

1. **Integre na aplicação**: Use o exemplo em `App-with-auth-example.jsx`
2. **Teste o login**: Registre um usuário teste
3. **Configure email**: Para produção, configure SMTP no Supabase

## 🆘 Precisa de Ajuda?

Se der erro, copie a mensagem de erro completa para análise.

---
**🎯 Objetivo**: Fazer aparecer "✅ Função handle_new_user existe" no teste!
