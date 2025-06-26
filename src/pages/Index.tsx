
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { POSProvider } from '@/contexts/POSContext';
import { Navigation } from '@/components/pos/Navigation';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { Cart } from '@/components/pos/Cart';
import { SalesHistory } from '@/components/pos/SalesHistory';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { InventoryView } from '@/components/pos/InventoryView';
import { CategoryManagement } from '@/components/pos/CategoryManagement';
import { CustomerManagement } from '@/components/pos/CustomerManagement';
import { UserManagement } from '@/components/pos/UserManagement';
import { UpdatePassword } from '@/components/pos/UpdatePassword';
import { Button } from '@/components/ui/button';
import { LogOut, Key } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState('pos');
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'pos':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="lg:col-span-1">
              <ProductGrid />
            </div>
            <div className="lg:col-span-1">
              <Cart />
            </div>
          </div>
        );
      case 'sales':
        return <SalesHistory />;
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'inventory':
        return <InventoryView />;
      case 'categories':
        return <CategoryManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'users':
        return <UserManagement />;
      case 'update-password':
        return <UpdatePassword />;
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <POSProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="grid grid-cols-12 gap-6 p-6 h-screen">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-2">
            <div className="space-y-4">
              <Navigation activeView={activeView} onViewChange={setActiveView} />
              
              {/* User Info and Actions */}
              <div className="bg-white p-4 rounded-lg border space-y-3">
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 capitalize">Rol: {user.role}</p>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveView('update-password')}
                    className="w-full justify-start"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Cambiar Contraseña
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-10">
            <div className="h-full">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </POSProvider>
  );
};

export default Index;
