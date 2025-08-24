# Firebase Setup - Condomínio Conectado

## ✅ Configuração Atual:

### **Supabase** (Banco Principal)
- ✅ Todas as tabelas e dados
- ✅ Encomendas, Comunicados, Classificados
- ✅ Coleta de Lixo, Serviços, Agendamentos

### **Firebase** (Login, Chat, Notificações)
- ✅ Autenticação de usuários
- ✅ Chat em tempo real
- ✅ Notificações push
- ✅ Service worker configurado

## 🚀 Como usar:

### 1. Login Firebase
```javascript
// Modal de login agora usa apenas Firebase
// Dados do usuário ficam no Supabase
```

### 2. Chat
```javascript
import { Chat } from '@/components/Chat';

// Usar em qualquer página
<Chat />
```

### 3. Notificações
```javascript
import { useNotifications } from '@/hooks/useNotifications';

const { token, permission } = useNotifications();
```

## 📋 Próximos passos:

### 1. Firebase Console
1. **Authentication** → Ativar Email/Password
2. **Cloud Messaging** → Gerar VAPID key
3. **Firestore** → Criar database para chat

### 2. Regras Firestore (Chat)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{roomId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Adicionar Chat nas páginas
```javascript
// Em qualquer página
import { Chat } from '@/components/Chat';

// No JSX
<Chat />
```

## 🔧 Arquitetura Final:

```
┌─────────────────┐    ┌─────────────────┐
│    SUPABASE     │    │    FIREBASE     │
│                 │    │                 │
│ • Encomendas    │    │ • Login/Auth    │
│ • Comunicados   │    │ • Chat Real-time│
│ • Classificados │    │ • Notificações  │
│ • Coleta Lixo   │    │ • Push Messages │
│ • Serviços      │    │                 │
│ • Agendamentos  │    │                 │
└─────────────────┘    └─────────────────┘
        │                       │
        └───────────┬───────────┘
                    │
            ┌───────▼───────┐
            │   WEB APP     │
            │ Condomínio    │
            │  Conectado    │
            └───────────────┘
```

**Resultado**: Sistema híbrido otimizado! 🎯