# 🔥 Configuração do Firebase para Google OAuth (PWA)

## 🚨 PROBLEMA IDENTIFICADO E SOLUCIONADO
O erro `403: disallowed_useragent` ocorre porque:
- **PWA instalado** é detectado como WebView pelo Google
- **Firebase desativa** autenticação por Dynamic Links em WebView a partir de agosto/2025
- **Solução implementada**: Detecção automática de PWA + uso de `signInWithPopup` vs `signInWithRedirect`

## 📋 PASSOS PARA CONFIGURAR

### 1️⃣ Configurar Domínios Autorizados no Firebase

**🚨 CRÍTICO**: Este é o passo mais importante para resolver o erro 403!

1. **Acesse o Firebase Console:**
   - Vá para: https://console.firebase.google.com/
   - Selecione o projeto: `condominio-conectado-94f9f`

2. **Vá para Authentication > Settings:**
   - Clique em **Authentication** no menu lateral
   - Clique na aba **Settings**
   - Role para baixo até **Authorized domains**

3. **Adicionar Domínios:**
   - Clique em **Add domain**
   - Adicione: `condominioconectado.netlify.app`
   - Clique em **Add**
   - **IMPORTANTE**: Aguarde alguns minutos para propagar

4. **Verificar Domínios Atuais:**
   - `condominio-conectado-94f9f.firebaseapp.com` (deve estar)
   - `condominioconectado.netlify.app` (deve estar agora)

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

### 3️⃣ Verificar Google Cloud Console

1. **Acesse Google Cloud Console:**
   - Vá para: https://console.cloud.google.com/
   - Selecione o projeto do Firebase

2. **Verificar Credenciais OAuth:**
   - **APIs & Services** > **Credentials**
   - Clique no **OAuth 2.0 Client ID** existente
   - **Authorized JavaScript origins:**
     ```
     https://condominio-conectado-94f9f.firebaseapp.com
     https://condominioconectado.netlify.app
     http://localhost:8080
     ```

## 🔧 SOLUÇÃO IMPLEMENTADA

### Detecção Automática de PWA:
```typescript
// Detecta se é PWA instalado
const isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;

if (isPWAInstalled) {
  // Para PWA: usa signInWithRedirect
  await signInWithRedirect(auth, provider);
} else {
  // Para navegador: usa signInWithPopup
  result = await signInWithPopup(auth, provider);
}
```

### Fluxo de Autenticação:
1. **Navegador normal**: `signInWithPopup` (funciona perfeitamente)
2. **PWA instalado**: `signInWithRedirect` + `getRedirectResult` (evita WebView)
3. **Integração automática** com Supabase para dados do usuário

## 🧪 TESTAR CONFIGURAÇÃO

### 1️⃣ Teste Básico (Navegador):
1. Vá para o site no navegador
2. Clique em "Entrar com Google"
3. Deve abrir popup do Google OAuth
4. Após autorização, deve voltar para o site
5. Usuário deve estar logado

### 2️⃣ Teste PWA:
1. Instale o PWA no dispositivo
2. Abra o PWA instalado
3. Clique em "Entrar com Google"
4. Deve redirecionar para Google OAuth
5. Após autorização, deve voltar para o PWA
6. Usuário deve estar logado

### 3️⃣ Verificar no Supabase:
1. Acesse: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/table-editor
2. Tabela `profiles`: Deve ter o novo usuário
3. Tabela `user_roles`: Deve ter role 'morador'

## ❌ PROBLEMAS COMUNS E SOLUÇÕES

### Erro: "Popup blocked by browser"
**Solução:** Permitir popups para o site

### Erro: "Google sign-in not configured"
**Solução:** Verificar se Google está ativo no Firebase Authentication

### Erro: "Invalid OAuth client"
**Solução:** Verificar credenciais no Google Cloud Console

### Erro: "Unauthorized domain"
**Solução:** Adicionar `condominioconectado.netlify.app` em Firebase > Authentication > Settings > Authorized domains

### Usuário não aparece no Supabase
**Solução:** Verificar logs do console do navegador para erros

### PWA não funciona com Google OAuth
**Solução:** A solução implementada detecta automaticamente PWA e usa redirect em vez de popup

## 🚀 VANTAGENS DA SOLUÇÃO IMPLEMENTADA

1. **✅ Google OAuth funcionando** via Firebase (sem erro 403)
2. **✅ PWA suportado** com detecção automática
3. **✅ Banco de dados mantido** no Supabase
4. **✅ Integração automática** entre os sistemas
5. **✅ Sem perda de dados** existentes
6. **✅ Funcionalidades existentes** preservadas
7. **✅ Compatível com futuro** (após agosto/2025)

## 📞 SUPORTE

Se precisar de ajuda:
1. **Verifique os domínios autorizados** no Firebase (passo mais importante)
2. Verifique os logs do console do navegador
3. Verifique o Firebase Console > Authentication > Users
4. Verifique o Supabase Dashboard > Table Editor
5. Entre em contato com o suporte do Firebase

## 🔍 VERIFICAÇÃO FINAL

Para confirmar que está funcionando:
- ✅ Domínio `condominioconectado.netlify.app` está em Firebase > Authentication > Settings > Authorized domains
- ✅ Google OAuth está ativo em Firebase > Authentication > Sign-in method
- ✅ URLs estão corretas no Google Cloud Console
- ✅ Teste funciona tanto no navegador quanto no PWA instalado

## 🚨 CORRIGIR USUÁRIOS EXISTENTES

Se você já criou usuários que foram incorretamente definidos como "admin":

### 1️⃣ Executar Script de Correção:
1. Acesse: https://supabase.com/dashboard/project/ddzmibbhtjrgzdgflujg/sql
2. Execute o script: `CORRIGIR-USUARIOS-ADMIN.sql`
3. Este script corrige automaticamente todos os usuários

### 2️⃣ Verificar Correção:
- Apenas `fjprojects2025@gmail.com` deve ter role "admin"
- Todos os outros usuários devem ter role "morador"
- Novos usuários Google serão automaticamente "morador"

### 3️⃣ Regras de Role Implementadas:
- **Admin**: Apenas `fjprojects2025@gmail.com`
- **Morador**: Todos os outros usuários (padrão)
- **Síndico**: Pode ser configurado manualmente se necessário

## 📋 RESUMO DAS ALTERAÇÕES

### ✅ O que foi corrigido:
1. **Novos usuários Google** são criados como "morador" por padrão
2. **Apenas fjprojects2025@gmail.com** pode ser admin
3. **Script de correção** para usuários existentes incorretos
4. **Detecção automática** de PWA vs navegador
5. **Google OAuth funcionando** sem erro 403

### 🔒 Segurança:
- Usuários não podem se promover a admin
- Role é definida automaticamente baseada no email
- Sistema previne criação acidental de admins
