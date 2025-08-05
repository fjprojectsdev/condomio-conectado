import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Save, X, Package } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface Encomenda {
  id: number;
  name: string;
  apartment: string;
  description: string;
  date: string;
  collected: boolean;
}

export const AdminEncomendas = () => {
  const [encomendas, setEncomendas] = useLocalStorage<Encomenda[]>('encomendas', [
    {
      id: 1,
      name: "Maria Silva",
      apartment: "101",
      description: "Caixa média - Correios",
      date: "2024-01-15",
      collected: false
    },
    {
      id: 2,
      name: "João Santos",
      apartment: "203",
      description: "Envelope - Sedex",
      date: "2024-01-14",
      collected: false
    },
    {
      id: 3,
      name: "Ana Costa",
      apartment: "305",
      description: "Caixa pequena - Mercado Livre",
      date: "2024-01-13",
      collected: true
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newEncomenda, setNewEncomenda] = useState({
    name: "",
    apartment: "",
    description: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const pendingEncomendas = encomendas.filter(e => !e.collected);
  const collectedEncomendas = encomendas.filter(e => e.collected);

  const handleAdd = () => {
    if (!newEncomenda.name || !newEncomenda.apartment) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o nome e apartamento.",
        variant: "destructive"
      });
      return;
    }

    const encomenda: Encomenda = {
      id: Date.now(),
      ...newEncomenda,
      date: new Date().toISOString().split('T')[0],
      collected: false
    };

    setEncomendas([encomenda, ...encomendas]);
    setNewEncomenda({ name: "", apartment: "", description: "" });
    setShowAddForm(false);
    
    toast({
      title: "Encomenda registrada!",
      description: "A nova encomenda foi adicionada com sucesso."
    });
  };

  const handleEdit = (encomenda: Encomenda) => {
    setEditingId(encomenda.id);
  };

  const handleSave = (id: number, updatedData: Partial<Encomenda>) => {
    setEncomendas(encomendas.map(e => 
      e.id === id ? { ...e, ...updatedData } : e
    ));
    setEditingId(null);
    
    toast({
      title: "Encomenda atualizada!",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const handleDelete = (id: number) => {
    setEncomendas(encomendas.filter(e => e.id !== id));
    
    toast({
      title: "Encomenda removida!",
      description: "A encomenda foi excluída com sucesso."
    });
  };

  const handleToggleCollected = (id: number, collected: boolean) => {
    setEncomendas(encomendas.map(e => 
      e.id === id ? { ...e, collected } : e
    ));
    
    toast({
      title: collected ? "Encomenda marcada como retirada!" : "Encomenda marcada como pendente!",
      description: "Status atualizado com sucesso."
    });
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nome do Morador</label>
                <Input
                  value={newEncomenda.name}
                  onChange={(e) => setNewEncomenda({...newEncomenda, name: e.target.value})}
                  placeholder="Ex: Maria Silva"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Apartamento</label>
                <Input
                  value={newEncomenda.apartment}
                  onChange={(e) => setNewEncomenda({...newEncomenda, apartment: e.target.value})}
                  placeholder="Ex: 101"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <Textarea
                value={newEncomenda.description}
                onChange={(e) => setNewEncomenda({...newEncomenda, description: e.target.value})}
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
          <h3 className="text-lg font-semibold text-condo-orange">Aguardando Retirada ({pendingEncomendas.length})</h3>
          {pendingEncomendas.map((encomenda) => (
            <EncomendaCard
              key={encomenda.id}
              encomenda={encomenda}
              isEditing={editingId === encomenda.id}
              onEdit={() => handleEdit(encomenda)}
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
          <h3 className="text-lg font-semibold text-condo-green">Já Retiradas ({collectedEncomendas.length})</h3>
          {collectedEncomendas.map((encomenda) => (
            <EncomendaCard
              key={encomenda.id}
              encomenda={encomenda}
              isEditing={editingId === encomenda.id}
              onEdit={() => handleEdit(encomenda)}
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
          <p className="text-muted-foreground">
            Comece adicionando a primeira encomenda recebida.
          </p>
        </Card>
      )}
    </div>
  );
};

interface EncomendaCardProps {
  encomenda: Encomenda;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (id: number, data: Partial<Encomenda>) => void;
  onDelete: () => void;
  onToggleCollected: (id: number, collected: boolean) => void;
  onCancel: () => void;
}

const EncomendaCard = ({ encomenda, isEditing, onEdit, onSave, onDelete, onToggleCollected, onCancel }: EncomendaCardProps) => {
  const [editData, setEditData] = useState({
    name: encomenda.name,
    apartment: encomenda.apartment,
    description: encomenda.description
  });

  const handleSave = () => {
    onSave(encomenda.id, editData);
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              placeholder="Nome do morador"
            />
            <Input
              value={editData.apartment}
              onChange={(e) => setEditData({...editData, apartment: e.target.value})}
              placeholder="Apartamento"
            />
          </div>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({...editData, description: e.target.value})}
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
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${encomenda.collected ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Checkbox
              checked={encomenda.collected}
              onCheckedChange={(checked) => onToggleCollected(encomenda.id, !!checked)}
            />
            <h3 className="text-lg font-semibold">{encomenda.name}</h3>
            <span className="text-sm text-muted-foreground">Apt {encomenda.apartment}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Recebido em {new Date(encomenda.date).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-foreground">{encomenda.description}</p>
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
      <div>
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          encomenda.collected 
            ? 'bg-condo-green/10 text-condo-green' 
            : 'bg-condo-orange/10 text-condo-orange'
        }`}>
          {encomenda.collected ? 'Retirada' : 'Pendente'}
        </span>
      </div>
    </Card>
  );
};