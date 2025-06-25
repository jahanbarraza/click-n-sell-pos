
import React, { useState } from 'react';
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

const Index = () => {
  const [activeView, setActiveView] = useState('pos');

  const renderMainContent = () => {
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
            <Navigation activeView={activeView} onViewChange={setActiveView} />
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
