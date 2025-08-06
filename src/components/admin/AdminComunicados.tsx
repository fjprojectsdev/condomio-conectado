import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Comunicado {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  created_at: string;
  updated_at: string;
}

const AdminComunicados = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newComunicado, setNewComunicado] = useState({
    titulo: '',
    mensagem: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchComunicados();
  }, []);

  const fetchComunicados = async () => {
    try {
      const { data, error } = await supabase
        .from('comunicados')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      setComunicados(data || []);
    } catch (error) {
      console.error('Erro ao buscar comunicados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (newComunicado.titulo.trim() && newComunicado.mensagem.trim()) {
      try {
        const { data, error } = await supabase
          .from('comunicados')
          .insert([{
            titulo: newComunicado.titulo,
            mensagem: newComunicado.mensagem,
            data: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;

        setComunicados([data, ...comunicados]);
        setNewComunicado({ titulo: '', mensagem: '' });
        
        toast({
          title: "Comunicado adicionado",
          description: "O novo comunicado foi publicado com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao adicionar comunicado.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comunicados')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setComunicados(comunicados.filter(c => c.id !== id));
      toast({ title: "Comunicado removido" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar comunicado.",
        variant: "destructive"
      });
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Comunicado</h3>
        <div className="space-y-4">
          <Input
            value={newComunicado.titulo}
            onChange={(e) => setNewComunicado({...newComunicado, titulo: e.target.value})}
            placeholder="Título do comunicado"
          />
          <Textarea
            value={newComunicado.mensagem}
            onChange={(e) => setNewComunicado({...newComunicado, mensagem: e.target.value})}
            placeholder="Mensagem do comunicado"
            rows={4}
          />
          <Button onClick={handleAdd} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Comunicado
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {comunicados.map((comunicado) => (
          <Card key={comunicado.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{comunicado.titulo}</h3>
                <p className="text-muted-foreground mb-2">{comunicado.mensagem}</p>
                <span className="text-sm text-muted-foreground">
                  {new Date(comunicado.data).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => handleDelete(comunicado.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminComunicados;