import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  text: string;
  user_name: string;
  timestamp: string;
  created_at: string;
}

const AdminChat = () => {
  const { supabase, canDeleteMessages } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verificar se o usuário tem permissão para deletar mensagens
  const hasPermission = canDeleteMessages();

  useEffect(() => {
    if (hasPermission) {
      loadMessages();
    }
  }, [hasPermission]);

  const loadMessages = async () => {
    if (!hasPermission) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', 'geral')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (error) {
        throw error;
      }
      
      setMessages(data || []);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError('Erro ao carregar mensagens do chat');
    } finally {
      setLoading(false);
    }
  };

  const deleteLastMessages = async (count: number) => {
    if (!hasPermission) {
      setError('Você não tem permissão para deletar mensagens');
      return;
    }
    
    if (count <= 0 || count > messages.length) {
      setError(`Por favor, selecione um número entre 1 e ${messages.length}`);
      return;
    }
    
    setDeleting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Pegar as últimas N mensagens
      const messagesToDelete = messages.slice(0, count);
      const messageIds = messagesToDelete.map(msg => msg.id);
      
      // Deletar mensagens
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .in('id', messageIds);
      
      if (error) {
        throw error;
      }
      
      // Atualizar lista local
      setMessages(prev => prev.slice(count));
      
      setSuccess(`${count} mensagem${count > 1 ? 'ens' : ''} deletada${count > 1 ? 's' : ''} com sucesso!`);
      
      // Limpar mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      console.error('Erro ao deletar mensagens:', err);
      setError('Erro ao deletar mensagens. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!hasPermission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Gerenciar Chat dos Moradores
          </CardTitle>
          <CardDescription>
            Controle e moderação das mensagens do chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissão para acessar esta funcionalidade. 
              Apenas administradores autorizados podem gerenciar o chat.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Gerenciar Chat dos Moradores
          </CardTitle>
          <CardDescription>
            Controle e moderação das mensagens do chat. Use com responsabilidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => deleteLastMessages(5)}
              disabled={deleting || messages.length < 5}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Apagar Últimas 5 Mensagens
            </Button>
            
            <Button
              onClick={() => deleteLastMessages(10)}
              disabled={deleting || messages.length < 10}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Apagar Últimas 10 Mensagens
            </Button>
            
            <Button
              onClick={() => deleteLastMessages(15)}
              disabled={deleting || messages.length < 15}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Apagar Últimas 15 Mensagens
            </Button>
            
            <Button
              onClick={loadMessages}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Carregando...' : 'Atualizar Lista'}
            </Button>
          </div>

          {/* Alertas */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                <div className="text-sm text-muted-foreground">Total de Mensagens</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {messages.length > 0 ? formatDate(messages[0]?.timestamp || '').split(' ')[0] : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Última Mensagem</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {deleting ? 'Processando...' : 'Pronto'}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Lista de mensagens */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Mensagens do Chat</CardTitle>
          <CardDescription>
            Visualize as mensagens mais recentes. As mensagens mais antigas aparecem primeiro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando mensagens...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChat;
