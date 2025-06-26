
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/contexts/POSContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Receipt,
  RefreshCw,
  Package,
  TrendingUp,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  const { sales, products, getLowStockAlerts } = usePOS();
  const { user } = useAuth();

  const today = new Date();
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    return saleDate.toDateString() === today.toDateString();
  });

  // Calcular métricas del día
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const todayTransactions = todaySales.length;
  const todayProductsSold = todaySales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const todayUniqueCustomers = new Set(todaySales.map(sale => sale.customerName || 'Cliente')).size;
  const averageTicket = todayTransactions > 0 ? todayRevenue / todayTransactions : 0;

  // Datos para gráfico de ventas de la semana (últimos 7 días)
  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    
    const daySales = sales.filter(sale => {
      const saleDate = new Date(sale.timestamp);
      return saleDate.toDateString() === date.toDateString();
    });
    
    const dayRevenue = daySales.reduce((sum, sale) => sum + sale.total, 0);
    
    weekData.push({
      date: dayStr,
      sales: dayRevenue,
      transactions: daySales.length
    });
  }

  // Datos para gráfico de métodos de pago
  const paymentMethods = todaySales.reduce((acc, sale) => {
    const method = sale.paymentMethod;
    const labels = {
      'card': 'Tarjeta Débito',
      'cash': 'Efectivo',
      'digital': 'Digital'
    };
    
    const label = labels[method as keyof typeof labels] || method;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const paymentData = Object.entries(paymentMethods).map(([name, value]) => ({
    name,
    value,
    percentage: todayTransactions > 0 ? (value / todayTransactions * 100).toFixed(0) : 0
  }));

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

  // Productos más vendidos
  const topProducts = products
    .map(product => {
      const soldQuantity = sales.reduce((sum, sale) => 
        sum + (sale.items.find(item => item.product.id === product.id)?.quantity || 0), 0
      );
      return { ...product, soldQuantity };
    })
    .filter(product => product.soldQuantity > 0)
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 5);

  // Valor total del inventario
  const inventoryValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockCount = getLowStockAlerts().length;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, {user?.name?.toUpperCase() || 'USUARIO'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Aquí tienes un resumen de las actividades del día de hoy
          </p>
        </div>
        <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  $ {todayRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {todayTransactions} transacción{todayTransactions !== 1 ? 'es' : ''}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productos Vendidos</p>
                <p className="text-2xl font-bold text-gray-900">{todayProductsSold}</p>
                <p className="text-xs text-gray-500 mt-1">Unidades vendidas hoy</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                <p className="text-2xl font-bold text-gray-900">{todayUniqueCustomers}</p>
                <p className="text-xs text-gray-500 mt-1">Clientes atendidos hoy</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  $ {averageTicket.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Valor promedio por venta</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas de la semana */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Ventas de la Semana</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Tendencia de ventas de los últimos 7 días</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#007bff" 
                    strokeWidth={2}
                    dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de métodos de pago */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago Hoy</CardTitle>
            <p className="text-sm text-gray-600">Distribución de métodos de pago</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {paymentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No hay datos de ventas hoy
                </div>
              )}
            </div>
            {paymentData.length > 0 && (
              <div className="mt-4 space-y-2">
                {paymentData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{entry.name}</span>
                    </div>
                    <span className="text-sm font-medium">{entry.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Estado del inventario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Estado del Inventario</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Productos</span>
              <span className="font-bold">{products.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Valor Inventario</span>
              <span className="font-bold">$ {inventoryValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Stock Bajo</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{lowStockCount}</span>
                {lowStockCount > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-blue-600">{index + 1}.</span>
                    <span className="text-sm">{product.name}</span>
                  </div>
                  <span className="text-sm font-medium">{product.soldQuantity} unidades</span>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No hay ventas registradas</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información del usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Información del Usuario</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Nombre Completo</p>
              <p className="font-bold">{user?.name?.toUpperCase() || 'USUARIO'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rol</p>
              <Badge className="bg-blue-600 hover:bg-blue-700">
                {user?.role === 'admin' ? 'Administrador' : 'Cajero'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tienda</p>
              <p className="font-medium">Click N Sell POS</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <Badge className="bg-green-600 hover:bg-green-700">Activo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
