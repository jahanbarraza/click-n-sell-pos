
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
  LogOut,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setMobileMenuOpen(false);
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
      <div className="px-4 lg:px-6 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="h-3 w-3 lg:h-5 lg:w-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900 text-sm lg:text-base">StampOut POS</h2>
              <p className="text-xs text-gray-500 hidden sm:block">v1.0.0</p>
            </div>
          </div>

          {/* Quick Access Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
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

          {/* User Info and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-xs lg:text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-900 text-xs lg:text-sm">
                  {user?.name?.toUpperCase() || 'USUARIO'}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {user?.role === 'admin' ? 'Admin' : 'Usuario'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
              >
                <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {/* Quick Access - Mobile */}
            <div className="flex space-x-2 mb-3">
              <Button
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  onViewChange('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 text-xs"
              >
                <LayoutDashboard className="h-3 w-3 mr-1" />
                Dashboard
              </Button>
              <Button
                variant={activeView === 'pos' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  onViewChange('pos');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 text-xs"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                POS
              </Button>
            </div>

            {/* Menu Items - Mobile */}
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id, !!item.children)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                    isActiveParent(item)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className={`h-3 w-3 ${isActiveParent(item) ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.children && (
                    <ChevronDown 
                      className={`h-3 w-3 transition-transform ${
                        openDropdown === item.id ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>

                {/* Mobile Dropdown */}
                {item.children && openDropdown === item.id && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleMenuClick(child.id, false)}
                        className={`w-full text-left px-3 py-2 text-xs rounded flex items-center space-x-2 ${
                          activeView === child.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <child.icon className={`h-3 w-3 ${
                          activeView === child.id ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Navigation Menu */}
      <div className="hidden md:block px-4 lg:px-6 py-1">
        <div className="flex items-center justify-center space-x-1 relative max-w-4xl mx-auto">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <Button
                variant="ghost"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs ${
                  isActiveParent(item)
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleMenuClick(item.id, !!item.children)}
              >
                <item.icon className={`h-3 w-3 ${isActiveParent(item) ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="hidden lg:inline">{item.label}</span>
                {item.children && (
                  <ChevronDown 
                    className={`h-2 w-2 transition-transform ${
                      openDropdown === item.id ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </Button>

              {/* Desktop Dropdown Menu */}
              {item.children && openDropdown === item.id && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleMenuClick(child.id, false)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center space-x-2 ${
                          activeView === child.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        <child.icon className={`h-3 w-3 ${
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
