# 🔥 Configuração do Firebase para Google OAuth

## 🎯 SOLUÇÃO IMPLEMENTADA
- **Firebase**: Para autenticação com Google OAuth
- **Supabase**: Para banco de dados e perfil dos usuários
- **Integração**: Usuários logados via Google são automaticamente criados/atualizados no Supabase

## 📋 PASSOS PARA CONFIGURAR

### 1️⃣ Verificar Configuração do Firebase

1. **Acesse o Firebase Console:**
   - Vá para: https://console.firebase.google.com/
   - Selecione o projeto: `condominio-conectado-94f9f`

2. **Verificar Authentication:**
   - Vá para **Authentication** > **Sign-in method**
   - **Google** deve estar ativo
   - Se não estiver, clique em **Google** e ative

### 2️⃣ Configurar Google OAuth no Firebase

1. **Em Authentication > Sign-in method > Google:**
   - **Enable:** ✅ Ativo
   - **Project support email:** Seu email
   - **Web SDK configuration:** Deve mostrar o Client ID

2. **Se precisar configurar:**
   - Clique em **Google**
   - Ative o toggle
   - Configure o email de suporte
   - Clique em **Save**

### 3️⃣ Verificar Credenciais do Google

1. **No Firebase Console:**
   - Vá para **Project Settings** (ícone de engrenagem)
   - Aba **General**
   - Seção **Your apps** > **Web app**

2. **Verificar configuração:**
   - **apiKey:** `AIzaSyBPbQuMvRIwk4dDkQmIvYf4IqcTCb61uv0`
   - **authDomain:** `condominio-conectado-94f9f.firebaseapp.com`
   - **projectId:** `condominio-conectado-94f9f`

### 4️⃣ Configurar Google Cloud Console

1. **Acesse Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/
   - Selecione o projeto do Firebase

2. **Verificar APIs ativas:**
   - **APIs & Services** > **Library**
   - **Google Identity and Access Management (IAM) API** deve estar ativa
   - **Google+ API** deve estar ativa

3. **Verificar credenciais OAuth:**
   - **APIs & Services** > **Credentials**
   - Deve haver um **OAuth 2.0 Client ID** para web

### 5️⃣ Configurar URLs Autorizadas

1. **No Google Cloud Console > Credentials:**
   - Clique no **OAuth 2.0 Client ID** existente
   - **Authorized JavaScript origins:**
     ```
     https://condominio-conectado-94f9f.firebaseapp.com
     https://condominioconectado.netlify.app
     http://localhost:8080
     ```

2. **Authorized redirect URIs:**
   - Deixe como está (gerado automaticamente pelo Firebase)

## 🔧 COMO FUNCIONA

### Fluxo de Autenticação:
1. **Usuário clica em "Entrar com Google"**
2. **Firebase abre popup do Google OAuth**
3. **Usuário autoriza no Google**
4. **Firebase retorna dados do usuário**
5. **Sistema cria/atualiza perfil no Supabase**
6. **Usuário fica logado automaticamente**

### Integração com Supabase:
- **Tabela `profiles`:** Armazena dados do usuário
- **Tabela `user_roles`:** Define permissões (padrão: 'morador')
- **Dados sincronizados:** Nome, email, foto, etc.

## 🧪 TESTAR CONFIGURAÇÃO

### 1️⃣ Teste Básico:
1. Vá para o site
2. Clique em "Entrar com Google"
3. Deve abrir popup do Google
4. Após autorização, deve voltar para o site
5. Usuário deve estar logado

### 2️⃣ Verificar no Supabase:
1. Acesse: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/table-editor
2. Tabela `profiles`: Deve ter o novo usuário
3. Tabela `user_roles`: Deve ter role 'morador'

### 3️⃣ Verificar no Firebase:
1. Firebase Console > Authentication > Users
2. Deve mostrar o usuário logado via Google

## ❌ PROBLEMAS COMUNS

### Erro: "Popup blocked by browser"
**Solução:** Permitir popups para o site

### Erro: "Google sign-in not configured"
**Solução:** Verificar se Google está ativo no Firebase Authentication

### Erro: "Invalid OAuth client"
**Solução:** Verificar credenciais no Google Cloud Console

### Usuário não aparece no Supabase
**Solução:** Verificar logs do console do navegador para erros

## 🚀 VANTAGENS DESTA SOLUÇÃO

1. **✅ Google OAuth funcionando** via Firebase
2. **✅ Banco de dados mantido** no Supabase
3. **✅ Integração automática** entre os sistemas
4. **✅ Sem perda de dados** existentes
5. **✅ Funcionalidades existentes** preservadas

## 📞 SUPORTE

Se precisar de ajuda:
1. Verifique os logs do console do navegador
2. Verifique o Firebase Console > Authentication > Users
3. Verifique o Supabase Dashboard > Table Editor
4. Entre em contato com o suporte do Firebase
