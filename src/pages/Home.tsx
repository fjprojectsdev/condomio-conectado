import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Package, Megaphone, Wrench, Calendar, ShoppingBag, User, LogOut, Edit, MessageCircle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { ProfileModal } from "@/components/ProfileModal";
import { useAuth } from "@/contexts/AuthContext";

import ThemeToggle from "@/components/ThemeToggle";
import { NotificationBadge } from "@/components/NotificationBadge";
import { AuthFallback } from "@/components/AuthFallback";

const Home = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthFallback, setShowAuthFallback] = useState(false);
  const { user, userProfile, logout, loading, profileIncomplete } = useAuth();

  // Forçar edição de perfil se estiver incompleto
  useEffect(() => {
    if (user && !loading && profileIncomplete) {
      console.log('⚠️ Perfil incompleto detectado, forçando edição...');
      setShowProfileModal(true);
    }
  }, [user, loading, profileIncomplete]);

  // Detectar loading infinito
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.log('⏰ Loading demorou muito, mostrando fallback...');
        setShowAuthFallback(true);
      }, 15000); // 15 segundos

      return () => clearTimeout(timeout);
    } else {
      setShowAuthFallback(false);
    }
  }, [loading]);

  // Cores suaves e modernas por categoria:
  // Verde suave → serviços (coleta, serviços moradores)
  // Azul suave → comunicação (chat, comunicados, sugestões)
  // Laranja suave → gestão (encomendas, salão, classificados)
  const menuItems = [
    {
      title: "Coleta de Lixo",
      icon: Trash2,
      description: "Dias de coleta",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-500", // Verde suave
      route: "/coleta-lixo",
      badge: null
    },
    {
      title: "Encomendas",
      icon: Package,
      description: "Consultar encomendas",
      color: "bg-gradient-to-br from-amber-400 to-orange-500", // Laranja suave
      route: "/encomendas",
      badge: null // Removido badge estático
    },
    {
      title: "Comunicados",
      icon: Megaphone,
      description: "Avisos da administração",
      color: "bg-gradient-to-br from-blue-400 to-blue-500", // Azul suave
      route: "/comunicados",
      badge: null // Removido badge estático
    },
    {
      title: "Serviços dos Moradores",
      icon: Wrench,
      description: "Profissionais do condomínio",
      color: "bg-gradient-to-br from-teal-400 to-teal-500", // Verde-azulado suave
      route: "/servicos",
      badge: null
    },
    {
      title: "Salão de Festas",
      icon: Calendar,
      description: "Agendar área de eventos",
      color: "bg-gradient-to-br from-purple-400 to-purple-500", // Roxo suave
      route: "/salao-festas",
      badge: null
    },
    {
      title: "Classificados",
      icon: ShoppingBag,
      description: "Compra, venda e serviços",
      color: "bg-gradient-to-br from-pink-400 to-rose-500", // Rosa suave
      route: "/classificados",
      badge: null
    },
    {
      title: "Chat dos Moradores",
      icon: MessageCircle,
      description: "Converse com seus vizinhos",
      color: "bg-gradient-to-br from-cyan-400 to-blue-500", // Ciano suave
      route: "/chat-moradores",
      badge: null
    },
    {
      title: "Caixa de Sugestões",
      icon: Lightbulb,
      description: "Envie suas ideias e sugestões",
      color: "bg-gradient-to-br from-yellow-400 to-amber-500", // Amarelo suave
      route: "/caixa-sugestoes",
      badge: null
    }
  ];

  console.log('🏠 Home - Estado atual:', { 
    loading, 
    user: user?.email || 'nenhum', 
    userProfile: userProfile?.full_name || 'nenhum',
    hasValidUser: !!(user && user.id && user.email),
    profileIncomplete
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

  // Função para quando o perfil for salvo
  const handleProfileSaved = () => {
    console.log('✅ Perfil salvo com sucesso! Modal será fechado.');
    setShowProfileModal(false);
    // O AuthContext irá atualizar automaticamente o profileIncomplete
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
          isFirstTime={false}
        />
      </div>
    );
  }

  // Se estiver carregando, mostrar loading ou fallback
  if (loading) {
    if (showAuthFallback) {
      return (
        <AuthFallback
          onRetry={() => {
            setShowAuthFallback(false);
            window.location.reload();
          }}
          onClearSession={() => {
            setShowAuthFallback(false);
            window.location.reload();
          }}
        />
      );
    }
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
          <p className="text-sm text-gray-500 mt-2">Se demorar muito, aguarde...</p>
        </div>
      </div>
    );
  }

  // Se chegou aqui, o usuário está logado - mostrar o app normal
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-4 sm:p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center text-white space-y-4 sm:space-y-0">
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 tracking-tight">Condomínio Conectado</h1>
            <p className="text-blue-100 text-xs sm:text-sm lg:text-base xl:text-lg font-medium">Seu lar, nossa prioridade</p>
          </div>
         
         {/* User Info */}
         <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
           <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
             <AvatarImage src={userProfile?.avatar_url} />
             <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
               {userProfile?.first_name?.charAt(0) || user.email?.charAt(0) || 'U'}
               {userProfile?.last_name?.charAt(0) || ''}
             </AvatarFallback>
           </Avatar>
           
           {/* User Info Text */}
           <div className="text-center sm:text-right">
             <div className="text-sm font-medium">
               {userProfile?.full_name || user.email?.split('@')[0] || 'Usuário'}
             </div>
             <div className="text-xs text-primary-foreground/70">
               {userProfile?.apartamento || 'Perfil incompleto'}
             </div>
           </div>
           
           {/* Action Buttons - Mobile: vertical, Desktop: horizontal */}
           <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
             <ThemeToggle />
             <NotificationBadge />
             <Button
               onClick={() => setShowProfileModal(true)}
               variant="ghost"
               size="sm"
               className="text-white hover:bg-white/20 transition-all duration-200"
             >
               <Edit className="h-4 w-4" />
             </Button>
             <Button
               onClick={logout}
               variant="ghost"
               size="sm"
               className="text-white hover:bg-white/20 transition-all duration-200"
             >
               <LogOut className="h-4 w-4" />
             </Button>
           </div>
         </div>
       </div>
     </div>

      {/* Menu Grid */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.title}
                className="group p-0 overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 relative rounded-xl sm:rounded-2xl transform hover:-translate-y-1"
              >
                {/* Badge de notificação - VERSÃO ANTERIOR: absolute -top-3 -right-3 */}
                {item.badge && (
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full z-20 shadow-lg font-medium min-w-[20px] h-5 flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
                <Button
                  onClick={() => navigate(item.route)}
                  className="w-full h-full p-3 sm:p-4 lg:p-6 bg-transparent hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 text-left flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 rounded-xl sm:rounded-2xl transition-all duration-300"
                  variant="ghost"
                >
                  <div className={`${item.color} p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
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
      <div className="p-4 sm:p-6 pt-0">
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
       isFirstTime={profileIncomplete}
       onProfileSaved={handleProfileSaved}
     />
   </div>
  );
};

export default Home;