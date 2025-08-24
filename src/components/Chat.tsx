import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';

export const Chat = () => {
  const { user, userProfile } = useAuth();
  const { messages, loading, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    await sendMessage(
      newMessage,
      user.id,
      userProfile?.full_name || user.email || 'Usuário'
    );
    setNewMessage('');
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Faça login para participar do chat</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle>Chat do Condomínio</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 p-4">
          {loading ? (
            <p className="text-center text-gray-500">Carregando...</p>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded ${
                    message.userId === user.id
                      ? 'bg-blue-100 ml-auto max-w-xs'
                      : 'bg-gray-100 mr-auto max-w-xs'
                  }`}
                >
                  <p className="text-xs text-gray-600">{message.userName}</p>
                  <p className="text-sm">{message.text}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};