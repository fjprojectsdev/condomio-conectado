import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Save, X, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EncomendaRow {
  id: string;
  nome_morador: string;
  apartamento: number;
  bloco: string | null;
  descricao: string;
  recebida: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminEncomendas = () => {
  const [encomendas, setEncomendas] = useState<EncomendaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEncomenda, setNewEncomenda] = useState({
    nome_morador: "",
    bloco: "",
    apartamento: "",
    descricao: "",
  });
  const { toast } = useToast();

  const fetchEncomendas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("encomendas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setEncomendas(data || []);
    } catch (err) {
      console.error("Erro ao buscar encomendas:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as encomendas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEncomendas();
  }, [fetchEncomendas]);

  const pendingEncomendas = encomendas.filter((e) => !e.recebida);
  const collectedEncomendas = encomendas.filter((e) => e.recebida);

  const handleAdd = async () => {
    if (!newEncomenda.nome_morador || !newEncomenda.apartamento) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos nome, bloco e apartamento.",
        variant: "destructive",
      });
      return;
    }
    try {
      const payload = {
        nome_morador: newEncomenda.nome_morador,
        bloco: newEncomenda.bloco || null,
        apartamento: parseInt(newEncomenda.apartamento, 10),
        descricao: newEncomenda.descricao,
        recebida: false,
      };
      const { data, error } = await supabase
        .from("encomendas")
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      setEncomendas([data as EncomendaRow, ...encomendas]);
      setNewEncomenda({ nome_morador: "", bloco: "", apartamento: "", descricao: "" });
      setShowAddForm(false);
      toast({ title: "Encomenda registrada!", description: "A nova encomenda foi adicionada." });
    } catch (err) {
      console.error("Erro ao adicionar encomenda:", err);
      toast({ title: "Erro", description: "Falha ao adicionar.", variant: "destructive" });
    }
  };

  const handleSave = async (id: string, updatedData: Partial<EncomendaRow>) => {
    try {
      const { data, error } = await supabase
        .from("encomendas")
        .update({
          nome_morador: updatedData.nome_morador,
          bloco: updatedData.bloco,
          apartamento:
            updatedData.apartamento !== undefined ? updatedData.apartamento : undefined,
          descricao: updatedData.descricao,
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      setEncomendas(encomendas.map((e) => (e.id === id ? (data as EncomendaRow) : e)));
      setEditingId(null);
      toast({ title: "Encomenda atualizada!", description: "Alterações salvas." });
    } catch (err) {
      console.error("Erro ao atualizar encomenda:", err);
      toast({ title: "Erro", description: "Falha ao atualizar.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("encomendas").delete().eq("id", id);
      if (error) throw error;
      setEncomendas(encomendas.filter((e) => e.id !== id));
      toast({ title: "Encomenda removida!" });
    } catch (err) {
      console.error("Erro ao remover encomenda:", err);
      toast({ title: "Erro", description: "Falha ao remover.", variant: "destructive" });
    }
  };

  const handleToggleCollected = async (id: string, recebida: boolean) => {
    try {
      const { data, error } = await supabase
        .from("encomendas")
        .update({ recebida })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      setEncomendas(encomendas.map((e) => (e.id === id ? (data as EncomendaRow) : e)));
      toast({ title: recebida ? "Marcada como retirada" : "Marcada como pendente" });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast({ title: "Erro", description: "Falha ao atualizar status.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">Carregando encomendas...</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Encomendas</h2>
          <p className="text-muted-foreground">
            {pendingEncomendas.length} pendentes • {collectedEncomendas.length} retiradas
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-condo-blue hover:bg-condo-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Encomenda
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Nova Encomenda</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nome do Morador</label>
                <Input
                  value={newEncomenda.nome_morador}
                  onChange={(e) => setNewEncomenda({ ...newEncomenda, nome_morador: e.target.value })}
                  placeholder="Ex: Maria Silva"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bloco</label>
                <Input
                  value={newEncomenda.bloco}
                  onChange={(e) => setNewEncomenda({ ...newEncomenda, bloco: e.target.value })}
                  placeholder="Ex: 02"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Apartamento</label>
                <Input
                  value={newEncomenda.apartamento}
                  onChange={(e) => setNewEncomenda({ ...newEncomenda, apartamento: e.target.value })}
                  placeholder="Ex: 14"
                  type="number"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <Textarea
                value={newEncomenda.descricao}
                onChange={(e) => setNewEncomenda({ ...newEncomenda, descricao: e.target.value })}
                placeholder="Ex: Caixa pequena - Correios"
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAdd} className="bg-condo-green hover:bg-condo-green/90">
                Registrar Encomenda
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Pending Packages */}
      {pendingEncomendas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-condo-orange">
            Aguardando Retirada ({pendingEncomendas.length})
          </h3>
          {pendingEncomendas.map((encomenda) => (
            <EncomendaCard
              key={encomenda.id}
              encomenda={encomenda}
              isEditing={editingId === encomenda.id}
              onEdit={() => setEditingId(encomenda.id)}
              onSave={handleSave}
              onDelete={() => handleDelete(encomenda.id)}
              onToggleCollected={handleToggleCollected}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </div>
      )}

      {/* Collected Packages */}
      {collectedEncomendas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-condo-green">
            Já Retiradas ({collectedEncomendas.length})
          </h3>
          {collectedEncomendas.map((encomenda) => (
            <EncomendaCard
              key={encomenda.id}
              encomenda={encomenda}
              isEditing={editingId === encomenda.id}
              onEdit={() => setEditingId(encomenda.id)}
              onSave={handleSave}
              onDelete={() => handleDelete(encomenda.id)}
              onToggleCollected={handleToggleCollected}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </div>
      )}

      {encomendas.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma encomenda registrada</h3>
          <p className="text-muted-foreground">Comece adicionando a primeira encomenda recebida.</p>
        </Card>
      )}
    </div>
  );
};

interface EncomendaCardProps {
  encomenda: EncomendaRow;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (id: string, data: Partial<EncomendaRow>) => void;
  onDelete: () => void;
  onToggleCollected: (id: string, recebida: boolean) => void;
  onCancel: () => void;
}

const EncomendaCard = ({ encomenda, isEditing, onEdit, onSave, onDelete, onToggleCollected, onCancel }: EncomendaCardProps) => {
  const [editData, setEditData] = useState({
    nome_morador: encomenda.nome_morador,
    bloco: encomenda.bloco || "",
    apartamento: String(encomenda.apartamento),
    descricao: encomenda.descricao,
  });

  const handleSave = () => {
    onSave(encomenda.id, {
      nome_morador: editData.nome_morador,
      bloco: editData.bloco || null,
      apartamento: parseInt(editData.apartamento, 10),
      descricao: editData.descricao,
    });
  };

  return (
    <Card className={`p-6 ${encomenda.recebida ? "opacity-60" : ""}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              value={editData.nome_morador}
              onChange={(e) => setEditData({ ...editData, nome_morador: e.target.value })}
              placeholder="Nome do morador"
            />
            <Input
              value={editData.bloco}
              onChange={(e) => setEditData({ ...editData, bloco: e.target.value })}
              placeholder="Bloco"
            />
            <Input
              value={editData.apartamento}
              onChange={(e) => setEditData({ ...editData, apartamento: e.target.value })}
              placeholder="Apartamento"
            />
          </div>
          <Textarea
            value={editData.descricao}
            onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
            placeholder="Descrição"
            rows={2}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="bg-condo-green hover:bg-condo-green/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox
                checked={encomenda.recebida}
                onCheckedChange={(checked) => onToggleCollected(encomenda.id, !!checked)}
              />
              <h3 className="text-lg font-semibold">{encomenda.nome_morador}</h3>
              <span className="text-sm text-muted-foreground">
                {encomenda.bloco ? `Bloco ${encomenda.bloco} • Apt ${encomenda.apartamento}` : `Apt ${encomenda.apartamento}`}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Recebido em {new Date(encomenda.created_at).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-foreground">{encomenda.descricao}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button onClick={onDelete} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div>
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            encomenda.recebida ? "bg-condo-green/10 text-condo-green" : "bg-condo-orange/10 text-condo-orange"
          }`}
        >
          {encomenda.recebida ? "Retirada" : "Pendente"}
        </span>
      </div>
    </Card>
  );
};
