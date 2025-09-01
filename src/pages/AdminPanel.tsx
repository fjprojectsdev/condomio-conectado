import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/context/AdminContext";
import { LogOut, Package, Megaphone, Wrench, Calendar, ShoppingBag, Lightbulb, MessageCircle, LayoutDashboard } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminComunicados from "@/components/admin/AdminComunicados";
import { AdminEncomendas } from "@/components/admin/AdminEncomendas";
import AdminServicos from "@/components/admin/AdminServicos";
import { AdminAgendamentos } from "@/components/admin/AdminAgendamentos";
import { AdminClassificados } from "@/components/admin/AdminClassificados";
import AdminSugestoes from "@/pages/AdminSugestoes";
import AdminChat from "@/components/admin/AdminChat";

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
            <p className="opacity-90">Dashboard, comunicados, encomendas, serviços e mais</p>
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
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 max-w-7xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
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
            <TabsTrigger value="agendamentos" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="classificados" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Classificados
            </TabsTrigger>
            <TabsTrigger value="sugestoes" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Sugestões
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="comunicados" className="space-y-6">
            <AdminComunicados />
          </TabsContent>

          <TabsContent value="encomendas" className="space-y-6">
            <AdminEncomendas />
          </TabsContent>

          <TabsContent value="servicos" className="space-y-6">
            <AdminServicos />
          </TabsContent>

          <TabsContent value="agendamentos" className="space-y-6">
            <AdminAgendamentos />
          </TabsContent>

          <TabsContent value="classificados" className="space-y-6">
            <AdminClassificados />
          </TabsContent>

          <TabsContent value="sugestoes" className="space-y-6">
            <AdminSugestoes embedded={true} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <AdminChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
