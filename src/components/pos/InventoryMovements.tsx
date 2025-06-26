
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Filter, Plus, Download } from 'lucide-react';

export const InventoryMovements = () => {
  const [selectedStore, setSelectedStore] = useState('todas');
  const [movementType, setMovementType] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock data similar to the image
  const mockMovements = [
    { fecha: '25/6/2025, 12:46:55 a. m.', tipo: 'Venta', producto: 'Mate XT ULTIMATE DESIGN', codigo: 'PROD434', tienda: 'Calle 30', cantidad: -2, saldoAnt: 100, saldoNuevo: 98, costoUnit: 0, documento: 'FAC-000002', usuario: 'admin' },
    { fecha: '25/6/2025, 12:46:16 a. m.', tipo: 'Entrada', producto: 'Mate XT ULTIMATE DESIGN', codigo: 'PROD434', tienda: 'Calle 30', cantidad: 100, saldoAnt: 0, saldoNuevo: 100, costoUnit: 235, documento: 'ET0005-2', usuario: 'admin' },
    { fecha: '24/6/2025, 12:57:52 p. m.', tipo: 'Venta', producto: 'Huawei 400', codigo: 'PROD229', tienda: 'Calle 30', cantidad: -1, saldoAnt: 0, saldoNuevo: -0.999, costoUnit: 0, documento: 'FAC-000001', usuario: 'admin' },
    { fecha: '24/6/2025, 11:59:20 a. m.', tipo: 'Salida', producto: 'Motorola AX', codigo: 'PROD947', tienda: 'Call Store 2', cantidad: -0.001, saldoAnt: 163, saldoNuevo: 162.999, costoUnit: 40, documento: 'R00254', usuario: 'admin' },
    { fecha: '24/6/2025, 11:58:20 a. m.', tipo: 'Entrada', producto: 'Huawei 400', codigo: 'PROD229', tienda: 'Calle 30', cantidad: 0.001, saldoAnt: 0, saldoNuevo: 0.001, costoUnit: 315.000, documento: 'R00254', usuario: 'admin' },
    { fecha: '23/6/2025, 8:40:35 p. m.', tipo: 'Venta', producto: 'Motorola AX', codigo: 'PROD947', tienda: 'Call Store 2', cantidad: -1, saldoAnt: 164, saldoNuevo: 163, costoUnit: 0, documento: 'FAC-000003', usuario: 'admin' },
    { fecha: '23/6/2025, 8:04:46 p. m.', tipo: 'Venta', producto: 'Huawei 400', codigo: 'PROD229', tienda: 'Call Store 2', cantidad: -1, saldoAnt: 149, saldoNuevo: 148, costoUnit: 0, documento: 'FAC-000002', usuario: 'admin' },
    { fecha: '23/6/2025, 7:56:36 p. m.', tipo: 'Venta', producto: 'Motorola AX100', codigo: 'PROD666', tienda: 'Call Store 2', cantidad: -1, saldoAnt: 87, saldoNuevo: 86, costoUnit: 0, documento: 'FAC-000001', usuario: 'admin' },
    { fecha: '23/6/2025, 7:56:36 p. m.', tipo: 'Venta', producto: 'Redmi 13C', codigo: 'PROD805', tienda: 'Call Store 2', cantidad: -1, saldoAnt: 46, saldoNuevo: 45, costoUnit: 0, documento: 'FAC-000001', usuario: 'admin' },
    { fecha: '23/6/2025, 7:56:36 p. m.', tipo: 'Venta', producto: 'Motorola AX', codigo: 'PROD947', tienda: 'Call Store 2', cantidad: -1, saldoAnt: 165, saldoNuevo: 164, costoUnit: 0, documento: 'FAC-000001', usuario: 'admin' }
  ];

  const getMovementTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'Entrada':
        return 'bg-teal-100 text-teal-800';
      case 'Venta':
        return 'bg-red-100 text-red-800';
      case 'Salida':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 3 });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  const addNewMovement = () => {
    console.log('Añadir nuevo movimiento...');
  };

  const exportMovements = () => {
    console.log('Exportando movimientos...');
  };

  const clearFilters = () => {
    setSelectedStore('todas');
    setMovementType('todos');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
            <p className="text-gray-600">Administra entradas y salidas de productos</p>
          </div>
        </div>
        <Button onClick={addNewMovement} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4" />
          <span>Nuevo Movimiento</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tienda</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las tiendas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las tiendas</SelectItem>
                  <SelectItem value="calle-30">Calle 30</SelectItem>
                  <SelectItem value="call-store-2">Call Store 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento</label>
              <Select value={movementType} onValueChange={setMovementType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <Input
                type="date"
                placeholder="dd/mm/aaaa"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <Input
                type="date"
                placeholder="dd/mm/aaaa"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={clearFilters} variant="outline">
              Limpiar
            </Button>
            <Button onClick={exportMovements} variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Historial de Movimientos */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tienda</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo Ant.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo Nuevo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo Unit.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockMovements.map((movement, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{movement.fecha}</td>
                    <td className="px-4 py-3">
                      <Badge className={getMovementTypeColor(movement.tipo)}>
                        {movement.tipo}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{movement.producto}</div>
                        <div className="text-sm text-gray-500">{movement.codigo}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{movement.tienda}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${movement.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatNumber(movement.cantidad)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(movement.saldoAnt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatNumber(movement.saldoNuevo)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {movement.costoUnit > 0 ? formatPrice(movement.costoUnit) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{movement.documento}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{movement.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-700">Mostrando 1 a 10 de 17 movimientos</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Anterior</Button>
              <Button variant="outline" size="sm">Siguiente</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
