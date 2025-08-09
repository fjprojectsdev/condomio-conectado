import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, CalendarDays, Plus, Edit, Trash2, X, Save, AlertTriangle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";

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

const SalaoFestas = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome_solicitante: "",
    telefone: "",
    data_evento: "",
    horario_inicio: "",
    horario_fim: "",
    tipo_evento: "",
    observacoes: ""
  });
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();

  const fetchAgendamentos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('agendamentos_salao')
        .select('*')
        .order('data_evento', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgendamentos();
  }, [fetchAgendamentos]);

  const resetForm = () => {
    setFormData({
      nome_solicitante: "",
      telefone: "",
      data_evento: "",
      horario_inicio: "",
      horario_fim: "",
      tipo_evento: "",
      observacoes: ""
    });
    setShowForm(false);
    setEditingId(null);
  };

  const checkDateAvailability = (date: string, startTime: string, endTime: string, excludeId?: string) => {
    return agendamentos.some(agendamento => 
      agendamento.id !== excludeId &&
      agendamento.data_evento === date &&
      agendamento.status !== 'cancelado' &&
      (
        (startTime >= agendamento.horario_inicio && startTime < agendamento.horario_fim) ||
        (endTime > agendamento.horario_inicio && endTime <= agendamento.horario_fim) ||
        (startTime <= agendamento.horario_inicio && endTime >= agendamento.horario_fim)
      )
    );
  };

  const handleSubmit = async () => {
    if (!formData.nome_solicitante || !formData.telefone || !formData.data_evento || 
        !formData.horario_inicio || !formData.horario_fim || !formData.tipo_evento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validar se horário final é após o inicial
    if (formData.horario_fim <= formData.horario_inicio) {
      toast({
        title: "Erro",
        description: "O horário de fim deve ser posterior ao horário de início.",
        variant: "destructive"
      });
      return;
    }

    // Verificar disponibilidade
    const isUnavailable = checkDateAvailability(
      formData.data_evento, 
      formData.horario_inicio, 
      formData.horario_fim, 
      editingId || undefined
    );

    if (isUnavailable) {
      toast({
        title: "Erro",
        description: "O salão já está reservado neste horário. Escolha outro horário.",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
        nome_solicitante: formData.nome_solicitante,
        telefone: formData.telefone,
        data_evento: formData.data_evento,
        horario_inicio: formData.horario_inicio,
        horario_fim: formData.horario_fim,
        tipo_evento: formData.tipo_evento,
        observacoes: formData.observacoes || null,
        status: 'pendente' as const
      };

      if (editingId) {
        const { error } = await supabase
          .from('agendamentos_salao')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Agendamento atualizado com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('agendamentos_salao')
          .insert([payload]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Agendamento solicitado com sucesso! Aguarde a confirmação da administração."
        });
      }

      resetForm();
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (agendamento: Agendamento) => {
    setFormData({
      nome_solicitante: agendamento.nome_solicitante,
      telefone: agendamento.telefone,
      data_evento: agendamento.data_evento,
      horario_inicio: agendamento.horario_inicio,
      horario_fim: agendamento.horario_fim,
      tipo_evento: agendamento.tipo_evento,
      observacoes: agendamento.observacoes || ""
    });
    setEditingId(agendamento.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos_salao')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Agendamento removido com sucesso!"
      });
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover agendamento.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (id: string, status: 'confirmado' | 'cancelado') => {
    try {
      const { error } = await supabase
        .from('agendamentos_salao')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Agendamento ${status === 'confirmado' ? 'confirmado' : 'cancelado'} com sucesso!`
      });
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do agendamento.",
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

  // Separar agendamentos por status
  const agendamentosPendentes = agendamentos.filter(a => a.status === 'pendente');
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado');
  const agendamentosCancelados = agendamentos.filter(a => a.status === 'cancelado');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Salão de Festas" />
        <div className="p-6">
          <div className="text-center">Carregando agendamentos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Salão de Festas" />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Agendamentos do Salão</h2>
            <p className="text-muted-foreground">
              {agendamentos.length} agendamento{agendamentos.length !== 1 ? 's' : ''} registrado{agendamentos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome do Solicitante *</label>
                  <Input
                    value={formData.nome_solicitante}
                    onChange={(e) => setFormData({...formData, nome_solicitante: e.target.value})}
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Telefone *</label>
                  <Input
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="Ex: (11) 99999-9999"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Data do Evento *</label>
                  <Input
                    type="date"
                    value={formData.data_evento}
                    onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Horário Início *</label>
                  <Input
                    type="time"
                    value={formData.horario_inicio}
                    onChange={(e) => setFormData({...formData, horario_inicio: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Horário Fim *</label>
                  <Input
                    type="time"
                    value={formData.horario_fim}
                    onChange={(e) => setFormData({...formData, horario_fim: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Evento *</label>
                <Input
                  value={formData.tipo_evento}
                  onChange={(e) => setFormData({...formData, tipo_evento: e.target.value})}
                  placeholder="Ex: Aniversário, Casamento, Reunião familiar"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Observações</label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Informações adicionais sobre o evento..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmit} className="bg-purple-500 hover:bg-purple-600">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Atualizar' : 'Solicitar'} Agendamento
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Agendamentos Pendentes */}
        {agendamentosPendentes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Aguardando Confirmação ({agendamentosPendentes.length})
            </h3>
            {agendamentosPendentes.map((agendamento) => (
              <AgendamentoCard
                key={agendamento.id}
                agendamento={agendamento}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isAdmin={isAdminLoggedIn}
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
              <Calendar className="h-5 w-5" />
              Confirmados ({agendamentosConfirmados.length})
            </h3>
            {agendamentosConfirmados.map((agendamento) => (
              <AgendamentoCard
                key={agendamento.id}
                agendamento={agendamento}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isAdmin={isAdminLoggedIn}
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
            <p className="text-muted-foreground mb-4">
              Ainda não há agendamentos para o salão de festas.
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Fazer primeiro agendamento
            </Button>
          </Card>
        )}

        {/* Informações importantes */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Informações Importantes</h3>
          <div className="space-y-3 text-sm text-blue-700">
            <div className="flex gap-3">
              <span className="text-blue-500">•</span>
              <p>Agendamentos devem ser feitos com pelo menos 7 dias de antecedência</p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-500">•</span>
              <p>O salão pode ser reservado das 8h às 23h</p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-500">•</span>
              <p>É necessário deixar o local limpo após o uso</p>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-500">•</span>
              <p>Eventos com mais de 50 pessoas necessitam autorização especial</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

interface AgendamentoCardProps {
  agendamento: Agendamento;
  onEdit: (agendamento: Agendamento) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'confirmado' | 'cancelado') => void;
  isAdmin: boolean;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const AgendamentoCard = ({ 
  agendamento, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  isAdmin, 
  getStatusColor, 
  getStatusText 
}: AgendamentoCardProps) => {
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
          {(isAdmin || agendamento.status === 'pendente') && (
            <Button
              onClick={() => onEdit(agendamento)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {isAdmin && (
            <>
              {agendamento.status === 'pendente' && (
                <>
                  <Button
                    onClick={() => onStatusChange(agendamento.id, 'confirmado')}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Confirmar
                  </Button>
                  <Button
                    onClick={() => onStatusChange(agendamento.id, 'cancelado')}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
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
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="font-medium text-purple-700">{agendamento.tipo_evento}</p>
        {agendamento.observacoes && (
          <p className="text-sm text-muted-foreground">{agendamento.observacoes}</p>
        )}
      </div>
    </Card>
  );
};

export default SalaoFestas;
