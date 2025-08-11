import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function ProtectedRoute({ children, requiredPermission, fallbackComponent }) {
  const { user, loading, hasPermission } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para acessar esta área do condomínio.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Fazer Login
            </button>
          </div>
        </div>
        
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={() => setShowAuth(false)}
          />
        )}
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallbackComponent) {
      return fallbackComponent;
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
            <p className="text-gray-600 mb-4">
              Você não tem permissão para acessar esta área.
            </p>
            <p className="text-sm text-gray-500">
              Entre em contato com o síndico ou administrador se acredita que deveria ter acesso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
