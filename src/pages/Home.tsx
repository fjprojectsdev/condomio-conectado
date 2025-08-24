import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Package, Megaphone, Wrench, Calendar, ShoppingBag, User, LogOut, Edit, MessageCircle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { ProfileModal } from "@/components/ProfileModal";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user, userProfile, logout, loading } = useAuth();

  // Verificar se é primeiro login (sempre false para evitar loops)
  const isFirstTime = false;
  
  useEffect(() => {
    if (isFirstTime && !showProfileModal) {
      setShowProfileModal(true);
    }
  }, [isFirstTime, showProfileModal]);

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
    },
    {
      title: "Salão de Festas",
      icon: Calendar,
      description: "Agendar área de eventos",
      color: "bg-purple-500",
      route: "/salao-festas"
    },
    {
      title: "Classificados",
      icon: ShoppingBag,
      description: "Compra, venda e serviços",
      color: "bg-yellow-500",
      route: "/classificados"
    },
    {
      title: "Chat dos Moradores",
      icon: MessageCircle,
      description: "Converse com seus vizinhos",
      color: "bg-green-500",
      route: "/chat-moradores"
    },
    {
      title: "Caixa de Sugestões",
      icon: Lightbulb,
      description: "Envie suas ideias e sugestões",
      color: "bg-orange-500",
      route: "/caixa-sugestoes"
    }
  ];

  console.log('🏠 Home - Estado atual:', { 
    loading, 
    user: user?.email || 'nenhum', 
    userProfile: userProfile?.full_name || 'nenhum',
    hasValidUser: !!(user && user.id && user.email)
  });
  
  
  // Verificar se deve mostrar login baseado no usuário real
  const shouldShowLogin = !loading && (!user || !user.id);
  console.log('🔍 DEBUG - shouldShowLogin:', shouldShowLogin, { 
    loading, 
    hasUser: !!user, 
    hasUserId: !!(user?.id), 
    hasUserEmail: !!(user?.email) 
  });
  
  // Função para autenticar usuário (chamada após login bem-sucedido)
  const handleLoginSuccess = () => {
    console.log('✅ Login realizado com sucesso! Modal será fechado automaticamente.');
    // Não precisamos mais do setIsAuthenticated, o AuthContext já gerencia isso
  };
  
  // Se não estiver carregando E não estiver autenticado, mostrar tela de login
  if (shouldShowLogin) {
    console.log('🔐 Mostrando tela de login - usuário não autenticado');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Condomínio Conectado</h1>
              <p className="text-gray-600 mb-6">Seu lar, nossa prioridade</p>
              
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-4">
                  Para acessar o sistema do condomínio, você precisa fazer login:
                </div>
              </div>
              
              <Button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                size="lg"
              >
                <User className="mr-2 h-5 w-5" />
                Fazer Login / Criar Conta
              </Button>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg text-sm text-gray-600">
              <p className="font-semibold mb-2">Funcionalidades disponíveis:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span>• Comunicados</span>
                <span>• Encomendas</span>
                <span>• Coleta de Lixo</span>
                <span>• Serviços</span>
                <span>• Salão de Festas</span>
                <span>• Classificados</span>
              </div>
            </div>
          </div>
        </div>
        
        <AuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          onSuccess={() => {
            setShowAuthModal(false);
            handleLoginSuccess();
          }}
        />
        
        <ProfileModal
          open={showProfileModal}
          onOpenChange={setShowProfileModal}
          isFirstTime={isFirstTime}
        />
      </div>
    );
  }

  // Se estiver carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se chegou aqui, o usuário está logado - mostrar o app normal
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-6 shadow-elevated">
        <div className="flex justify-between items-center text-primary-foreground">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold mb-2">Condomínio Conectado</h1>
            <p className="text-primary-foreground/80">Seu lar, nossa prioridade</p>
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                {userProfile?.first_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                {userProfile?.last_name?.charAt(0) || ''}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-medium">
                  {userProfile?.full_name || user.email?.split('@')[0] || 'Usuário'}
                </div>
                <div className="text-xs text-primary-foreground/70">
                  {userProfile?.apartamento || 'Perfil incompleto'}
                </div>
              </div>
              <Button
                onClick={() => setShowProfileModal(true)}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
      
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        isFirstTime={isFirstTime}
      />
    </div>
  );
};

export default Home;