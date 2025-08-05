import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdminLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in from sessionStorage
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (adminSession === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === 'admin123') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('adminLoggedIn');
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};