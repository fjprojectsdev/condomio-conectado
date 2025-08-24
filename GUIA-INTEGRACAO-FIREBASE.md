# 🔧 Passo a Passo – Firebase + Supabase no App Condomínio

## 1️⃣ Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **Adicionar Projeto** → dê um nome (ex: `condominio-app`)
3. Ative **Google Analytics** (opcional, mas recomendado)
4. **Registre seu app**:
   - **Web** → vai gerar as credenciais do Firebase config
   - **Mobile** → precisa baixar o arquivo `google-services.json` (Android) ou `GoogleService-Info.plist` (iOS)

## 2️⃣ Autenticação com Google

### Configuração Firebase Console:
1. Firebase Console > **Authentication** > **Sign-in method** > **Google**
2. Ative e copie as credenciais (Client ID, Client Secret)

### 👉 Fluxo técnico:
1. Usuário faz login com Google via Firebase Auth
2. Firebase retorna um UID
3. Você cria (ou atualiza) um registro no Supabase com esse UID

### Código de exemplo:

```javascript
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { createClient } from "@supabase/supabase-js";

const provider = new GoogleAuthProvider();
const auth = getAuth();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  // Salva ou atualiza no Supabase
  await supabase.from("users").upsert({
    uid: user.uid,        // UID do Firebase
    email: user.email,
    name: user.displayName,
    photo: user.photoURL
  });
}
```

## 3️⃣ Notificações Push (Firebase Cloud Messaging – FCM)

### Configuração:
1. No Firebase Console, ative o **Cloud Messaging**
2. **Web** → use `firebase-messaging-sw.js`
3. **Mobile** → configure o `google-services.json` ou `GoogleService-Info.plist`

### Fluxo:
1. Ao logar, o app gera um **FCM Token**
2. Salve esse token no Supabase (`users.push_token`)

### Código de exemplo:

```javascript
import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();

async function savePushToken(userId) {
  const token = await getToken(messaging, { 
    vapidKey: "SUA_VAPID_KEY" 
  });
  
  await supabase.from("users").update({ 
    push_token: token 
  }).eq("uid", userId);
}
```

🔔 **Quando algo acontecer** (ex: encomenda nova), você dispara via Firebase Admin SDK para esse token.

## 4️⃣ Chat em Tempo Real (Firestore)

### Estrutura recomendada no Firestore:
```
chats
└── chatId (ex: bloco ou grupo)
    └── messages
        └── messageId
            ├── userId (referência Supabase)
            ├── text
            ├── timestamp
```

### Enviar mensagem:

```javascript
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const db = getFirestore();

async function sendMessage(chatId, userId, text) {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    userId,
    text,
    timestamp: serverTimestamp()
  });
}
```

### Ouvir mensagens em tempo real:

```javascript
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";

function listenMessages(chatId, callback) {
  const q = query(
    collection(db, "chats", chatId, "messages"), 
    orderBy("timestamp")
  );
  
  onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
}
```

## 5️⃣ Integração Supabase + Firebase

### Divisão de responsabilidades:

**Supabase** (banco oficial):
- Moradores, blocos, reservas, encomendas
- Dados estruturados do condomínio

**Firebase** (recursos em tempo real):
- Login social (Google)
- Push Notifications
- Chat em tempo real

### Fluxo simplificado:

1. **Usuário loga** com Google → Firebase Auth → UID salvo no Supabase
2. **Evento acontece** (reserva, encomenda) → grava no Supabase → dispara push via Firebase
3. **Chat** → 100% no Firebase, mas cada mensagem referencia `userId` do Supabase

## 🚀 Implementação no seu projeto:

### 1. Instalar dependências:
```bash
npm install firebase
```

### 2. Configurar Firebase:
```javascript
// src/lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  // Suas credenciais aqui
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
```

### 3. Hook de autenticação híbrida:
```javascript
// src/hooks/useHybridAuth.js
import { useAuth as useSupabaseAuth } from './supabaseAuth';
import { useAuth as useFirebaseAuth } from './firebaseAuth';

export function useHybridAuth() {
  const supabase = useSupabaseAuth();
  const firebase = useFirebaseAuth();
  
  return {
    loginWithGoogle: firebase.loginWithGoogle,
    loginWithEmail: supabase.loginWithEmail,
    user: firebase.user || supabase.user,
    logout: () => {
      firebase.logout();
      supabase.logout();
    }
  };
}
```

### 4. Componente de Chat:
```jsx
// src/components/Chat.jsx
import { useChat } from '../hooks/useChat';

export function Chat({ roomId = 'geral' }) {
  const { messages, sendMessage } = useChat(roomId);
  
  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
      <input 
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
```

## ✅ Resultado Final:

- **Login social** com Google (Firebase)
- **Dados do condomínio** no Supabase
- **Chat em tempo real** (Firebase)
- **Notificações push** (Firebase)
- **Arquitetura híbrida** otimizada

🎯 **Melhor dos dois mundos**: Supabase para dados estruturados + Firebase para recursos em tempo real!