# 🔧 Configuração do Google OAuth no Supabase

## 🚨 PROBLEMA IDENTIFICADO
O erro `403: disallowed_useragent` indica que o Google OAuth não está configurado corretamente no Supabase.

## 📋 PASSOS PARA CONFIGURAR

### 1️⃣ Configurar Google OAuth no Supabase Dashboard

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/auth/providers

2. **Ativar Google Provider:**
   - Clique em **Google** na lista de provedores
   - Ative o toggle **Enable**
   - Clique em **Save**

### 2️⃣ Configurar Credenciais do Google

1. **Acesse Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/
   - Selecione seu projeto ou crie um novo

2. **Criar Credenciais OAuth 2.0:**
   - Vá para **APIs & Services** > **Credentials**
   - Clique em **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
   - Selecione **Web application**

3. **Configurar URLs Autorizadas:**
   - **Authorized JavaScript origins:**
     ```
     https://condominioconectado.netlify.app
     http://localhost:8080
     ```
   - **Authorized redirect URIs:**
     ```
     https://ddzmibbhtjrgzdgflujg.supabase.co/auth/v1/callback
     ```

4. **Copiar Credenciais:**
   - **Client ID** (ex: `510887003433-fvutren5vekd2mg13stkddfmvn1g0pgi.apps.googleusercontent.com`)
   - **Client Secret**

### 3️⃣ Configurar no Supabase

1. **Volte ao Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/auth/providers

2. **Preencher Credenciais:**
   - **Client ID:** Cole o Client ID do Google
   - **Client Secret:** Cole o Client Secret do Google
   - **Redirect URL:** Deixe como está (gerado automaticamente)

3. **Salvar Configuração:**
   - Clique em **Save**

### 4️⃣ Configurar URLs de Redirecionamento

1. **Vá para Authentication > Settings:**
   - URL: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/auth/settings

2. **Configurar Site URL:**
   - **Site URL:** `https://condominioconectado.netlify.app`

3. **Configurar Redirect URLs:**
   - **Redirect URLs:**
     ```
     https://condominioconectado.netlify.app/auth/callback
     http://localhost:8080/auth/callback
     ```

### 5️⃣ Testar Configuração

1. **Teste o Login com Google:**
   - Vá para o site
   - Clique em "Entrar com Google"
   - Deve redirecionar para o Google OAuth
   - Após autorização, deve voltar para `/auth/callback`

## 🔍 VERIFICAÇÃO

### ✅ Se funcionando:
- Login com Google redireciona para Google OAuth
- Após autorização, retorna para o site
- Usuário fica logado automaticamente

### ❌ Se não funcionar:
- Verifique se as URLs estão corretas
- Verifique se as credenciais estão corretas
- Verifique se o Google OAuth está ativo no Supabase
- Verifique os logs do console do navegador

## 🚀 ALTERNATIVA TEMPORÁRIA

Se o Google OAuth continuar com problemas, você pode:

1. **Desabilitar temporariamente** o botão "Entrar com Google"
2. **Usar apenas cadastro por email/senha**
3. **Configurar o Google OAuth posteriormente**

## 📞 SUPORTE

Se precisar de ajuda:
1. Verifique os logs do console do navegador
2. Verifique os logs do Supabase Dashboard
3. Entre em contato com o suporte do Supabase
