
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePOS } from '@/contexts/POSContext';
import { 
  FileText, 
  DollarSign, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react';

export const Dashboard = () => {
  const { sales, products, getLowStockAlerts } = usePOS();

  const today = new Date();
  const todaySales = sales.filter(sale => 
    sale.timestamp.toDateString() === today.toDateString()
  );

  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = products.length;
  const lowStockCount = getLowStockAlerts().length;
  const averageSaleValue = sales.length > 0 ? totalRevenue / sales.length : 0;

  const topProducts = products
    .map(product => ({
      ...product,
      soldQuantity: sales.reduce((sum, sale) => 
        sum + (sale.items.find(item => item.product.id === product.id)?.quantity || 0), 0
      )
    }))
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, 5);

  const stats = [
    {
      title: "Ventas Hoy",
      value: todaySales.length.toString(),
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Ingresos Hoy",
      value: `$${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Total Productos",
      value: totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Stock Bajo",
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100"
    }
  ];

  return (
    <div className="space-y-6">
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
        {/* Sales Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Resumen de Ventas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total de Ventas:</span>
                <span className="font-bold">{sales.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ingresos Totales:</span>
                <span className="font-bold text-green-600">${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Promedio por Venta:</span>
                <span className="font-bold">${averageSaleValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Ventas de Hoy:</span>
                <span className="font-bold text-blue-600">{todaySales.length}</span>
              </div>
            </div>

            {todaySales.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Métodos de Pago Hoy:</h4>
                <div className="space-y-2">
                  {['cash', 'card', 'digital'].map(method => {
                    const count = todaySales.filter(sale => sale.paymentMethod === method).length;
                    const percentage = count > 0 ? (count / todaySales.length) * 100 : 0;
                    const labels = { cash: 'Efectivo', card: 'Tarjeta', digital: 'Digital' };
                    
                    return (
                      <div key={method} className="flex items-center justify-between">
                        <span className="text-sm">{labels[method as keyof typeof labels]}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Productos Más Vendidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)} • Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {product.soldQuantity} vendidos
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(product.price * product.soldQuantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay datos de ventas aún</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertas de Stock Bajo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getLowStockAlerts().map(product => (
                <div key={product.id} className="p-3 bg-white border border-orange-200 rounded-lg">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-orange-600">
                    Stock actual: {product.stock} unidades
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Categoría: {product.category}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
