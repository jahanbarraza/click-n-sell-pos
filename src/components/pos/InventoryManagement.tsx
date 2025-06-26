
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { usePOS } from '@/contexts/POSContext';
import { Package, Filter, RefreshCw, Download, AlertTriangle, Search } from 'lucide-react';

export const InventoryManagement = () => {
  const { products } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedStore, setSelectedStore] = useState('todas');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [onlyOutOfStock, setOnlyOutOfStock] = useState(false);

  // Mock data similar to the image
  const mockInventoryData = [
    { codigo: 'PROD229', nombre: 'Huawei 400', categoria: 'Carcasas', subcategoria: 'Carcasa Mujer', precioBase: 25600, stock: 148, estado: 'Stock Alto', valorTotal: 3788800 },
    { codigo: 'PROD434', nombre: 'Mate XT ULTIMATE DESIGN', categoria: 'Huawei', subcategoria: 'Mate XT ULTIMATE DESIGN', precioBase: 15600, stock: 99, estado: 'Stock Alto', valorTotal: 1544400 },
    { codigo: 'PROD947', nombre: 'Motorola AX', categoria: 'Carcasas', subcategoria: 'Carcasa Mujer', precioBase: 43500, stock: 162999, estado: 'Stock Alto', valorTotal: 17090456 },
    { codigo: 'PROD666', nombre: 'Motorola AX100', categoria: 'Huawei', subcategoria: 'Mate XT ULTIMATE DESIGN', precioBase: 43000, stock: 85, estado: 'Stock Alto', valorTotal: 3655000 },
    { codigo: 'PROD805', nombre: 'Redmi 13C', categoria: 'Carcasas', subcategoria: 'Carcasa Mujer', precioBase: 11200, stock: 45, estado: 'Stock Normal', valorTotal: 504000 }
  ];

  const totalProducts = mockInventoryData.length;
  const outOfStock = 0;
  const lowStock = 0;
  const totalStock = mockInventoryData.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = mockInventoryData.reduce((sum, item) => sum + item.valorTotal, 0);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sin Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 20) return { label: 'Bajo Stock', color: 'bg-orange-100 text-orange-800' };
    if (stock < 50) return { label: 'Stock Normal', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Stock Alto', color: 'bg-blue-100 text-blue-800' };
  };

  const updateInventory = () => {
    console.log('Actualizando inventario...');
  };

  const exportInventory = () => {
    console.log('Exportando inventario...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
            <p className="text-gray-600">Administra entradas y salidas de productos</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={updateInventory} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </Button>
          <Button onClick={exportInventory} className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Producto</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Nombre, código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  <SelectItem value="carcasas">Carcasas</SelectItem>
                  <SelectItem value="huawei">Huawei</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tienda</label>
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tienda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las tiendas</SelectItem>
                  <SelectItem value="principal">Tienda Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="low-stock" 
                checked={onlyLowStock}
                onCheckedChange={setOnlyLowStock}
              />
              <label htmlFor="low-stock" className="text-sm font-medium">Solo sin stock</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="out-stock" 
                checked={onlyOutOfStock}
                onCheckedChange={setOnlyOutOfStock}
              />
              <label htmlFor="out-stock" className="text-sm font-medium">Solo bajo stock</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Bajo Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Total</p>
                <p className="text-2xl font-bold">{totalStock.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Inventario</p>
                <p className="text-2xl font-bold">{formatPrice(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Inventario Detallado */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategoría</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Base</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockInventoryData.map((item) => {
                  const stockStatus = getStockStatus(item.stock);
                  return (
                    <tr key={item.codigo} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.codigo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.categoria}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.subcategoria}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(item.precioBase)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.stock.toLocaleString()} UND</td>
                      <td className="px-4 py-3">
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(item.valorTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
