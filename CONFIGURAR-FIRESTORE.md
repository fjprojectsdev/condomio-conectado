# 🔧 Configurar Regras de Segurança do Firestore

## Problema Identificado
O chat dos moradores não está funcionando corretamente porque:
- As mensagens não persistem entre sessões
- Não é possível ver mensagens de outros usuários
- Problemas de permissão no Firestore

## Solução: Configurar Regras de Segurança

### Passo 1: Acessar Firebase Console
1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `condominio-conectado-94f9f`
3. No menu lateral, clique em **Firestore Database**

### Passo 2: Configurar Regras
1. Clique na aba **Regras**
2. Substitua o conteúdo atual pelas seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção de chat
    match /chats/{chatId}/messages/{messageId} {
      // Permitir leitura para todos os usuários autenticados
      allow read: if request.auth != null;
      
      // Permitir escrita para usuários autenticados
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.userName is string
        && request.resource.data.text is string;
        
      // Permitir atualização apenas pelo autor da mensagem
      allow update: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
        
      // Permitir exclusão apenas pelo autor da mensagem
      allow delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Regras para outras coleções (se necessário)
    match /{document=**} {
      // Por padrão, negar acesso
      allow read, write: if false;
    }
  }
}
```

3. Clique em **Publicar**

### Passo 3: Verificar Estrutura da Coleção
Certifique-se de que a estrutura da coleção está correta:

```
chats/
  geral/
    messages/
      [messageId]/
        text: string
        userId: string
        userName: string
        userAvatar: string
        image: string
        timestamp: timestamp
        createdAt: string
```

### Passo 4: Testar Funcionamento
1. Recarregue a aplicação
2. Acesse o chat dos moradores
3. Envie uma mensagem
4. Recarregue a página para verificar se persiste
5. Teste com outro usuário para verificar visibilidade

## Melhorias Implementadas

### 1. Hook useChat Aprimorado
- ✅ Carregamento inicial de mensagens existentes
- ✅ Listener em tempo real para novas mensagens
- ✅ Tratamento de erros melhorado
- ✅ Feedback imediato ao enviar mensagens

### 2. Interface Melhorada
- ✅ Indicador de erro de conexão
- ✅ Mensagens de status mais claras
- ✅ Melhor tratamento de estados de loading

### 3. Estrutura de Dados
- ✅ Timestamps consistentes
- ✅ Validação de dados
- ✅ IDs únicos para mensagens

## Troubleshooting

### Se ainda houver problemas:

1. **Verificar Console do Navegador**
   - Abra DevTools (F12)
   - Verifique erros no console
   - Procure por mensagens de erro do Firebase

2. **Verificar Autenticação**
   - Certifique-se de que o usuário está logado
   - Verifique se o AuthContext está funcionando

3. **Verificar Regras**
   - Confirme se as regras foram publicadas
   - Aguarde alguns minutos para propagação

4. **Testar Conectividade**
   - Execute o script `test-chat-connection.js`
   - Verifique se consegue ler/escrever no Firestore

## Estrutura das Regras

- **`allow read`**: Usuários autenticados podem ler todas as mensagens
- **`allow create`**: Usuários autenticados podem criar mensagens (com validação)
- **`allow update`**: Apenas o autor pode editar sua mensagem
- **`allow delete`**: Apenas o autor pode deletar sua mensagem

## Segurança

- ✅ Apenas usuários autenticados podem acessar
- ✅ Usuários só podem modificar suas próprias mensagens
- ✅ Validação de dados obrigatórios
- ✅ Acesso restrito apenas à coleção de chat
