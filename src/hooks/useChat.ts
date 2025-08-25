import { useState, useEffect } from 'react';
import { chatDb } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  image?: string;
  timestamp: any;
}

export const useChat = (roomId: string = 'geral') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(chatDb, 'chats', roomId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(newMessages);
      setLoading(false);
    });

    return unsubscribe;
  }, [roomId]);

  const sendMessage = async (text: string, userId: string, userName: string, userAvatar?: string, image?: string) => {
    try {
      console.log('Enviando mensagem:', { text, userId, userName, userAvatar });
      
      const messageData = {
        text: text || '',
        userId,
        userName,
        userAvatar: userAvatar || '',
        image: image || '',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(chatDb, 'chats', roomId, 'messages'), messageData);
      console.log('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  };

  return { messages, loading, sendMessage };
};