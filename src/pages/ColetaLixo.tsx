import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Calendar, Clock, Edit, Plus, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";

interface ColetaLixo {
  id: string;
  tipo_de_lixo: string;
  dia_da_semana: string;
  created_at: string;
  updated_at: string;
}

const ColetaLixo = () => {
  const [collectionSchedule, setCollectionSchedule] = useState<ColetaLixo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ tipo_de_lixo: "", dia_da_semana: "" });
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  const daysOfWeek = [
    "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"
  ];

  const fetchColetaLixo = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('coleta_lixo')
        .select('*')
        .order('dia_da_semana');

      if (error) {
        console.error('Erro ao buscar cronograma:', error);
        return;
      }

      setCollectionSchedule(data || []);
    } catch (error) {
      console.error('Erro ao buscar cronograma:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColetaLixo();
  }, [fetchColetaLixo]);

  // Mapear dias da semana para números
  const dayMap: { [key: string]: number } = {
    "domingo": 0, "segunda": 1, "terça": 2, "quarta": 3, 
    "quinta": 4, "sexta": 5, "sábado": 6
  };

  const collectionDays = collectionSchedule.map(item => 
    dayMap[item.dia_da_semana.toLowerCase()]
  ).filter(day => day !== undefined);

  const isCollectionDay = collectionDays.includes(dayOfWeek);

  const getNextCollectionDay = () => {
    let nextDay = (dayOfWeek + 1) % 7;
    let daysUntil = 1;
    
    while (!collectionDays.includes(nextDay)) {
      nextDay = (nextDay + 1) % 7;
      daysUntil++;
      if (daysUntil > 7) break; // Evitar loop infinito
    }
    
    return { day: daysOfWeek[nextDay], daysUntil };
  };

  const nextCollection = getNextCollectionDay();

  const handleEdit = async (id: string, tipo_de_lixo: string, dia_da_semana: string) => {
    try {
      const { error } = await supabase
        .from('coleta_lixo')
        .update({ tipo_de_lixo, dia_da_semana })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar cronograma. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      await fetchColetaLixo();
      setEditingItem(null);
      toast({
        title: "Sucesso",
        description: "Cronograma atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cronograma. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAdd = async () => {
    if (!newItem.tipo_de_lixo || !newItem.dia_da_semana) return;

    try {
      const { error } = await supabase
        .from('coleta_lixo')
        .insert([{ tipo_de_lixo: newItem.tipo_de_lixo, dia_da_semana: newItem.dia_da_semana }]);

      if (error) {
        console.error('Erro ao adicionar:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar cronograma. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      await fetchColetaLixo();
      setNewItem({ tipo_de_lixo: "", dia_da_semana: "" });
      setShowAddForm(false);
      toast({
        title: "Sucesso",
        description: "Cronograma adicionado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar cronograma. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coleta_lixo')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar cronograma. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      await fetchColetaLixo();
      toast({
        title: "Sucesso",
        description: "Cronograma removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar cronograma. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Coleta de Lixo" />
        <div className="p-6">
          <div className="text-center">Carregando cronograma...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Coleta de Lixo" />
      
      <div className="p-6 space-y-6">
        {/* Status Atual */}
        <Card className="p-6 shadow-card border-0">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full ${isCollectionDay ? 'bg-condo-green' : 'bg-condo-gray'}`}>
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {isCollectionDay ? "Hoje tem coleta!" : "Hoje não tem coleta"}
              </h2>
              <p className="text-muted-foreground">
                {daysOfWeek[dayOfWeek]}, {today.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          
          {isCollectionDay ? (
            <div className="bg-condo-green/10 p-4 rounded-lg">
              <p className="text-condo-green font-medium">
                ✅ Lembre-se de colocar o lixo para fora até às 06:00
              </p>
            </div>
          ) : (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground">
                Próxima coleta: {nextCollection.day} 
                {nextCollection.daysUntil === 1 ? " (amanhã)" : ` (em ${nextCollection.daysUntil} dias)`}
              </p>
            </div>
          )}
        </Card>

        {/* Cronograma */}
        <Card className="p-6 shadow-card border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-condo-blue" />
              <h3 className="text-lg font-semibold">Cronograma Semanal</h3>
            </div>
            {isAdminLoggedIn && (
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-condo-blue hover:bg-condo-blue/90"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            )}
          </div>

          {/* Formulário para adicionar */}
          {showAddForm && isAdminLoggedIn && (
            <Card className="p-4 mb-4 bg-muted/30">
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Dia da Semana</label>
                    <Select value={newItem.dia_da_semana} onValueChange={(value) => setNewItem({...newItem, dia_da_semana: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="segunda">Segunda-feira</SelectItem>
                        <SelectItem value="terça">Terça-feira</SelectItem>
                        <SelectItem value="quarta">Quarta-feira</SelectItem>
                        <SelectItem value="quinta">Quinta-feira</SelectItem>
                        <SelectItem value="sexta">Sexta-feira</SelectItem>
                        <SelectItem value="sábado">Sábado</SelectItem>
                        <SelectItem value="domingo">Domingo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tipo de Lixo</label>
                    <Input
                      value={newItem.tipo_de_lixo}
                      onChange={(e) => setNewItem({...newItem, tipo_de_lixo: e.target.value})}
                      placeholder="Ex: Lixo Comum, Reciclável"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} size="sm" className="bg-condo-green hover:bg-condo-green/90">
                    Salvar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          <div className="space-y-3">
            {collectionSchedule.map((schedule, index) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                isEditing={editingItem === schedule.id}
                isAdmin={isAdminLoggedIn}
                onEdit={setEditingItem}
                onSave={handleEdit}
                onDelete={handleDelete}
                onCancel={() => setEditingItem(null)}
              />
            ))}
          </div>

          {collectionSchedule.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhum cronograma configurado ainda.
            </p>
          )}
        </Card>

        {/* Dicas */}
        <Card className="p-6 shadow-card border-0">
          <h3 className="text-lg font-semibold mb-4">Dicas Importantes</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Coloque o lixo para fora após às 20h do dia anterior</p>
            </div>
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Use sacos resistentes e bem fechados</p>
            </div>
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Separe o lixo reciclável quando possível</p>
            </div>
            <div className="flex gap-3">
              <span className="text-condo-green">•</span>
              <p>Não deixe lixo espalhado pelos corredores</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Componente para cada item do cronograma
interface ScheduleItemProps {
  schedule: ColetaLixo;
  isEditing: boolean;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, tipo_de_lixo: string, dia_da_semana: string) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const ScheduleItem = ({ schedule, isEditing, isAdmin, onEdit, onSave, onDelete, onCancel }: ScheduleItemProps) => {
  const [editValues, setEditValues] = useState({
    tipo_de_lixo: schedule.tipo_de_lixo,
    dia_da_semana: schedule.dia_da_semana
  });

  if (isEditing && isAdmin) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg border-2 border-condo-blue/30">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Dia da Semana</label>
              <Select value={editValues.dia_da_semana} onValueChange={(value) => setEditValues({...editValues, dia_da_semana: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="segunda">Segunda-feira</SelectItem>
                  <SelectItem value="terça">Terça-feira</SelectItem>
                  <SelectItem value="quarta">Quarta-feira</SelectItem>
                  <SelectItem value="quinta">Quinta-feira</SelectItem>
                  <SelectItem value="sexta">Sexta-feira</SelectItem>
                  <SelectItem value="sábado">Sábado</SelectItem>
                  <SelectItem value="domingo">Domingo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tipo de Lixo</label>
              <Input
                value={editValues.tipo_de_lixo}
                onChange={(e) => setEditValues({...editValues, tipo_de_lixo: e.target.value})}
                placeholder="Ex: Lixo Comum, Reciclável"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onSave(schedule.id, editValues.tipo_de_lixo, editValues.dia_da_semana)} 
              size="sm" 
              className="bg-condo-green hover:bg-condo-green/90"
            >
              Salvar
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(schedule.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
      <div>
        <p className="font-medium capitalize">{schedule.dia_da_semana}</p>
        <p className="text-sm text-muted-foreground">{schedule.tipo_de_lixo}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          06:00 às 12:00
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(schedule.id)}
            className="text-condo-blue hover:text-condo-blue/80"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ColetaLixo;