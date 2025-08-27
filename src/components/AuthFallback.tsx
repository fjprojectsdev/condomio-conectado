import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFallbackProps {
  onRetry?: () => void;
  onClearSession?: () => void;
}

export const AuthFallback: React.FC<AuthFallbackProps> = ({ 
  onRetry, 
  onClearSession 
}) => {
  const { clearCorruptedSession } = useAuth();

  const handleClearSession = async () => {
    await clearCorruptedSession();
    if (onClearSession) {
      onClearSession();
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Problema de Autenticação
            </h1>
            <p className="text-gray-600">
              Ocorreu um problema ao verificar sua sessão. Isso pode acontecer quando:
            </p>
          </div>
          
          <div className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Você fechou o navegador sem fazer logout</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Sua sessão expirou</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Problemas de conexão com o servidor</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            
            <Button
              onClick={handleClearSession}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Limpar Sessão e Recarregar
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Se o problema persistir, tente:</p>
            <p className="mt-1">• Limpar cache do navegador</p>
            <p>• Usar modo incógnito</p>
            <p>• Fazer login novamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};
