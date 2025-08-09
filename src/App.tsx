import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/context/AdminContext";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Home from "./pages/Home";
import ColetaLixo from "./pages/ColetaLixo";
import Encomendas from "./pages/Encomendas";
import Comunicados from "./pages/Comunicados";
import Servicos from "./pages/Servicos";
import SalaoFestas from "./pages/SalaoFestas";
import Classificados from "./pages/Classificados";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coleta-lixo" element={<ColetaLixo />} />
            <Route path="/encomendas" element={<Encomendas />} />
            <Route path="/comunicados" element={<Comunicados />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/salao-festas" element={<SalaoFestas />} />
            <Route path="/classificados" element={<Classificados />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
