import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag, User, Phone, MapPin, Tag, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Classificado {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'venda' | 'compra' | 'servico' | 'doacao' | 'troca' | 'aluguel';
  preco: number | null;
  nome_contato: string;
  telefone: string;
  apartamento: string;
  bloco: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminClassificados = () => {
  const [classificados, setClassificados] = useState<Classificado[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClassificados = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("classificados")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setClassificados(data || []);
    } catch (err) {
      console.error("Erro ao buscar classificados:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os classificados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClassificados();
  }, [fetchClassificados]);

  const handleToggleActive = async (id: string, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from("classificados")
        .update({ ativo })
        .eq("id", id);

      if (error) throw error;

      setClassificados(classificados.map(c => 
        c.id === id ? { ...c, ativo } : c
      ));

      toast({
        title: "Status atualizado!",
        description: `Classificado ${ativo ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast({
        title: "Erro",
        description: "Falha ao atualizar status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("classificados")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setClassificados(classificados.filter(c => c.id !== id));
      toast({ 
        title: "Classificado removido!",
        description: "O anúncio foi excluído permanentemente."
      });
    } catch (err) {
      console.error("Erro ao remover classificado:", err);
      toast({ 
        title: "Erro", 
        description: "Falha ao remover classificado.", 
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
      case 'aluguel':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getCategoriaText = (categoria: string) => {
    switch (categoria) {
      case 'venda': return 'Venda';
      case 'compra': return 'Procuro';
      case 'servico': return 'Serviço';
      case 'doacao': return 'Doação';
      case 'troca': return 'Troca';
      case 'aluguel': return 'Aluguel';
      default: return categoria;
    }
  };

  const classificadosAtivos = classificados.filter(c => c.ativo);
  const classificadosInativos = classificados.filter(c => !c.ativo);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">Carregando classificados...</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gerenciar Classificados</h2>
        <p className="text-muted-foreground">
          {classificadosAtivos.length} ativos • {classificadosInativos.length} inativos • {classificados.length} total
        </p>
      </div>

      {/* Classificados Ativos */}
      {classificadosAtivos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Anúncios Ativos ({classificadosAtivos.length})
          </h3>
          {classificadosAtivos.map((classificado) => (
            <ClassificadoAdminCard
              key={classificado.id}
              classificado={classificado}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              getCategoriaColor={getCategoriaColor}
              getCategoriaText={getCategoriaText}
            />
          ))}
        </div>
      )}

      {/* Classificados Inativos */}
      {classificadosInativos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Anúncios Inativos ({classificadosInativos.length})
          </h3>
          {classificadosInativos.map((classificado) => (
            <ClassificadoAdminCard
              key={classificado.id}
              classificado={classificado}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              getCategoriaColor={getCategoriaColor}
              getCategoriaText={getCategoriaText}
            />
          ))}
        </div>
      )}

      {classificados.length === 0 && (
        <Card className="p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum classificado</h3>
          <p className="text-muted-foreground">Ainda não há anúncios publicados pelos moradores.</p>
        </Card>
      )}
    </div>
  );
};

interface ClassificadoAdminCardProps {
  classificado: Classificado;
  onToggleActive: (id: string, ativo: boolean) => void;
  onDelete: (id: string) => void;
  getCategoriaColor: (categoria: string) => string;
  getCategoriaText: (categoria: string) => string;
}

const ClassificadoAdminCard = ({ 
  classificado, 
  onToggleActive, 
  onDelete, 
  getCategoriaColor, 
  getCategoriaText 
}: ClassificadoAdminCardProps) => {
  return (
    <Card className={`p-6 ${!classificado.ativo ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-semibold">{classificado.titulo}</h4>
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
            Publicado em: {new Date(classificado.created_at).toLocaleString('pt-BR')}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onToggleActive(classificado.id, !classificado.ativo)}
            size="sm"
            className={classificado.ativo 
              ? "bg-orange-500 hover:bg-orange-600 text-white" 
              : "bg-green-500 hover:bg-green-600 text-white"
            }
          >
            {classificado.ativo ? (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Desativar
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Ativar
              </>
            )}
          </Button>
          <Button
            onClick={() => onDelete(classificado.id)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
