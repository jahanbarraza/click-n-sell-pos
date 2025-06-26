
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePOS } from '@/contexts/POSContext';
import { 
  FileText, 
  DollarSign, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Users,
  User,
  ShoppingCart,
  Calendar
} from 'lucide-react';

export const Dashboard = () => {
  const { sales, products, getLowStockAlerts, userRole } = usePOS();

  const today = new Date();
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    return saleDate.toDateString() === today.toDateString();
  });

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const weekSales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    return saleDate >= thisWeek;
  });

  const thisMonth = new Date();
  thisMonth.setMonth(thisMonth.getMonth() - 1);
  const monthSales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    return saleDate >= thisMonth;
  });

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const weekRevenue = weekSales.reduce((sum, sale) => sum + sale.total, 0);
  const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = products.length;
  const lowStockCount = getLowStockAlerts().length;
  const averageSaleValue = sales.length > 0 ? totalRevenue / sales.length : 0;

  // Productos más vendidos con información detallada
  const topProducts = products
    .map(product => {
      const soldQuantity = sales.reduce((sum, sale) => 
        sum + (sale.items.find(item => item.product.id === product.id)?.quantity || 0), 0
      );
      const revenue = soldQuantity * product.price;
      const salesCount = sales.filter(sale => 
        sale.items.some(item => item.product.id === product.id)
      ).length;
      
      return {
        ...product,
        soldQuantity,
        revenue,
        salesCount
      };
    })
    .filter(product => product.soldQuantity > 0)
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 5);

  // Productos con stock crítico (menos de 5 unidades)
  const criticalStock = products.filter(product => product.stock <= 5);

  const stats = [
    {
      title: "Ventas Hoy",
      value: todaySales.length.toString(),
      subtitle: `$${todayRevenue.toFixed(2)}`,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Ventas Semana",
      value: weekSales.length.toString(),
      subtitle: `$${weekRevenue.toFixed(2)}`,
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Total Productos",
      value: totalProducts.toString(),
      subtitle: `${products.filter(p => p.stock > 0).length} en stock`,
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Alertas Stock",
      value: lowStockCount.toString(),
      subtitle: `${criticalStock.length} críticos`,
      icon: AlertTriangle,
      color: lowStockCount > 0 ? "text-red-600" : "text-gray-600",
      bg: lowStockCount > 0 ? "bg-red-100" : "bg-gray-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header con información del usuario */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bienvenido al Sistema POS</h2>
                <p className="text-blue-100 capitalize">
                  Rol: {userRole} • {today.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Ingresos del Mes</p>
              <p className="text-3xl font-bold">${monthRevenue.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Más Vendidos Mejorado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top 5 Productos Más Vendidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)} • Stock: {product.stock}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.salesCount} ventas realizadas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      {product.soldQuantity}
                    </p>
                    <p className="text-sm text-muted-foreground">unidades</p>
                    <p className="text-sm font-medium text-green-600">
                      ${product.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay datos de ventas aún</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Ventas Mejorado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Resumen de Ventas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{sales.length}</p>
                <p className="text-sm text-muted-foreground">Total Ventas</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Promedio por Venta:</span>
                <span className="font-bold">${averageSaleValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Ventas Hoy:</span>
                <span className="font-bold text-blue-600">{todaySales.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Ventas esta Semana:</span>
                <span className="font-bold text-green-600">{weekSales.length}</span>
              </div>
            </div>

            {todaySales.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Métodos de Pago Hoy:</h4>
                <div className="space-y-2">
                  {['cash', 'card', 'digital'].map(method => {
                    const count = todaySales.filter(sale => sale.paymentMethod === method).length;
                    const percentage = count > 0 ? (count / todaySales.length) * 100 : 0;
                    const labels = { cash: 'Efectivo', card: 'Tarjeta', digital: 'Digital' };
                    
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <span className="text-sm">{labels[method as keyof typeof labels]}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Stock Mejoradas */}
      {lowStockCount > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Bajo */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                <span>Productos con Stock Bajo (≤10)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getLowStockAlerts().map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-orange-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">{product.stock}</p>
                      <p className="text-xs text-muted-foreground">unidades</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Crítico */}
          {criticalStock.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Stock Crítico (≤5)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {criticalStock.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-white border border-red-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{product.stock}</p>
                        <p className="text-xs text-muted-foreground">¡Urgente!</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
