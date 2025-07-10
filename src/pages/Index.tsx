
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { POSProvider } from '@/contexts/POSContext';
import { HorizontalNavigation } from '@/components/pos/HorizontalNavigation';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { Cart } from '@/components/pos/Cart';
import { SalesHistory } from '@/components/pos/SalesHistory';
import { InventoryView } from '@/components/pos/InventoryView';
import { InventoryMovements } from '@/components/pos/InventoryMovements';
import { Dashboard } from '@/components/pos/Dashboard';
import { CashRegisterControl } from '@/components/pos/CashRegisterControl';
import { ProductManagement } from '@/components/pos/ProductManagement';
import { CategoriesComponent } from '@/components/pos/Categories';
import { Subcategories } from '@/components/pos/Subcategories';
import { ImpuestosComponent } from '@/components/pos/ImpuestosComponent';
import { Units } from '@/components/pos/Units';
import { Companies } from '@/components/pos/Companies';
import { Stores } from '@/components/pos/Stores';
import { Persons } from '@/components/pos/Persons';
import { Users } from '@/components/pos/Users';
import { Roles } from '@/components/pos/Roles';
import { TiposIdentificacionComponent } from '@/components/pos/TiposIdentificacion';
import { CierreDiario } from '@/components/pos/CierreDiario';

export default function Index() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  // Check for hash in URL to set initial view
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== '__lovable_token') {
      console.log('Setting active view from URL hash:', hash);
      setActiveView(hash);
    } else {
      // Si no hay hash, mostrar el dashboard por defecto
      setActiveView('dashboard');
    }
  }, []);

  // Update URL hash when view changes
  useEffect(() => {
    if (activeView !== 'dashboard') {
      window.history.replaceState(null, '', `#${activeView}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [activeView]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Sistema POS</h1>
          <p className="text-gray-600 text-sm sm:text-base">Por favor, inicia sesión para continuar</p>
        </div>
      </div>
    );
  }

  console.log('Current active view:', activeView);

  const renderContent = () => {
    switch (activeView) {
      case 'pos':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 h-full">
            <div className="xl:col-span-2 order-2 xl:order-1">
              <ProductGrid />
            </div>
            <div className="xl:col-span-1 order-1 xl:order-2 space-y-4 lg:space-y-6">
              <CashRegisterControl />
              <Cart />
            </div>
          </div>
        );
      case 'sales-reports':
        return <SalesHistory />;
      case 'inventory':
        return <InventoryView />;
      case 'inventory-movements':
        return <InventoryMovements />;
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoriesComponent />;
      case 'subcategorias':
        console.log('Rendering Subcategories component');
        return <Subcategories />;
      case 'impuestos':
        return <ImpuestosComponent />;
      case 'units':
        return <Units />;
      case 'companies':
        return <Companies />;
      case 'stores':
        return <Stores />;
      case 'persons':
        return <Persons />;
      case 'users':
        return <Users />;
      case 'roles':
        return <Roles />;
      case 'tipos-identificacion':
        return <TiposIdentificacionComponent />;
      case 'cierre-diario':
        return <CierreDiario />;
      default:
        console.log('Default case, showing dashboard for view:', activeView);
        return <Dashboard />;
    }
  };

  return (
    <POSProvider>
      <div className="min-h-screen bg-gray-50">
        <HorizontalNavigation 
          activeView={activeView} 
          onViewChange={setActiveView} 
        />

        <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-6">
          {renderContent()}
        </main>
      </div>
    </POSProvider>
  );
}
