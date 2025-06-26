import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  Building2,
  Users,
  User,
  UserCheck,
  Shield,
  CreditCard,
  Package,
  Tag,
  Tags,
  DollarSign,
  Ruler,
  ShoppingCart,
  BarChart3,
  Warehouse,
  TrendingUp,
  FileText,
  Calendar,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
}

export const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['gestion-ventas']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'gestion-organizacion',
      label: 'Gestión Organización',
      icon: Building2
    },
    {
      id: 'gestion-personas',
      label: 'Gestión Personas',
      icon: Users,
      children: [
        { id: 'persons', label: 'Personas', icon: User },
        { id: 'users', label: 'Usuarios', icon: UserCheck },
        { id: 'roles', label: 'Roles', icon: Shield },
        { id: 'tipos-identificacion', label: 'Tipos de Identificación', icon: CreditCard }
      ]
    },
    {
      id: 'gestion-productos',
      label: 'Gestión Productos',
      icon: Package,
      children: [
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'categories', label: 'Categorías', icon: Tag },
        { id: 'subcategorias', label: 'Subcategorías', icon: Tags },
        { id: 'impuestos', label: 'Impuestos', icon: DollarSign },
        { id: 'units', label: 'Unidades', icon: Ruler }
      ]
    },
    {
      id: 'gestion-ventas',
      label: 'Gestión Ventas',
      icon: ShoppingCart,
      children: [
        { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart },
        { id: 'sales-reports', label: 'Reportes de Ventas', icon: BarChart3 },
        { id: 'inventory-management', label: 'Inventario', icon: Warehouse }
      ]
    },
    {
      id: 'gestion-inventario',
      label: 'Gestión Inventario',
      icon: Warehouse,
      children: [
        { id: 'inventory-movements', label: 'Entradas y Salidas', icon: TrendingUp }
      ]
    },
    {
      id: 'reporteria',
      label: 'Reportería',
      icon: FileText,
      children: [
        { id: 'cierre-diario', label: 'Cierre Diario', icon: Calendar }
      ]
    }
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isMenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

  const isActiveItem = (itemId: string) => {
    return activeView === itemId;
  };

  const isParentActive = (item: MenuItem) => {
    if (item.children) {
      return item.children.some(child => isActiveItem(child.id));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = isMenuExpanded(item.id);
    const isActive = isActiveItem(item.id);
    const isParentOfActive = isParentActive(item);

    return (
      <div key={item.id}>
        <Button
          variant="ghost"
          className={`w-full justify-start h-10 px-3 ${
            level > 0 ? 'pl-8' : 'pl-3'
          } ${
            isActive 
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-50' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              onViewChange(item.id);
            }
          }}
        >
          <item.icon className={`h-4 w-4 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
          <span className="flex-1 text-left text-sm">{item.label}</span>
          {hasChildren && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )
          )}
        </Button>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">StampOut POS</h2>
            <p className="text-xs text-gray-500">1.0.0</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm">
              {user?.name?.toUpperCase() || 'USUARIO'}
            </p>
            <Badge variant="secondary" className="text-xs">
              {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </div>
    </div>
  );
};
