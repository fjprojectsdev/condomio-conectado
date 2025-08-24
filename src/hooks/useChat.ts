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

  const sendMessage = async (text: string, userId: string, userName: string) => {
    try {
      await addDoc(collection(chatDb, 'chats', roomId, 'messages'), {
        text,
        userId,
        userName,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return { messages, loading, sendMessage };
};