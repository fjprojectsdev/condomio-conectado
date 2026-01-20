import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  image?: string;
  timestamp: string;
  createdAt?: string;
  reactions?: { [emoji: string]: string[] };
}

export const useChat = (roomId: string = 'geral') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error: loadError } = await (supabase as any)
          .from('chat_messages')
          .select('*')
          .eq('room_id', roomId)
          .order('timestamp', { ascending: true })
          .limit(50);

        if (loadError) {
          console.error('Erro ao carregar mensagens:', loadError);
          setError('Erro ao carregar mensagens');
          setLoading(false);
          return;
        }

        const formattedMessages = (data || []).map((msg: any) => ({
          id: msg.id,
          text: msg.text || '',
          userId: msg.user_id,
          userName: msg.user_name || 'Usuário',
          userAvatar: msg.user_avatar || '',
          image: msg.image || '',
          timestamp: msg.timestamp,
          createdAt: msg.created_at,
          reactions: {}
        }));

        setMessages(formattedMessages);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar mensagens:', err);
        setError('Erro ao carregar mensagens');
        setLoading(false);
      }
    };

    loadMessages();

    const subscription = supabase
      .channel(`chat:${roomId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` }, 
        (payload: any) => {
          if (payload.new) {
            const newMessage: Message = {
              id: payload.new.id,
              text: payload.new.text || '',
              userId: payload.new.user_id,
              userName: payload.new.user_name || 'Usuário',
              userAvatar: payload.new.user_avatar || '',
              image: payload.new.image || '',
              timestamp: payload.new.timestamp,
              createdAt: payload.new.created_at,
              reactions: {}
            };
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  const sendMessage = async (
    text: string, 
    userId: string, 
    userName: string, 
    userAvatar?: string, 
    image?: string
  ) => {
    if (!text.trim() && !image) return;
    
    try {
      const { error } = await (supabase as any)
        .from('chat_messages')
        .insert([{
          room_id: roomId,
          text: text.trim(),
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          image: image,
          timestamp: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      throw err;
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    console.log('Toggle reaction:', messageId, emoji);
  };

  return { messages, sendMessage, loading, error, toggleReaction };
};
