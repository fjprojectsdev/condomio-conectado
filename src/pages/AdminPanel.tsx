import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/context/AdminContext";
import { LogOut, Package, Megaphone, Wrench } from "lucide-react";
import AdminComunicados from "@/components/admin/AdminComunicados";
import { AdminEncomendas } from "@/components/admin/AdminEncomendas";
import AdminServicos from "@/components/admin/AdminServicos";

const AdminPanel = () => {
  const { isAdminLoggedIn, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [isAdminLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-6 shadow-elevated">
        <div className="flex justify-between items-center">
          <div className="text-primary-foreground">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="opacity-90">Gerenciar comunicados, encomendas e serviços</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-primary-foreground hover:bg-white/20"
            >
              Ver App
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="comunicados" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="comunicados" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Comunicados
            </TabsTrigger>
            <TabsTrigger value="encomendas" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Encomendas
            </TabsTrigger>
            <TabsTrigger value="servicos" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Serviços
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comunicados" className="space-y-6">
            <AdminComunicados />
          </TabsContent>

          <TabsContent value="encomendas" className="space-y-6">
            <AdminEncomendas />
          </TabsContent>

          <TabsContent value="servicos" className="space-y-6">
            <AdminServicos />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;