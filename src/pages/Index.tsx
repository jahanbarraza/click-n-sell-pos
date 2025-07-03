
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { POSProvider } from '@/contexts/POSContext';
import { HorizontalNavigation } from '@/components/pos/HorizontalNavigation';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { Cart } from '@/components/pos/Cart';
import { SalesHistory } from '@/components/pos/SalesHistory';
import { InventoryView } from '@/components/pos/InventoryView';
import { Dashboard } from '@/components/pos/Dashboard';

export default function Index() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('pos');

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

  const renderContent = () => {
    switch (activeView) {
      case 'pos':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
              <ProductGrid />
            </div>
            <div className="lg:col-span-1">
              <Cart />
            </div>
          </div>
        );
      case 'sales':
        return <SalesHistory />;
      case 'inventory':
        return <InventoryView />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
              <ProductGrid />
            </div>
            <div className="lg:col-span-1">
              <Cart />
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
