// EXEMPLO DE INTEGRAÇÃO DO SISTEMA DE LOGIN
// Cole este código no seu App.jsx principal

import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import UserHeader from './components/UserHeader';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/AuthModal';

// Importe seus componentes existentes aqui
// import Dashboard from './components/Dashboard';
// import Comunicados from './components/Comunicados';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Cabeçalho com login/logout */}
        <UserHeader />
        
        {/* Conteúdo protegido por login */}
        <main className="container mx-auto px-4 py-8">
          <ProtectedRoute>
            {/* Aqui vai o conteúdo do seu app */}
            <DashboardDoCondominio />
          </ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  );
}

// Exemplo de dashboard protegido
function DashboardDoCondominio() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Bem-vindo ao Condomínio Conectado!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Comunicados */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">📢 Comunicados</h3>
          <p className="text-gray-600 mb-4">
            Últimas notícias do condomínio
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ver Todos
          </button>
        </div>

        {/* Card de Encomendas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">📦 Encomendas</h3>
          <p className="text-gray-600 mb-4">
            Acompanhe suas entregas
          </p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Minhas Encomendas
          </button>
        </div>

        {/* Card Administrativo - Só aparece para admins */}
        <ProtectedRoute requiredPermission="admin" fallbackComponent={<CardSemPermissao />}>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-lg font-semibold mb-4">🔧 Painel Admin</h3>
            <p className="text-gray-600 mb-4">
              Gerenciar usuários e sistema
            </p>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Abrir Painel
            </button>
          </div>
        </ProtectedRoute>
      </div>
    </div>
  );
}

// Fallback para usuários sem permissão de admin
function CardSemPermissao() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-center text-gray-500">
        <p>🔒 Acesso Restrito</p>
        <p className="text-sm">Apenas administradores</p>
      </div>
    </div>
  );
}

// Exemplo de página sem login (página inicial)
export function PaginaInicial() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Condomínio Conectado
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Gerencie seu condomínio de forma inteligente
          </p>
          
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Fazer Login
          </button>
          
          {/* Modal de Login/Registro */}
          {showAuth && (
            <AuthModal
              onClose={() => setShowAuth(false)}
              onSuccess={() => {
                setShowAuth(false);
                // Redirecionar para dashboard ou atualizar estado
                window.location.reload();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
