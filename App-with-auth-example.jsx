import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import UserHeader from './components/UserHeader';
import ProtectedRoute from './components/ProtectedRoute';

// Importar componentes existentes do seu app
// import Dashboard from './components/Dashboard';
// import Comunicados from './components/Comunicados';
// import Encomendas from './components/Encomendas';
// etc...

// Exemplo de componente principal com autenticação integrada
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Cabeçalho com informações do usuário */}
        <UserHeader />
        
        {/* Conteúdo principal da aplicação */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  );
}

// Exemplo de Dashboard protegido
function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Painel do Condomínio
      </h1>
      
      {/* Seções do dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Comunicados - Todos podem ver */}
        <ProtectedRoute requiredPermission="view_comunicados">
          <ComunicadosCard />
        </ProtectedRoute>
        
        {/* Encomendas - Usuário vê apenas as suas */}
        <ProtectedRoute requiredPermission="view_encomendas">
          <EncomendasCard />
        </ProtectedRoute>
        
        {/* Coleta de Lixo - Todos podem ver */}
        <ProtectedRoute requiredPermission="view_coleta_lixo">
          <ColetaLixoCard />
        </ProtectedRoute>
        
        {/* Painel Admin - Apenas administradores e síndicos */}
        <AdminPanel />
        
      </div>
    </div>
  );
}

// Exemplo de card de comunicados
function ComunicadosCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Comunicados Recentes
      </h3>
      <p className="text-gray-600">
        Últimas notícias e informações do condomínio.
      </p>
      <button className="mt-4 text-blue-600 hover:text-blue-800">
        Ver todos →
      </button>
    </div>
  );
}

// Exemplo de card de encomendas
function EncomendasCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Minhas Encomendas
      </h3>
      <p className="text-gray-600">
        Acompanhe suas entregas e retiradas.
      </p>
      <button className="mt-4 text-blue-600 hover:text-blue-800">
        Ver encomendas →
      </button>
    </div>
  );
}

// Exemplo de card de coleta de lixo
function ColetaLixoCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Coleta de Lixo
      </h3>
      <p className="text-gray-600">
        Próxima coleta: Terça-feira, 8h
      </p>
      <button className="mt-4 text-blue-600 hover:text-blue-800">
        Ver calendário →
      </button>
    </div>
  );
}

// Exemplo de painel administrativo
function AdminPanel() {
  return (
    <ProtectedRoute 
      requiredPermission="admin"
      fallbackComponent={<AdminFallback />}
    >
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Painel Administrativo
        </h3>
        <p className="text-gray-600">
          Gerencie usuários, comunicados e configurações.
        </p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Abrir painel
        </button>
      </div>
    </ProtectedRoute>
  );
}

// Exemplo de fallback para usuários sem permissão de admin
function AdminFallback() {
  return (
    <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Acesso Restrito
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Entre em contato com o síndico para obter permissões administrativas.
        </p>
      </div>
    </div>
  );
}

export default App;
