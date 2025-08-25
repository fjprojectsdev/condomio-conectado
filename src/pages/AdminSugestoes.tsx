import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatDb } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const AdminSugestoes = () => {
  const navigate = useNavigate();
  const { } = useAuth();
  const [sugestoes, setSugestoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSugestao, setSelectedSugestao] = useState(null);
  const [novoStatus, setNovoStatus] = useState('');
  const [resposta, setResposta] = useState('');

  useEffect(() => {
    fetchSugestoes();
  }, []);

  const fetchSugestoes = async () => {
    try {
      const q = query(
        collection(chatDb, 'sugestoes'),
        orderBy('created_at', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sugestoesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSugestoes(sugestoesData);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  const handleUpdateStatus = async (sugestaoId: string, status: string, respostaAdmin?: string) => {
    setLoading(true);
    try {
      const updateData: any = { status };
      if (respostaAdmin) {
        updateData.resposta_admin = respostaAdmin;
      }

      await updateDoc(doc(chatDb, 'sugestoes', sugestaoId), updateData);

      alert('Status atualizado com sucesso!');
      setSelectedSugestao(null);
      setResposta('');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebida': return 'bg-blue-100 text-blue-800';
      case 'Em análise': return 'bg-yellow-100 text-yellow-800';
      case 'Aprovada': return 'bg-green-100 text-green-800';
      case 'Recusada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-4 shadow-elevated">
        <div className="flex items-center text-primary-foreground">
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/10 mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Gerenciar Sugestões</h1>
            <p className="text-sm text-primary-foreground/80">Administrar sugestões dos moradores</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {sugestoes.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Nenhuma sugestão recebida ainda.
            </CardContent>
          </Card>
        ) : (
          sugestoes.map((sugestao: any) => (
            <Card key={sugestao.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{sugestao.titulo}</CardTitle>
                    <p className="text-sm text-gray-600">Por: {sugestao.user_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(sugestao.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(sugestao.status)}>
                    {sugestao.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{sugestao.descricao}</p>
                
                {sugestao.imagem && (
                  <img 
                    src={sugestao.imagem} 
                    alt="Anexo" 
                    className="h-32 w-32 object-cover rounded" 
                  />
                )}

                {sugestao.resposta_admin && (
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm font-medium text-blue-800">Sua resposta:</p>
                    <p className="text-sm text-blue-700">{sugestao.resposta_admin}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Select
                    value={selectedSugestao === sugestao.id ? novoStatus : sugestao.status}
                    onValueChange={(value) => {
                      setSelectedSugestao(sugestao.id);
                      setNovoStatus(value);
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recebida">Recebida</SelectItem>
                      <SelectItem value="Em análise">Em análise</SelectItem>
                      <SelectItem value="Aprovada">Aprovada</SelectItem>
                      <SelectItem value="Recusada">Recusada</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => {
                      if (selectedSugestao === sugestao.id) {
                        handleUpdateStatus(sugestao.id, novoStatus, resposta || undefined);
                      }
                    }}
                    disabled={loading || selectedSugestao !== sugestao.id}
                    size="sm"
                  >
                    Atualizar
                  </Button>
                </div>

                {selectedSugestao === sugestao.id && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resposta para o morador (opcional):</label>
                    <Textarea
                      value={resposta}
                      onChange={(e) => setResposta(e.target.value)}
                      placeholder="Digite uma resposta para o morador..."
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSugestoes;