import { useState, useEffect } from 'react';
import { chatDb } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  limit,
  startAfter,
  getDocs
} from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  image?: string;
  timestamp: any;
  createdAt?: string;
}

export const useChat = (roomId: string = 'geral') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 useChat: Iniciando listener para sala:', roomId);
    
    // Primeiro, vamos carregar mensagens existentes
    const loadExistingMessages = async () => {
      try {
        const q = query(
          collection(chatDb, 'chats', roomId, 'messages'),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        
        const snapshot = await getDocs(q);
        const existingMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        
        console.log('📚 Mensagens existentes carregadas:', existingMessages.length);
        setMessages(existingMessages.reverse()); // Reverter para ordem cronológica
        setLoading(false);
      } catch (error) {
        console.error('❌ Erro ao carregar mensagens existentes:', error);
        setError('Erro ao carregar mensagens');
        setLoading(false);
      }
    };

    // Carregar mensagens existentes primeiro
    loadExistingMessages();

    // Depois configurar o listener em tempo real
    const q = query(
      collection(chatDb, 'chats', roomId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('👂 Listener ativo - Nova mensagem detectada');
      
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      console.log('📨 Mensagens atualizadas via listener:', newMessages.length);
      setMessages(newMessages);
      setLoading(false);
      setError(null);
    }, (error) => {
      console.error('❌ Erro no listener do chat:', error);
      setError('Erro na conexão em tempo real');
      setLoading(false);
    });

    return () => {
      console.log('🔄 useChat: Limpando listener para sala:', roomId);
      unsubscribe();
    };
  }, [roomId]);

  const sendMessage = async (text: string, userId: string, userName: string, userAvatar?: string, image?: string) => {
    if (!text.trim() && !image) {
      console.warn('⚠️ Tentativa de enviar mensagem vazia');
      return;
    }

    try {
      console.log('📤 Enviando mensagem:', { 
        text: text?.substring(0, 50) + (text?.length > 50 ? '...' : ''), 
        userId, 
        userName,
        hasImage: !!image 
      });
      
      const messageData = {
        text: text || '',
        userId,
        userName,
        userAvatar: userAvatar || '',
        image: image || '',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(chatDb, 'chats', roomId, 'messages'), messageData);
      console.log('✅ Mensagem enviada com sucesso! ID:', docRef.id);
      
      // Adicionar a mensagem localmente para feedback imediato
      const localMessage: Message = {
        id: docRef.id,
        text: text || '',
        userId,
        userName,
        userAvatar: userAvatar || '',
        image: image || '',
        timestamp: new Date(),
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, localMessage]);
      
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      setError('Erro ao enviar mensagem');
      throw error;
    }
  };

  return { messages, loading, sendMessage, error };
};