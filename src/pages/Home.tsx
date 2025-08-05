import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Package, Megaphone, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Coleta de Lixo",
      icon: Trash2,
      description: "Dias de coleta",
      color: "bg-condo-green",
      route: "/coleta-lixo"
    },
    {
      title: "Encomendas",
      icon: Package,
      description: "Consultar encomendas",
      color: "bg-condo-blue",
      route: "/encomendas"
    },
    {
      title: "Comunicados",
      icon: Megaphone,
      description: "Avisos da administração",
      color: "bg-condo-orange",
      route: "/comunicados"
    },
    {
      title: "Serviços dos Moradores",
      icon: Wrench,
      description: "Profissionais do condomínio",
      color: "bg-condo-gray",
      route: "/servicos"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-6 shadow-elevated">
        <div className="text-center text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">Condomínio Conectado</h1>
          <p className="text-primary-foreground/80">Seu lar, nossa prioridade</p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.title}
                className="p-0 overflow-hidden shadow-card hover:shadow-elevated transition-all duration-200 border-0"
              >
                <Button
                  onClick={() => navigate(item.route)}
                  className="w-full h-full p-8 bg-white hover:bg-gray-50 text-left flex flex-col items-center gap-4 rounded-lg"
                  variant="ghost"
                >
                  <div className={`${item.color} p-4 rounded-2xl shadow-sm`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Admin Access */}
      <div className="p-6 pt-0">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate("/admin/login")}
            variant="outline"
            className="w-full text-xs text-muted-foreground border-dashed"
          >
            Acesso Administrativo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;