
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Building,
  Users,
  Package,
  ShoppingCart,
  Warehouse,
  FileText,
  ChevronDown,
  Settings,
  User,
  BarChart3,
  LogOut
} from 'lucide-react';

interface HorizontalNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
}

export const HorizontalNavigation = ({ activeView, onViewChange }: HorizontalNavigationProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    {
      id: 'organizacion',
      label: 'Organización',
      icon: Building,
      children: [
        { id: 'companies', label: 'Compañías', icon: Building },
        { id: 'stores', label: 'Tiendas', icon: Building }
      ]
    },
    {
      id: 'personas',
      label: 'Personas',
      icon: Users,
      children: [
        { id: 'persons', label: 'Personas', icon: User },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'roles', label: 'Roles', icon: Settings },
        { id: 'tipos-identificacion', label: 'Tipos de Identificación', icon: Settings }
      ]
    },
    {
      id: 'productos',
      label: 'Productos',
      icon: Package,
      children: [
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'categories', label: 'Categorías', icon: Package },
        { id: 'subcategorias', label: 'Subcategorías', icon: Package },
        { id: 'impuestos', label: 'Impuestos', icon: Package },
        { id: 'units', label: 'Unidades', icon: Package }
      ]
    },
    {
      id: 'ventas',
      label: 'Ventas',
      icon: ShoppingCart,
      children: [
        { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart },
        { id: 'sales-reports', label: 'Reportes de Ventas', icon: FileText }
      ]
    },
    {
      id: 'inventarios',
      label: 'Inventarios',
      icon: Warehouse,
      children: [
        { id: 'inventory', label: 'Inventario', icon: Warehouse },
        { id: 'inventory-movements', label: 'Entradas y Salidas', icon: Warehouse }
      ]
    },
    {
      id: 'reporteria',
      label: 'Reportería',
      icon: FileText,
      children: [
        { id: 'cierre-diario', label: 'Cierre Diario', icon: FileText }
      ]
    }
  ];

  const toggleDropdown = (menuId: string) => {
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };

  const handleMenuClick = (itemId: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleDropdown(itemId);
    } else {
      onViewChange(itemId);
      setOpenDropdown(null);
    }
  };

  const isActiveParent = (item: MenuItem) => {
    if (item.children) {
      return item.children.some(child => child.id === activeView);
    }
    return item.id === activeView;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Header */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">StampOut POS</h2>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>

          {/* Quick Access Icons */}
          <div className="flex items-center space-x-2">
            <div className="relative group">
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('dashboard')}
                className="p-2"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Dashboard
              </div>
            </div>
            
            <div className="relative group">
              <Button
                variant={activeView === 'pos' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('pos')}
                className="p-2"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Punto de Venta
              </div>
            </div>
            
            <div className="relative group">
              <Button
                variant={activeView === 'sales-reports' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('sales-reports')}
                className="p-2"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Reporte de Ventas
              </div>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 text-sm">
                {user?.name?.toUpperCase() || 'USUARIO'}
              </p>
              <Badge variant="secondary" className="text-xs">
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-6 py-2">
        <div className="flex items-center space-x-1 relative">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <Button
                variant="ghost"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm ${
                  isActiveParent(item)
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleMenuClick(item.id, !!item.children)}
              >
                <item.icon className={`h-4 w-4 ${isActiveParent(item) ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.label}</span>
                {item.children && (
                  <ChevronDown 
                    className={`h-3 w-3 transition-transform ${
                      openDropdown === item.id ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </Button>

              {/* Dropdown Menu */}
              {item.children && openDropdown === item.id && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleMenuClick(child.id, false)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                          activeView === child.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        <child.icon className={`h-4 w-4 ${
                          activeView === child.id ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
