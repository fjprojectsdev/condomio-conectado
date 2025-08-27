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
  reactions?: { [emoji: string]: string[] };
}

export const useChat = (roomId: string = 'geral') => {
  const { supabase, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar reações de uma mensagem
  const loadMessageReactions = async (messageId: string) => {
    try {
      const { data: reactions, error } = await supabase
        .from('chat_reactions')
        .select('emoji, user_id')
        .eq('message_id', messageId);
      
      if (error) {
        console.error('Erro ao carregar reações:', error);
        return {};
      }
      
      // Agrupar reações por emoji
      const groupedReactions: { [emoji: string]: string[] } = {};
      reactions?.forEach(reaction => {
        if (!groupedReactions[reaction.emoji]) {
          groupedReactions[reaction.emoji] = [];
        }
        groupedReactions[reaction.emoji].push(reaction.user_id);
      });
      
      return groupedReactions;
    } catch (error) {
      console.error('Erro ao carregar reações:', error);
      return {};
    }
  };

  // Função para adicionar/remover reação
  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    
    try {
      // Verificar se já existe a reação
      const { data: existingReaction, error: checkError } = await supabase
        .from('chat_reactions')
        .select('id')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar reação existente:', checkError);
        return;
      }
      
      if (existingReaction) {
        // Remover reação existente
        const { error: deleteError } = await supabase
          .from('chat_reactions')
          .delete()
          .eq('id', existingReaction.id);
        
        if (deleteError) {
          console.error('Erro ao remover reação:', deleteError);
          return;
        }
      } else {
        // Adicionar nova reação
        const { error: insertError } = await supabase
          .from('chat_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            emoji: emoji
          });
        
        if (insertError) {
          console.error('Erro ao adicionar reação:', insertError);
          return;
        }
      }
      
      // Recarregar reações da mensagem
      const updatedReactions = await loadMessageReactions(messageId);
      
      // Atualizar mensagem localmente
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reactions: updatedReactions }
          : msg
      ));
      
    } catch (error) {
      console.error('Erro ao alternar reação:', error);
    }
  };

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
          const formattedMessages = await Promise.all(
            existingMessages.map(async (msg) => {
              const reactions = await loadMessageReactions(msg.id);
              return {
                id: msg.id,
                text: msg.text || '',
                userId: msg.user_id,
                userName: msg.user_name || 'Usuário',
                userAvatar: msg.user_avatar || '',
                image: msg.image || '',
                timestamp: msg.timestamp,
                createdAt: msg.created_at,
                reactions
              };
            })
          );
          
          setMessages(formattedMessages.reverse()); // Reverter para ordem cronológica
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
        async (payload) => {
          console.log('📨 Nova mensagem recebida:', payload.new);
          
          if (payload.new) {
            const newMessage = payload.new;
            const reactions = await loadMessageReactions(newMessage.id);
            
            const formattedMessage: Message = {
              id: newMessage.id,
              text: newMessage.text || '',
              userId: newMessage.user_id,
              userName: newMessage.user_name || 'Usuário',
              userAvatar: newMessage.user_avatar || '',
              image: newMessage.image || '',
              timestamp: newMessage.timestamp,
              createdAt: newMessage.created_at,
              reactions
            };
            
            setMessages(prev => [...prev, formattedMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 useChat: Limpando listener para sala:', roomId);
      subscription.unsubscribe();
    };
  }, [roomId, user, supabase]);

  const sendMessage = async (
    text: string, 
    userId: string, 
    userName: string, 
    userAvatar?: string, 
    image?: string
  ) => {
    if (!text.trim() && !image) return;
    
    try {
      const { error } = await supabase
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

      if (error) {
        console.error('❌ Erro ao enviar mensagem:', error);
        throw error;
      }
      
      console.log('✅ Mensagem enviada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      throw error;
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    error,
    toggleReaction
  };
};