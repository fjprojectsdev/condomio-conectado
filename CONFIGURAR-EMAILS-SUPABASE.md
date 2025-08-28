# 📧 Configuração de Emails de Confirmação no Supabase

## 🚨 PROBLEMA IDENTIFICADO
Os emails de confirmação não estão chegando aos usuários após o cadastro.

## 📋 SOLUÇÕES

### 1️⃣ Verificar Configuração de Email no Supabase

1. **Acesse o Supabase Dashboard:**
   - Vá para: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/auth/settings

2. **Verificar Configurações de Email:**
   - **Enable email confirmations:** Deve estar **ON**
   - **Enable email change confirmations:** Deve estar **ON**
   - **Enable secure email change:** Deve estar **ON**

### 2️⃣ Configurar Templates de Email

1. **Vá para Authentication > Email Templates:**
   - URL: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/auth/templates

2. **Configurar Template de Confirmação:**
   - **Template:** `Confirm signup`
   - **Subject:** `Confirme sua conta no Condomínio Conectado`
   - **Body:**
   ```html
   <h2>Bem-vindo ao Condomínio Conectado!</h2>
   <p>Olá!</p>
   <p>Obrigado por se cadastrar no nosso sistema de condomínio.</p>
   <p>Para ativar sua conta, clique no link abaixo:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirmar minha conta</a></p>
   <p>Se você não criou uma conta, ignore este email.</p>
   <p>Atenciosamente,<br>Equipe Condomínio Conectado</p>
   ```

### 3️⃣ Configurar URLs de Redirecionamento

1. **Vá para Authentication > Settings:**
   - **Site URL:** `https://condominioconectado.netlify.app`
   - **Redirect URLs:**
     ```
     https://condominioconectado.netlify.app/auth/callback
     http://localhost:8080/auth/callback
     ```

### 4️⃣ Verificar Configuração de SMTP

1. **Verificar se o SMTP está configurado:**
   - Vá para: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/settings/auth
   - Procure por configurações de SMTP

2. **Se não houver SMTP configurado:**
   - O Supabase usa um serviço de email padrão
   - Pode haver delays ou problemas de entrega

### 5️⃣ Testar Configuração

1. **Criar usuário de teste:**
   - Use um email válido (Gmail, Outlook, etc.)
   - Verifique se recebe o email de confirmação

2. **Verificar logs:**
   - Console do navegador para erros
   - Supabase Dashboard > Logs para erros de email

## 🔧 SOLUÇÕES ALTERNATIVAS

### Opção 1: Desabilitar Confirmação de Email (Temporário)

1. **Vá para Authentication > Settings:**
   - **Enable email confirmations:** Desmarque (OFF)
   - **Save**

2. **Vantagens:**
   - Usuários podem fazer login imediatamente
   - Não há problemas de email

3. **Desvantagens:**
   - Menos segurança
   - Usuários podem usar emails falsos

### Opção 2: Usar OTP em vez de Links

1. **Configurar OTP:**
   - Vá para Authentication > Settings
   - **Enable phone confirmations:** ON
   - **Enable email confirmations:** OFF

2. **Implementar OTP no frontend:**
   - Enviar código de 6 dígitos por email
   - Usuário digita o código para confirmar

### Opção 3: Verificação Manual

1. **Desabilitar confirmação automática:**
   - **Enable email confirmations:** OFF

2. **Implementar verificação manual:**
   - Admin aprova novos usuários
   - Usuário recebe notificação quando aprovado

## 🚀 RECOMENDAÇÃO

**Para resolver rapidamente:**
1. Desabilite temporariamente a confirmação de email
2. Configure corretamente o Google OAuth
3. Reative a confirmação de email posteriormente

## 📞 SUPORTE

Se os problemas persistirem:
1. Verifique os logs do Supabase Dashboard
2. Entre em contato com o suporte do Supabase
3. Considere usar um serviço de email externo (SendGrid, Mailgun, etc.)
