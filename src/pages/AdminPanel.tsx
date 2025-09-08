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
      <Tabs defaultValue="dashboard" className="space-y-0">
        {/* Faixa azul com título e menu */}
        <div className="bg-gradient-primary p-6 shadow-elevated">
          <div className="flex justify-between items-center">
            <div className="text-primary-foreground">
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            </div>
            <div className="flex">
              <Button
                variant="ghost"
                onClick={handleLogout}
                size="sm"
                className="text-primary-foreground/80 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Menu de navegação dentro da faixa azul */}
          <div className="mt-6">
            <TabsList className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/10 rounded-md p-2 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/10 border-b border-white/10">
              <TabsTrigger value="dashboard" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="comunicados" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <Megaphone className="h-4 w-4" />
                Comunicados
              </TabsTrigger>
              <TabsTrigger value="encomendas" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <Package className="h-4 w-4" />
                Encomendas
              </TabsTrigger>
              <TabsTrigger value="servicos" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <Wrench className="h-4 w-4" />
                Serviços
              </TabsTrigger>
              <TabsTrigger value="agendamentos" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <Calendar className="h-4 w-4" />
                Agendamentos
              </TabsTrigger>
              <TabsTrigger value="classificados" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <ShoppingBag className="h-4 w-4" />
                Classificados
              </TabsTrigger>
              <TabsTrigger value="sugestoes" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <Lightbulb className="h-4 w-4" />
                Sugestões
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex flex-col items-center justify-center gap-1 text-primary-foreground">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Conteúdo principal após a faixa azul */}
        <div className="p-6 mt-4">
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
        </div>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
