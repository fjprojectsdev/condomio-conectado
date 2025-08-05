import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface Comunicado {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'info' | 'warning' | 'important' | 'success';
  author: string;
}

export const AdminComunicados = () => {
  const [comunicados, setComunicados] = useLocalStorage<Comunicado[]>('comunicados', [
    {
      id: 1,
      title: "Manutenção dos Elevadores",
      content: "Informamos que na próxima terça-feira (23/01) será realizada a manutenção preventiva dos elevadores. O serviço será realizado das 8h às 17h. Pedimos a compreensão de todos.",
      date: "2024-01-20",
      type: "warning",
      author: "Administração"
    },
    {
      id: 2,
      title: "Nova Regra - Horário de Silêncio",
      content: "A partir de 01/02, o horário de silêncio será das 22h às 8h nos dias úteis, e das 22h às 10h nos fins de semana. Contamos com a colaboração de todos para manter um ambiente harmonioso.",
      date: "2024-01-18",
      type: "info",
      author: "Síndico"
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newComunicado, setNewComunicado] = useState({
    title: "",
    content: "",
    type: "info" as const,
    author: "Administração"
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newComunicado.title || !newComunicado.content) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const comunicado: Comunicado = {
      id: Date.now(),
      ...newComunicado,
      date: new Date().toISOString().split('T')[0]
    };

    setComunicados([comunicado, ...comunicados]);
    setNewComunicado({ title: "", content: "", type: "info", author: "Administração" });
    setShowAddForm(false);
    
    toast({
      title: "Comunicado adicionado!",
      description: "O novo comunicado foi publicado com sucesso."
    });
  };

  const handleEdit = (comunicado: Comunicado) => {
    setEditingId(comunicado.id);
  };

  const handleSave = (id: number, updatedData: Partial<Comunicado>) => {
    setComunicados(comunicados.map(c => 
      c.id === id ? { ...c, ...updatedData } : c
    ));
    setEditingId(null);
    
    toast({
      title: "Comunicado atualizado!",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const handleDelete = (id: number) => {
    setComunicados(comunicados.filter(c => c.id !== id));
    
    toast({
      title: "Comunicado removido!",
      description: "O comunicado foi excluído com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Comunicados</h2>
          <p className="text-muted-foreground">{comunicados.length} comunicados publicados</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-condo-blue hover:bg-condo-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Comunicado
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Novo Comunicado</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Título</label>
              <Input
                value={newComunicado.title}
                onChange={(e) => setNewComunicado({...newComunicado, title: e.target.value})}
                placeholder="Título do comunicado..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Conteúdo</label>
              <Textarea
                value={newComunicado.content}
                onChange={(e) => setNewComunicado({...newComunicado, content: e.target.value})}
                placeholder="Conteúdo do comunicado..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo</label>
                <Select value={newComunicado.type} onValueChange={(value: any) => setNewComunicado({...newComunicado, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Informativo</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                    <SelectItem value="important">Importante</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Autor</label>
                <Input
                  value={newComunicado.author}
                  onChange={(e) => setNewComunicado({...newComunicado, author: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAdd} className="bg-condo-green hover:bg-condo-green/90">
                Publicar
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Communications List */}
      <div className="space-y-4">
        {comunicados.map((comunicado) => (
          <ComunicadoCard
            key={comunicado.id}
            comunicado={comunicado}
            isEditing={editingId === comunicado.id}
            onEdit={() => handleEdit(comunicado)}
            onSave={handleSave}
            onDelete={() => handleDelete(comunicado.id)}
            onCancel={() => setEditingId(null)}
          />
        ))}
      </div>
    </div>
  );
};

interface ComunicadoCardProps {
  comunicado: Comunicado;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (id: number, data: Partial<Comunicado>) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const ComunicadoCard = ({ comunicado, isEditing, onEdit, onSave, onDelete, onCancel }: ComunicadoCardProps) => {
  const [editData, setEditData] = useState({
    title: comunicado.title,
    content: comunicado.content,
    type: comunicado.type,
    author: comunicado.author
  });

  const handleSave = () => {
    onSave(comunicado.id, editData);
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Input
            value={editData.title}
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className="font-semibold"
          />
          <Textarea
            value={editData.content}
            onChange={(e) => setEditData({...editData, content: e.target.value})}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select value={editData.type} onValueChange={(value: any) => setEditData({...editData, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Informativo</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="important">Importante</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={editData.author}
              onChange={(e) => setEditData({...editData, author: e.target.value})}
            />
          </div>
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
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{comunicado.title}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(comunicado.date).toLocaleDateString('pt-BR')} • {comunicado.author}
          </p>
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
      <p className="text-foreground leading-relaxed">{comunicado.content}</p>
      <div className="mt-3">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
          comunicado.type === 'warning' ? 'bg-condo-orange/10 text-condo-orange' :
          comunicado.type === 'important' ? 'bg-red-100 text-red-600' :
          comunicado.type === 'success' ? 'bg-condo-green/10 text-condo-green' :
          'bg-condo-blue/10 text-condo-blue'
        }`}>
          {comunicado.type === 'info' ? 'Informativo' :
           comunicado.type === 'warning' ? 'Aviso' :
           comunicado.type === 'important' ? 'Importante' : 'Sucesso'}
        </span>
      </div>
    </Card>
  );
};