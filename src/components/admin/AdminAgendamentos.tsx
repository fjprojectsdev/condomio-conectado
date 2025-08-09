import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, Phone, Calendar, Clock, User, CheckCircle, XCircle, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Agendamento {
  id: string;
  nome_solicitante: string;
  telefone: string;
  data_evento: string;
  horario_inicio: string;
  horario_fim: string;
  tipo_evento: string;
  observacoes: string | null;
  status: 'pendente' | 'confirmado' | 'cancelado';
  created_at: string;
  updated_at: string;
}

export const AdminAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgendamentos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("agendamentos_salao")
        .select("*")
        .order("data_evento", { ascending: true });
      
      if (error) throw error;
      setAgendamentos(data || []);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAgendamentos();
  }, [fetchAgendamentos]);

  const handleStatusChange = async (id: string, status: 'confirmado' | 'cancelado') => {
    try {
      const { error } = await supabase
        .from("agendamentos_salao")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setAgendamentos(agendamentos.map(a => 
        a.id === id ? { ...a, status } : a
      ));

      toast({
        title: "Status atualizado!",
        description: `Agendamento ${status === 'confirmado' ? 'confirmado' : 'cancelado'} com sucesso.`,
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
        .from("agendamentos_salao")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setAgendamentos(agendamentos.filter(a => a.id !== id));
      toast({ 
        title: "Agendamento removido!",
        description: "O agendamento foi excluído com sucesso."
      });
    } catch (err) {
      console.error("Erro ao remover agendamento:", err);
      toast({ 
        title: "Erro", 
        description: "Falha ao remover agendamento.", 
        variant: "destructive" 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'cancelado':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  const agendamentosPendentes = agendamentos.filter(a => a.status === 'pendente');
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado');
  const agendamentosCancelados = agendamentos.filter(a => a.status === 'cancelado');

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">Carregando agendamentos...</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gerenciar Agendamentos</h2>
        <p className="text-muted-foreground">
          {agendamentosPendentes.length} pendentes • {agendamentosConfirmados.length} confirmados • {agendamentosCancelados.length} cancelados
        </p>
      </div>

      {/* Agendamentos Pendentes */}
      {agendamentosPendentes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Aguardando Confirmação ({agendamentosPendentes.length})
          </h3>
          {agendamentosPendentes.map((agendamento) => (
            <AgendamentoAdminCard
              key={agendamento.id}
              agendamento={agendamento}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      )}

      {/* Agendamentos Confirmados */}
      {agendamentosConfirmados.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Confirmados ({agendamentosConfirmados.length})
          </h3>
          {agendamentosConfirmados.map((agendamento) => (
            <AgendamentoAdminCard
              key={agendamento.id}
              agendamento={agendamento}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      )}

      {/* Agendamentos Cancelados */}
      {agendamentosCancelados.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Cancelados ({agendamentosCancelados.length})
          </h3>
          {agendamentosCancelados.map((agendamento) => (
            <AgendamentoAdminCard
              key={agendamento.id}
              agendamento={agendamento}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
          ))}
        </div>
      )}

      {agendamentos.length === 0 && (
        <Card className="p-8 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum agendamento</h3>
          <p className="text-muted-foreground">Ainda não há agendamentos registrados para o salão.</p>
        </Card>
      )}
    </div>
  );
};

interface AgendamentoAdminCardProps {
  agendamento: Agendamento;
  onStatusChange: (id: string, status: 'confirmado' | 'cancelado') => void;
  onDelete: (id: string) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AgendamentoAdminCard = ({ 
  agendamento, 
  onStatusChange, 
  onDelete, 
  getStatusColor, 
  getStatusText 
}: AgendamentoAdminCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-semibold">{agendamento.nome_solicitante}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(agendamento.status)}`}>
              {getStatusText(agendamento.status)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {agendamento.telefone}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(agendamento.data_evento + 'T00:00:00').toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {agendamento.horario_inicio} às {agendamento.horario_fim}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {agendamento.status === 'pendente' && (
            <>
              <Button
                onClick={() => onStatusChange(agendamento.id, 'confirmado')}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirmar
              </Button>
              <Button
                onClick={() => onStatusChange(agendamento.id, 'cancelado')}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </>
          )}
          <Button
            onClick={() => onDelete(agendamento.id)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="font-medium text-purple-700">{agendamento.tipo_evento}</p>
        {agendamento.observacoes && (
          <p className="text-sm text-muted-foreground">{agendamento.observacoes}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Solicitado em: {new Date(agendamento.created_at).toLocaleString('pt-BR')}
        </p>
      </div>
    </Card>
  );
};
