import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  limit,
  getDocs,
  Timestamp
} from '@supabase/supabase-js';

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
  const { supabase, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 useChat: Iniciando listener para sala:', roomId);
    
    if (!user) {
      console.log('⚠️ Usuário não autenticado, não é possível carregar chat');
      setLoading(false);
      return;
    }
    
    // Primeiro, vamos carregar mensagens existentes
    const loadExistingMessages = async () => {
      try {
        console.log('📖 Carregando mensagens existentes...');
        
        const { data: existingMessages, error: loadError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', roomId)
          .order('timestamp', { ascending: false })
          .limit(50);
        
        if (loadError) {
          console.error('❌ Erro ao carregar mensagens existentes:', loadError);
          setError('Erro ao carregar mensagens');
          setLoading(false);
          return;
        }
        
        console.log('📚 Mensagens existentes carregadas:', existingMessages?.length || 0);
        
        if (existingMessages) {
          // Converter para o formato esperado e reverter ordem
          const formattedMessages = existingMessages
            .map(msg => ({
              id: msg.id,
              text: msg.text || '',
              userId: msg.user_id,
              userName: msg.user_name || 'Usuário',
              userAvatar: msg.user_avatar || '',
              image: msg.image || '',
              timestamp: msg.timestamp,
              createdAt: msg.created_at
            }))
            .reverse(); // Reverter para ordem cronológica
          
          setMessages(formattedMessages);
        }
        
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
    const subscription = supabase
      .channel(`chat:${roomId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        }, 
        (payload) => {
          console.log('👂 Nova mensagem detectada via listener:', payload);
          
          const newMessage = {
            id: payload.new.id,
            text: payload.new.text || '',
            userId: payload.new.user_id,
            userName: payload.new.user_name || 'Usuário',
            userAvatar: payload.new.user_avatar || '',
            image: payload.new.image || '',
            timestamp: payload.new.timestamp,
            createdAt: payload.new.created_at
          };
          
          setMessages(prev => [...prev, newMessage]);
          setError(null);
        }
      )
      .subscribe((status) => {
        console.log('📡 Status da subscription:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Listener ativo para sala:', roomId);
        }
      });

    return () => {
      console.log('🔄 useChat: Limpando listener para sala:', roomId);
      subscription.unsubscribe();
    };
  }, [roomId, supabase, user]);

  const sendMessage = async (text: string, userId: string, userName: string, userAvatar?: string, image?: string) => {
    if (!text.trim() && !image) {
      console.warn('⚠️ Tentativa de enviar mensagem vazia');
      return;
    }

    if (!user) {
      console.error('❌ Usuário não autenticado');
      setError('Usuário não autenticado');
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
        room_id: roomId,
        text: text || '',
        user_id: userId,
        user_name: userName,
        user_avatar: userAvatar || '',
        image: image || '',
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      const { data, error: insertError } = await supabase
        .from('chat_messages')
        .insert([messageData])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ Erro ao inserir mensagem:', insertError);
        throw insertError;
      }
      
      console.log('✅ Mensagem enviada com sucesso! ID:', data.id);
      
      // A mensagem será adicionada automaticamente via listener
      // Mas podemos adicionar localmente para feedback imediato
      const localMessage: Message = {
        id: data.id,
        text: text || '',
        userId,
        userName,
        userAvatar: userAvatar || '',
        image: image || '',
        timestamp: new Date().toISOString(),
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