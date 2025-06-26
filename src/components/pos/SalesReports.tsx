
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/contexts/POSContext';
import { FileText, Filter, Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesReports = () => {
  const { sales } = usePOS();
  const [startDate, setStartDate] = useState('2025-06-27');
  const [endDate, setEndDate] = useState('2025-06-26');
  const [selectedVendor, setSelectedVendor] = useState('todos');
  const [selectedStore, setSelectedStore] = useState('todas');
  const [selectedCompany, setSelectedCompany] = useState('todas');

  // Mock data similar to the image
  const mockSalesData = [
    { id: 'FAC-000004', fecha: '25/6/2025', vendedor: 'IVAN JESUS', cliente: 'ASHLEE', tienda: 'Call Store 2', subtotal: 31200, impuestos: 5928, descuentos: 0, total: 37128, estado: 'completada' },
    { id: 'FAC-000005', fecha: '24/6/2025', vendedor: 'IVAN JESUS', cliente: 'ASHLEE', tienda: 'Call Store 2', subtotal: 25800, impuestos: 4864, descuentos: 0, total: 30464, estado: 'completada' },
    { id: 'FAC-000003', fecha: '23/6/2025', vendedor: 'IVAN JESUS', cliente: 'ASHLEE', tienda: 'Call Store 2', subtotal: 43500, impuestos: 8265, descuentos: 20000, total: 31765, estado: 'completada' },
    { id: 'FAC-000002', fecha: '23/6/2025', vendedor: 'IVAN JESUS', cliente: 'ASHLEE', tienda: 'Call Store 2', subtotal: 25800, impuestos: 4864, descuentos: 0, total: 30464, estado: 'completada' },
    { id: 'FAC-000001', fecha: '23/6/2025', vendedor: 'IVAN JESUS', cliente: 'CONSUMIDOR', tienda: 'Call Store 2', subtotal: 138900, impuestos: 25101, descuentos: 0, total: 164001, estado: 'completada' }
  ];

  const chartData = [
    { date: '2025-06-25', value: 33822 },
    { date: '2025-06-24', value: 34822 }
  ];

  const totalSales = mockSalesData.length;
  const totalIncome = mockSalesData.reduce((sum, sale) => sum + sale.total, 0);
  const averagePerSale = totalIncome / totalSales;
  const uniqueClients = new Set(mockSalesData.map(sale => sale.cliente)).size;

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  const exportReport = () => {
    console.log('Exportando reporte...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes de Ventas</h1>
            <p className="text-gray-600">Análisis detallado de las ventas del sistema</p>
          </div>
        </div>
        <Button onClick={exportReport} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4" />
          <span>Exportar Reporte</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros de Búsqueda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los vendedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los vendedores</SelectItem>
                  <SelectItem value="ivan">IVAN JESUS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tienda</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las tiendas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las tiendas</SelectItem>
                  <SelectItem value="call-store-2">Call Store 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compañía</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las compañías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las compañías</SelectItem>
                  <SelectItem value="main">Compañía Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Ventas</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Ingresos</p>
                <p className="text-2xl font-bold">{formatPrice(totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Promedio por Venta</p>
                <p className="text-2xl font-bold">{formatPrice(averagePerSale)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Clientes Únicos</p>
                <p className="text-2xl font-bold">{uniqueClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Ventas por Día */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas por Día</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [formatPrice(value as number), 'Ventas']} />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Ventas Detalladas */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas Detalladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tienda</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impuestos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuentos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockSalesData.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{sale.fecha}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{sale.vendedor}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{sale.cliente}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{sale.tienda}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(sale.subtotal)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(sale.impuestos)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(sale.descuentos)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(sale.total)}</td>
                    <td className="px-4 py-3">
                      <Badge className="bg-blue-100 text-blue-800">
                        {sale.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
