import { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

export default function AuthModal({ onClose, onSuccess }) {
  const [currentTab, setCurrentTab] = useState('login');

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Condomínio Conectado</h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="flex mt-4">
            <button
              onClick={() => setCurrentTab('login')}
              className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                currentTab === 'login'
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:text-gray-800'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setCurrentTab('register')}
              className={`flex-1 py-2 px-4 text-center border-b-2 transition-colors ${
                currentTab === 'register'
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:text-gray-800'
              }`}
            >
              Criar Conta
            </button>
          </div>
        </div>

        <div className="p-0">
          {currentTab === 'login' ? (
            <SignInForm onSuccess={handleSuccess} />
          ) : (
            <SignUpForm onSuccess={() => setCurrentTab('login')} />
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Sistema de gerenciamento do condomínio
          </p>
        </div>
      </div>
    </div>
  );
}
