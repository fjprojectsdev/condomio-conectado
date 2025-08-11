import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserHeader() {
  const { user, userProfile, userRole, logout, isAdmin, isSindico } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  const getUserDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name;
    if (userProfile?.first_name) return userProfile.first_name;
    return user.email?.split('@')[0] || 'Usuário';
  };

  const getRoleName = () => {
    switch (userRole?.role) {
      case 'admin':
        return 'Administrador';
      case 'sindico':
        return 'Síndico';
      case 'morador':
        return 'Morador';
      default:
        return 'Morador';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Título */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Condomínio Conectado
            </h1>
          </div>

          {/* Menu do usuário */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                
                {/* Nome e papel */}
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getRoleName()}
                    {(isAdmin() || isSindico()) && (
                      <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-1 rounded">
                        {isAdmin() ? 'Admin' : 'Síndico'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Seta para baixo */}
                <svg
                  className={`h-4 w-4 text-gray-500 transform transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border">
                {/* Informações do usuário */}
                <div className="px-4 py-2 border-b">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {getRoleName()}
                  </div>
                </div>

                {/* Links do menu */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // TODO: Implementar página de perfil
                      console.log('Abrir perfil');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Meu Perfil
                  </button>
                  
                  {(isAdmin() || isSindico()) && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        // TODO: Implementar painel administrativo
                        console.log('Abrir painel admin');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Painel Administrativo
                    </button>
                  )}
                </div>

                {/* Logout */}
                <div className="border-t py-1">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
