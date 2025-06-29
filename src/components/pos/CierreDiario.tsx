
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePOS } from '@/contexts/POSContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  FileText,
  Download,
  Printer,
  CheckCircle
} from 'lucide-react';

export const CierreDiario = () => {
  const { sales } = usePOS();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isClosed, setIsClosed] = useState(false);

  // Filtrar ventas por fecha seleccionada
  const selectedDateSales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    const selected = new Date(selectedDate);
    return saleDate.toDateString() === selected.toDateString();
  });

  // Calcular métricas del día
  const totalSales = selectedDateSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = selectedDateSales.length;
  const totalItems = selectedDateSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  // Calcular por método de pago
  const paymentMethods = selectedDateSales.reduce((acc, sale) => {
    const method = sale.paymentMethod;
    acc[method] = (acc[method] || 0) + sale.total;
    return acc;
  }, {} as Record<string, number>);

  const cashSales = paymentMethods.cash || 0;
  const cardSales = paymentMethods.card || 0;
  const digitalSales = paymentMethods.digital || 0;

  // Productos más vendidos del día
  const topProducts = selectedDateSales
    .flatMap(sale => sale.items)
    .reduce((acc, item) => {
      const productId = item.product.id;
      if (!acc[productId]) {
        acc[productId] = {
          name: item.product.name,
          quantity: 0,
          total: 0
        };
      }
      acc[productId].quantity += item.quantity;
      acc[productId].total += item.quantity * item.price;
      return acc;
    }, {} as Record<string, { name: string; quantity: number; total: number }>);

  const topProductsList = Object.values(topProducts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const handleCloseDiary = () => {
    setIsClosed(true);
    // Aquí se implementaría la lógica para cerrar el día
    console.log('Cierre diario realizado para la fecha:', selectedDate);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Lógica para exportar el reporte
    console.log('Exportando reporte del día:', selectedDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>Cierre Diario</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Resumen de ventas y cierre del día
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estado del cierre */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isClosed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <div>
                <h3 className="font-semibold">Estado del Día</h3>
                <p className="text-sm text-gray-600">
                  {new Date(selectedDate).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isClosed ? "default" : "secondary"}>
                {isClosed ? 'Cerrado' : 'Abierto'}
              </Badge>
              {!isClosed && (
                <Button onClick={handleCloseDiary} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Cerrar Día
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900">$ {totalSales.toLocaleString()}</p>
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
                <p className="text-sm font-medium text-gray-600">Transacciones</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
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
                <p className="text-sm font-medium text-gray-600">Items Vendidos</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
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
                  $ {totalTransactions > 0 ? (totalSales / totalTransactions).toLocaleString() : '0'}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles por método de pago */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Método de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Banknote className="h-5 w-5 text-green-600" />
                <span className="font-medium">Efectivo</span>
              </div>
              <span className="font-bold">$ {cashSales.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Tarjeta Débito</span>
              </div>
              <span className="font-bold">$ {cardSales.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Digital</span>
              </div>
              <span className="font-bold">$ {digitalSales.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProductsList.length > 0 ? topProductsList.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-blue-600">{index + 1}.</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{product.quantity} unidades</p>
                    <p className="text-sm text-gray-600">$ {product.total.toLocaleString()}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-4">No hay ventas registradas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del usuario y tienda */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Cierre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Usuario</p>
              <p className="font-bold">{user?.name?.toUpperCase() || 'USUARIO'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tienda</p>
              <p className="font-bold">StampOut POS</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Cierre</p>
              <p className="font-bold">
                {isClosed ? new Date().toLocaleString('es-ES') : 'Pendiente'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
