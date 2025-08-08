import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, User, Phone, MapPin, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/context/AdminContext";

interface ServicoMorador {
  id: string;
  nome_morador: string;
  apartamento: number;
  tipo_servico: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Servicos = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    nome_morador: "",
    apartamento: "",
    tipo_servico: ""
  });
  const [services, setServices] = useState<ServicoMorador[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdminLoggedIn } = useAdmin();

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos_moradores')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar serviços:', error);
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    if (newService.nome_morador && newService.apartamento && newService.tipo_servico) {
      try {
        const { data, error } = await supabase
          .from('servicos_moradores')
          .insert([{
            nome_morador: newService.nome_morador,
            apartamento: parseInt(newService.apartamento),
            tipo_servico: newService.tipo_servico,
            status: 'ativo'
          }])
          .select()
          .single();

        if (error) {
          console.error('Erro ao adicionar serviço:', error);
          toast({
            title: "Erro",
            description: "Erro ao cadastrar serviço. Tente novamente.",
            variant: "destructive"
          });
          return;
        }

        setServices([data, ...services]);
        setNewService({ nome_morador: "", apartamento: "", tipo_servico: "" });
        setShowAddForm(false);
        
        toast({
          title: "Sucesso",
          description: "Serviço cadastrado com sucesso!",
        });
      } catch (error) {
        console.error('Erro ao adicionar serviço:', error);
        toast({
          title: "Erro",
          description: "Erro ao cadastrar serviço. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRemoveService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('servicos_moradores')
        .update({ status: 'inativo' })
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover serviço:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover serviço. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      setServices(services.filter(service => service.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Serviço removido com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover serviço. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getServiceIcon = (serviceType: string) => {
    const type = serviceType.toLowerCase();
    if (type.includes('encanador')) return '🔧';
    if (type.includes('eletricista')) return '⚡';
    if (type.includes('marceneiro')) return '🪚';
    if (type.includes('diarista') || type.includes('limpeza')) return '🧹';
    if (type.includes('jardineiro')) return '🌱';
    if (type.includes('pintor')) return '🎨';
    return '🔨';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation title="Serviços dos Moradores" />
        <div className="p-6">
          <div className="text-center">Carregando serviços...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation title="Serviços dos Moradores" />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Profissionais do Condomínio</h2>
            <p className="text-muted-foreground">
              {services.length} serviço{services.length !== 1 ? 's' : ''} disponível{services.length !== 1 ? 'is' : ''}
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-condo-blue hover:bg-condo-blue/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Formulário para adicionar serviço */}
        {showAddForm && (
          <Card className="p-6 shadow-card border-0">
            <h3 className="text-lg font-semibold mb-4">Cadastrar Novo Serviço</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Seu Nome</label>
                  <Input
                    value={newService.nome_morador}
                    onChange={(e) => setNewService({...newService, nome_morador: e.target.value})}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Apartamento</label>
                  <Input
                    value={newService.apartamento}
                    onChange={(e) => setNewService({...newService, apartamento: e.target.value})}
                    placeholder="Ex: 101"
                    type="number"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Serviço/Profissão</label>
                <Input
                  value={newService.tipo_servico}
                  onChange={(e) => setNewService({...newService, tipo_servico: e.target.value})}
                  placeholder="Ex: Encanador, Eletricista, Diarista..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAddService} 
                  className="bg-condo-green hover:bg-condo-green/90"
                  disabled={!newService.nome_morador || !newService.apartamento || !newService.tipo_servico}
                >
                  Cadastrar Serviço
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Serviços */}
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id} className="p-6 shadow-card border-0">
              <div className="flex items-start gap-4">
                <div className="text-3xl">
                  {getServiceIcon(service.tipo_servico)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{service.tipo_servico}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {service.nome_morador}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Apt {service.apartamento}
                        </div>
                      </div>
                    </div>
                    
                    {/* Botão de remoção - apenas para admins */}
                    {isAdminLoggedIn && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveService(service.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                        title="Remover serviço"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Cadastrado em {new Date(service.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card className="p-8 text-center shadow-card border-0">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum serviço cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Seja o primeiro a cadastrar seu serviço e ajudar os vizinhos!
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-condo-blue hover:bg-condo-blue/90"
            >
              Cadastrar Meu Serviço
            </Button>
          </Card>
        )}

        {/* Info sobre avaliações */}
        {services.length > 0 && (
          <Card className="p-6 shadow-card border-0 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-medium">Dica para Moradores</p>
                <p className="text-sm text-muted-foreground">
                  Entre em contato diretamente com o morador para mais informações sobre o serviço.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Servicos;

