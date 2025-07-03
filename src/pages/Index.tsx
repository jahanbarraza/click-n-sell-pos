
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { POSProvider } from '@/contexts/POSContext';
import { HorizontalNavigation } from '@/components/pos/HorizontalNavigation';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { Cart } from '@/components/pos/Cart';
import { SalesHistory } from '@/components/pos/SalesHistory';
import { InventoryView } from '@/components/pos/InventoryView';
import { Dashboard } from '@/components/pos/Dashboard';
import { CashRegisterControl } from '@/components/pos/CashRegisterControl';

export default function Index() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('pos');

  // Check for hash in URL to set initial view
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== '__lovable_token') {
      setActiveView(hash);
    }
  }, []);

  // Update URL hash when view changes
  useEffect(() => {
    if (activeView !== 'pos') {
      window.history.replaceState(null, '', `#${activeView}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [activeView]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sistema POS</h1>
          <p className="text-gray-600">Por favor, inicia sesión para continuar</p>
        </div>
      </div>
    );
  }

  console.log('Current active view:', activeView);

  const renderContent = () => {
    switch (activeView) {
      case 'pos':
        return (
          <div className="space-y-6">
            <CashRegisterControl />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-2">
                <ProductGrid />
              </div>
              <div className="lg:col-span-1">
                <Cart />
              </div>
            </div>
          </div>
        );
      case 'sales-reports':
        return <SalesHistory />;
      case 'inventory':
        return <InventoryView />;
      case 'dashboard':
        return <Dashboard />;
      case 'companies':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gestión de Compañías</h2>
            <p className="text-gray-600">Módulo en desarrollo</p>
          </div>
        );
      case 'stores':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gestión de Tiendas</h2>
            <p className="text-gray-600">Módulo en desarrollo</p>
          </div>
        );
      case 'persons':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gestión de Personas</h2>
            <p className="text-gray-600">Módulo en desarrollo</p>
          </div>
        );
      case 'users':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
            <p className="text-gray-600">Módulo en desarrollo</p>
          </div>
        );
      case 'products':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>
            <p className="text-gray-600">Módulo en desarrollo</p>
          </div>
        );
      case 'categories':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Gestión de Categorías</h2>
            <p className="text-gray-600">Módulo en desarrollo</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <CashRegisterControl />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-2">
                <ProductGrid />
              </div>
              <div className="lg:col-span-1">
                <Cart />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <POSProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-800">Sistema POS</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Bienvenido, {user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        <HorizontalNavigation 
          activeView={activeView} 
          onViewChange={setActiveView} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderContent()}
        </main>
      </div>
    </POSProvider>
  );
}
