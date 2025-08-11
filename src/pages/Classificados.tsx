import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, Plus, Edit, Trash2, X, Save, User, Phone, Tag, MapPin } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";

interface Classificado {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'venda' | 'compra' | 'servico' | 'doacao' | 'troca';
  preco: number | null;
  nome_contato: string;
  telefone: string;
  apartamento: string;
  bloco: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

const Classificados = () => {
  const [classificados, setClassificados] = useState<Classificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "venda" as const,
    preco: "",
    nome_contato: "",
    telefone: "",
    apartamento: "",
    bloco: ""
  });
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();

  const fetchClassificados = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('classificados')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar classificados:', error);
        return;
      }

      setClassificados(data || []);
    } catch (error) {
      console.error('Erro ao buscar classificados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClassificados();
  }, [fetchClassificados]);

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "venda",
      preco: "",
      nome_contato: "",
      telefone: "",
      apartamento: "",
      bloco: ""
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.titulo || !formData.descricao || !formData.nome_contato || 
        !formData.telefone || !formData.apartamento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: formData.categoria,
        preco: formData.preco ? parseFloat(formData.preco) : null,
        nome_contato: formData.nome_contato,
        telefone: formData.telefone,
        apartamento: formData.apartamento,
        bloco: formData.bloco || null,
        ativo: true
      };

      if (editingId) {
        const { error } = await supabase
          .from('classificados')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Classificado atualizado com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('classificados')
          .insert([payload]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Classificado publicado com sucesso!"
        });
      }

      resetForm();
      fetchClassificados();
    } catch (error) {
      console.error('Erro ao salvar classificado:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar classificado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (classificado: Classificado) => {
    setFormData({
      titulo: classificado.titulo,
      descricao: classificado.descricao,
      categoria: classificado.categoria,
      preco: classificado.preco ? classificado.preco.toString() : "",
      nome_contato: classificado.nome_contato,
      telefone: classificado.telefone,
      apartamento: classificado.apartamento,
      bloco: classificado.bloco || ""
    });
    setEditingId(classificado.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('classificados')
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Classificado removido com sucesso!"
      });
      fetchClassificados();
    } catch (error) {
      console.error('Erro ao deletar classificado:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover classificado.",
        variant: "destructive"
      });
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'venda':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'compra':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'servico':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'doacao':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'troca':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getCategoriaText = (categoria: string) => {
    switch (categoria) {
      case 'venda': return 'Vendo';
      case 'compra': return 'Procuro';
      case 'servico': return 'Serviço';
      case 'doacao': return 'Doação';
      case 'troca': return 'Troca';
      default: return categoria;
    }
  };

  const classificadosFiltrados = filtroCategoria === 'todos' 
    ? classificados 
    : classificados.filter(c => c.categoria === filtroCategoria);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Classificados" />
        <div className="p-6">
          <div className="text-center">Carregando classificados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Classificados" />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Quadro de Classificados</h2>
            <p className="text-muted-foreground">
              {classificados.length} anúncio{classificados.length !== 1 ? 's' : ''} ativo{classificados.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Anúncio
          </Button>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filtrar por categoria:</span>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as categorias</SelectItem>
                <SelectItem value="venda">Vendas</SelectItem>
                <SelectItem value="compra">Procuro</SelectItem>
                <SelectItem value="servico">Serviços</SelectItem>
                <SelectItem value="doacao">Doações</SelectItem>
                <SelectItem value="troca">Trocas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Formulário */}
        {showForm && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar Anúncio' : 'Novo Anúncio'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Título do Anúncio *</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ex: Vendo sofá em ótimo estado"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria *</label>
                  <Select value={formData.categoria} onValueChange={(value: 'venda' | 'compra' | 'servico' | 'doacao' | 'troca') => setFormData({...formData, categoria: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="compra">Procuro</SelectItem>
                      <SelectItem value="servico">Serviço</SelectItem>
                      <SelectItem value="doacao">Doação</SelectItem>
                      <SelectItem value="troca">Troca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Descrição *</label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva o item/serviço em detalhes..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Preço (R$)</label>
                  <Input
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: e.target.value})}
                    placeholder="0,00"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome para Contato *</label>
                  <Input
                    value={formData.nome_contato}
                    onChange={(e) => setFormData({...formData, nome_contato: e.target.value})}
                    placeholder="Ex: Maria"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Telefone *</label>
                  <Input
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bloco</label>
                  <Input
                    value={formData.bloco}
                    onChange={(e) => setFormData({...formData, bloco: e.target.value})}
                    placeholder="Ex: A"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Apartamento *</label>
                  <Input
                    value={formData.apartamento}
                    onChange={(e) => setFormData({...formData, apartamento: e.target.value})}
                    placeholder="Ex: 101"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Publicar'} Anúncio
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Classificados */}
        <div className="space-y-4">
          {classificadosFiltrados.map((classificado) => (
            <Card key={classificado.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{classificado.titulo}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoriaColor(classificado.categoria)}`}>
                      {getCategoriaText(classificado.categoria)}
                    </span>
                    {classificado.preco && (
                      <span className="text-lg font-bold text-green-600">
                        R$ {classificado.preco.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  <p className="text-foreground leading-relaxed">{classificado.descricao}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {classificado.nome_contato}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {classificado.telefone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {classificado.bloco ? `Bloco ${classificado.bloco} • Apt ${classificado.apartamento}` : `Apt ${classificado.apartamento}`}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Publicado em: {new Date(classificado.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                {/* Só mostra botões de edição/exclusão para admin ou se for o próprio anúncio */}
                {isAdminLoggedIn && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(classificado)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(classificado.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {classificadosFiltrados.length === 0 && (
          <Card className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum classificado encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {filtroCategoria === 'todos' 
                ? "Ainda não há anúncios publicados." 
                : `Não há anúncios na categoria "${getCategoriaText(filtroCategoria)}".`
              }
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              Publicar primeiro anúncio
            </Button>
          </Card>
        )}

        {/* Informações sobre classificados */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800">Regras dos Classificados</h3>
          <div className="space-y-3 text-sm text-yellow-700">
            <div className="flex gap-3">
              <span className="text-yellow-500">•</span>
              <p>Anúncios são exclusivos para moradores do condomínio</p>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-500">•</span>
              <p>Mantenha a descrição clara e honesta sobre o item/serviço</p>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-500">•</span>
              <p>Remova o anúncio após a venda/prestação do serviço</p>
            </div>
            <div className="flex gap-3">
              <span className="text-yellow-500">•</span>
              <p>Contato direto entre os interessados (administração não intermedia)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Classificados;
