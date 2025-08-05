import { Navigation } from "@/components/ui/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrench, User, Phone, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const Servicos = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    apartment: "",
    service: "",
    phone: "",
    description: ""
  });

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Carlos Oliveira",
      apartment: "402",
      service: "Encanador",
      phone: "(11) 99999-1234",
      description: "Reparos em geral, vazamentos, instalação de torneiras e chuveiros. Atendimento 24h para emergências.",
      rating: 4.8
    },
    {
      id: 2,
      name: "Ana Santos",
      apartment: "201",
      service: "Eletricista",
      phone: "(11) 99999-5678",
      description: "Instalações elétricas, troca de lâmpadas, reparo em disjuntores. Trabalho com segurança e qualidade.",
      rating: 4.9
    },
    {
      id: 3,
      name: "José Silva",
      apartment: "105",
      service: "Marceneiro",
      phone: "(11) 99999-9012",
      description: "Móveis sob medida, reparos em portas e janelas, prateleiras. Orçamento gratuito.",
      rating: 4.7
    },
    {
      id: 4,
      name: "Maria Costa",
      apartment: "308",
      service: "Diarista",
      phone: "(11) 99999-3456",
      description: "Limpeza residencial, organização, passadoria. Disponível terças e quintas. Referências no condomínio.",
      rating: 5.0
    }
  ]);

  const handleAddService = () => {
    if (newService.name && newService.apartment && newService.service && newService.phone) {
      const service = {
        id: Date.now(),
        ...newService,
        rating: 0
      };
      setServices([...services, service]);
      setNewService({ name: "", apartment: "", service: "", phone: "", description: "" });
      setShowAddForm(false);
    }
  };

  const handleRemoveService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
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
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Apartamento</label>
                  <Input
                    value={newService.apartment}
                    onChange={(e) => setNewService({...newService, apartment: e.target.value})}
                    placeholder="Ex: 101"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Serviço/Profissão</label>
                  <Input
                    value={newService.service}
                    onChange={(e) => setNewService({...newService, service: e.target.value})}
                    placeholder="Ex: Encanador, Eletricista, Diarista..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Telefone</label>
                  <Input
                    value={newService.phone}
                    onChange={(e) => setNewService({...newService, phone: e.target.value})}
                    placeholder="Ex: (11) 99999-1234"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Descrição do Serviço</label>
                <Input
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Descreva os serviços que você oferece..."
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAddService} 
                  className="bg-condo-green hover:bg-condo-green/90"
                  disabled={!newService.name || !newService.apartment || !newService.service || !newService.phone}
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
                  {getServiceIcon(service.service)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{service.service}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {service.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Apt {service.apartment}
                        </div>
                      </div>
                    </div>
                    
                    {service.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">{service.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-condo-blue" />
                      <a 
                        href={`tel:${service.phone}`}
                        className="text-condo-blue hover:text-condo-blue/80 font-medium"
                      >
                        {service.phone}
                      </a>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveService(service.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
                  Sempre peça referências e combine o preço antes de contratar qualquer serviço.
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