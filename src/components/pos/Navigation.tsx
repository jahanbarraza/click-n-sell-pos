
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/contexts/POSContext';
import { 
  Settings, 
  User, 
  Clock, 
  FileText,
  Plus,
  AlertTriangle,
  Users,
  UserCheck,
  Tag,
  Package
} from 'lucide-react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const { userRole, getLowStockAlerts, cart } = usePOS();
  const lowStockCount = getLowStockAlerts().length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'pos', label: 'Punto de Venta', icon: Plus, badge: cartItemCount || undefined },
    { id: 'sales', label: 'Historial', icon: Clock },
    { id: 'inventory', label: 'Inventario', icon: FileText, badge: lowStockCount || undefined },
    ...(userRole === 'admin' ? [
      { id: 'products', label: 'Productos', icon: Package },
      { id: 'categories', label: 'Categorías', icon: Tag },
      { id: 'customers', label: 'Clientes', icon: Users },
      { id: 'users', label: 'Usuarios', icon: UserCheck },
      { id: 'dashboard', label: 'Dashboard', icon: Settings }
    ] : [])
  ];

  return (
    <Card className="p-4 h-full">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">POS</span>
          </div>
          <div>
            <h2 className="font-semibold">Sistema POS</h2>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>

        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'default' : 'ghost'}
            className="justify-start h-12 px-4"
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <Badge 
                variant={item.id === 'inventory' && lowStockCount > 0 ? 'destructive' : 'secondary'}
                className="ml-2"
              >
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}

        {lowStockCount > 0 && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Stock Bajo</span>
            </div>
            <p className="text-xs text-orange-600 mt-1">
              {lowStockCount} producto{lowStockCount !== 1 ? 's' : ''} con stock bajo
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
