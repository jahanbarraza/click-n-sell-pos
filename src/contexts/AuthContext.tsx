
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cashier';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // TODO: Reemplazar con llamada real al backend
      // Simulación de login
      if (email === 'admin@test.com' && password === 'admin123') {
        const userData = {
          id: '1',
          email: email,
          name: 'Administrador',
          role: 'admin' as const
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else if (email === 'cajero@test.com' && password === 'cajero123') {
        const userData = {
          id: '2',
          email: email,
          name: 'Cajero',
          role: 'cashier' as const
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // TODO: Reemplazar con llamada real al backend
      // Simulación de actualización de contraseña
      console.log('Actualizando contraseña para usuario:', user?.email);
      console.log('Contraseña actual:', currentPassword);
      console.log('Nueva contraseña:', newPassword);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      setIsLoading(false);
      return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    updatePassword,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
