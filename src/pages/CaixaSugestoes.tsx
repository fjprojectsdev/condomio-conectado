import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Image, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { chatDb } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';

const CaixaSugestoes = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  
  // Form data
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');

  useEffect(() => {
    fetchMinhasSugestoes();
  }, [user]);

  const fetchMinhasSugestoes = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(chatDb, 'sugestoes'),
        where('user_id', '==', user.id),
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

  const handleSubmit = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      alert('Título e descrição são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(chatDb, 'sugestoes'), {
        user_id: user?.id,
        user_name: userProfile?.full_name || user?.email?.split('@')[0] || 'Usuário',
        titulo,
        descricao,
        imagem,
        status: 'Recebida',
        created_at: new Date().toISOString()
      });

      alert('Sugestão enviada com sucesso!');
      setTitulo('');
      setDescricao('');
      setImagem('');
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error);
      alert('Erro ao enviar sugestão');
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
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/10 mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Caixa de Sugestões</h1>
            <p className="text-sm text-primary-foreground/80">Envie suas ideias e sugestões</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Formulário */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Sugestão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título *</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Melhoria na área de lazer"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição *</label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva sua sugestão detalhadamente..."
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Imagem (opcional)</label>
                <div className="flex space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setImagem(e.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="w-full"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Escolher Imagem
                  </Button>
                </div>
                {imagem && (
                  <img src={imagem} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? 'Enviando...' : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Sugestão
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Sugestões */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Minhas Sugestões</h2>
          
          {sugestoes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Você ainda não enviou nenhuma sugestão.
              </CardContent>
            </Card>
          ) : (
            sugestoes.map((sugestao: any) => (
              <Card key={sugestao.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{sugestao.titulo}</h3>
                    <Badge className={getStatusColor(sugestao.status)}>
                      {sugestao.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{sugestao.descricao}</p>
                  {sugestao.imagem && (
                    <img 
                      src={sugestao.imagem} 
                      alt="Anexo" 
                      className="h-16 w-16 object-cover rounded mb-2" 
                    />
                  )}
                  <p className="text-xs text-gray-400">
                    Enviado em {new Date(sugestao.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  {sugestao.resposta_admin && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium">Resposta da Administração:</p>
                      <p className="text-sm text-gray-600">{sugestao.resposta_admin}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CaixaSugestoes;