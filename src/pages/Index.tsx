import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { POSProvider } from '@/contexts/POSContext';
import { Navigation } from '@/components/pos/Navigation';
import { Dashboard } from '@/components/pos/Dashboard';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { Cart } from '@/components/pos/Cart';
import { SalesHistory } from '@/components/pos/SalesHistory';
import { SalesReports } from '@/components/pos/SalesReports';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { InventoryView } from '@/components/pos/InventoryView';
import { InventoryManagement } from '@/components/pos/InventoryManagement';
import { InventoryMovements } from '@/components/pos/InventoryMovements';
import { CategoriesComponent } from '@/components/pos/Categories';
import { SubcategoriesComponent } from '@/components/pos/Subcategories';
import { CustomerManagement } from '@/components/pos/CustomerManagement';
import { UsersComponent } from '@/components/pos/Users';
import { UpdatePassword } from '@/components/pos/UpdatePassword';
import { Roles } from '@/components/pos/Roles';
import { Persons } from '@/components/pos/Persons';
import { TiposIdentificacionComponent } from '@/components/pos/TiposIdentificacion';
import { Units } from '@/components/pos/Units';
import { Button } from '@/components/ui/button';
import { LogOut, Key } from 'lucide-react';

const Index = () => {
  const [activeView, setActiveView] = useState(() => {
    const hash = window.location.hash.substring(1);
    return hash || 'pos';
  });
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    window.location.hash = activeView;
  }, [activeView]);

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
      case 'sales-reports':
        return <SalesReports />;
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'inventory':
        return <InventoryView />;
      case 'inventory-management':
        return <InventoryManagement />;
      case 'inventory-movements':
        return <InventoryMovements />;
      case 'categories':
        return <CategoriesComponent />;
      case 'subcategorias':
        return <SubcategoriesComponent />;
      case 'customers':
        return <CustomerManagement />;
      case 'users':
        return <UsersComponent />;
      case 'roles':
        return <Roles />;
      case 'persons':
        return <Persons />;
      case 'tipos-identificacion':
        return <TiposIdentificacionComponent />;
      case 'units':
        return <Units />;
      case 'update-password':
        return <UpdatePassword />;
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <POSProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar Navigation */}
        <Navigation activeView={activeView} onViewChange={setActiveView} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-end space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView('update-password')}
                className="flex items-center space-x-2"
              >
                <Key className="h-4 w-4" />
                <span>Cambiar Contraseña</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 p-6">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </POSProvider>
  );
};

export default Index;
