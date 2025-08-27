import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Image, Smile, Paperclip, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import MessageReactions from '@/components/MessageReactions';

const ChatMoradores = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { messages, sendMessage, loading: chatLoading, error: chatError } = useChat('geral');
  const [newMessage, setNewMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !imagePreview) || !user) return;

    setLoading(true);
    try {
      await sendMessage(
        newMessage,
        user.id,
        userProfile?.full_name || user.email?.split('@')[0] || 'Usuário',
        userProfile?.avatar_url,
        imagePreview
      );
      setNewMessage('');
      setImagePreview('');
    } catch (error) {
      alert('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    // TODO: Implementar reações no Firebase
    console.log('Reação:', messageId, emoji);
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Hoje';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groups = {};
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const [showConversationList, setShowConversationList] = useState(true);
  const [conversations] = useState([
    {
      id: 'geral',
      name: 'Chat Geral dos Moradores',
      lastMessage: messages[messages.length - 1]?.text || 'Nenhuma mensagem ainda',
      lastMessageTime: messages[messages.length - 1]?.timestamp || new Date(),
      unreadCount: 0,
      avatar: null
    }
  ]);

  if (showConversationList) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b p-4 shadow-sm">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Chat dos Moradores</h1>
          </div>
        </div>

        {/* Conversations List */}
        <div className="p-4">
          {conversations.map((conv) => (
            <Card key={conv.id} className="mb-2 cursor-pointer hover:bg-gray-50" onClick={() => setShowConversationList(false)}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {conv.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate">{conv.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm">
        <div className="flex items-center">
          <Button
            onClick={() => setShowConversationList(true)}
            variant="ghost"
            size="sm"
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-blue-500 text-white">
              CM
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">Chat Geral dos Moradores</h1>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {chatError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Erro de conexão:</strong> {chatError}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Tentando reconectar automaticamente...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatLoading ? (
            <div className="text-center text-gray-500 py-8">
              Carregando mensagens...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Nenhuma mensagem ainda. Seja o primeiro a conversar!
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
              {/* Date Separator */}
              <div className="flex justify-center my-4">
                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>

              {/* Messages for this date */}
              {(dayMessages as any[]).map((message) => {
                const isMyMessage = message.userId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isMyMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.userAvatar} />
                        <AvatarFallback className="text-xs bg-gray-300">
                          {message.userName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-2xl px-4 py-2 ${
                        isMyMessage
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                      }`}>
                        <p className="text-xs font-medium mb-1 opacity-70">
                          {message.userName || 'Usuário'}
                        </p>
                        
                        {message.image && (
                          <img 
                            src={message.image} 
                            alt="Imagem" 
                            className="rounded-lg mb-2 max-w-full h-auto"
                          />
                        )}
                        
                        {message.text && (
                          <p className="text-sm break-words">{message.text}</p>
                        )}
                        
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className={`text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatTime(message.timestamp)}
                          </span>
                          {isMyMessage && (
                            <CheckCheck className="h-3 w-3 text-blue-100" />
                          )}
                        </div>
                        
                        <MessageReactions
                          messageId={message.id}
                          reactions={message.reactions || {}}
                          currentUserId={user?.id || ''}
                          onReact={handleReaction}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Image Preview */}
      {imagePreview && (
        <div className="p-4 bg-white border-t">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
            <Button
              onClick={() => setImagePreview('')}
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite uma mensagem..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="rounded-full pr-12 bg-gray-100 border-0"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSend} 
            disabled={loading || (!newMessage.trim() && !imagePreview)}
            size="icon"
            className="rounded-full bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMoradores;