import { useEffect, useState } from "react";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

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
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-screen">
          {/* Sidebar / Drawer */}
          <div className="md:col-start-1 md:col-end-2">
            {/* Overlay para mobile */}
            {isDrawerOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setIsDrawerOpen(false)}
              />
            )}
            {/* Sidebar container */}
            <div
              className={`fixed md:sticky md:top-0 top-0 left-0 h-full md:h-[100dvh] w-4/5 max-w-xs md:w-60 bg-gray-900 z-30 transform transition-transform duration-300 ease-in-out
              ${isDrawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
              <div className="p-4 text-white font-semibold tracking-wide md:block">
                Menu
              </div>
              {/* Navegação (TabsList vertical) */}
              <TabsList className="flex flex-col items-stretch gap-1 bg-transparent p-2 text-white h-auto">
                <TabsTrigger value="dashboard" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="comunicados" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <Megaphone className="h-4 w-4" />
                  Comunicados
                </TabsTrigger>
                <TabsTrigger value="encomendas" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <Package className="h-4 w-4" />
                  Encomendas
                </TabsTrigger>
                <TabsTrigger value="servicos" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <Wrench className="h-4 w-4" />
                  Serviços
                </TabsTrigger>
                <TabsTrigger value="agendamentos" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <Calendar className="h-4 w-4" />
                  Agendamentos
                </TabsTrigger>
                <TabsTrigger value="classificados" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <ShoppingBag className="h-4 w-4" />
                  Classificados
                </TabsTrigger>
                <TabsTrigger value="sugestoes" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <Lightbulb className="h-4 w-4" />
                  Sugestões
                </TabsTrigger>
                <TabsTrigger value="chat" className="justify-start w-full gap-3 data-[state=active]:bg-white/10">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Área de conteúdo */}
          <div className="md:col-start-2 md:col-end-3">
            {/* Header azul dentro do conteúdo */}
            <div className="bg-gradient-primary p-4 md:p-6 shadow-elevated sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Botão hamburger (mobile) */}
                  <button
                    onClick={() => setIsDrawerOpen(v => !v)}
                    className="md:hidden inline-flex items-center justify-center p-2 rounded text-primary-foreground hover:bg-white/10"
                    aria-label="Abrir menu"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">Painel Administrativo</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/")}
                    className="text-primary-foreground hover:bg-white/10"
                  >
                    Ver App
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-primary-foreground/90 hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-4 md:p-6">
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
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
