import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/contexts/POSContext';
import { useToast } from "@/hooks/use-toast";
import { Package, AlertTriangle, Search, Plus, Minus } from 'lucide-react';

export const InventoryView = () => {
  const { products, updateProduct, getLowStockAlerts } = usePOS();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const lowStockProducts = getLowStockAlerts();

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const updateStock = (productId: string, change: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = Math.max(0, product.stock + change);
    const updatedProduct = { ...product, stock: newStock };
    updateProduct(updatedProduct);

    toast({
      title: "Stock actualizado",
      description: `${product.name}: ${product.stock} → ${newStock} unidades`,
    });
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold">{totalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold text-red-600">{lowStockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Productos con Stock Bajo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="p-3 bg-white border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{product.name}</h4>
                    <Badge variant="destructive">{product.stock}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    ${product.price.toFixed(2)} • {product.category}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(product.id, -1)}
                      disabled={product.stock <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateStock(product.id, 10)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      10
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar productos o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category === 'all' ? 'Todos' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-400">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category} • ${product.price.toFixed(2)}
                      </p>
                      {product.barcode && (
                        <p className="text-xs text-muted-foreground">
                          Código: {product.barcode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="font-bold text-lg">{product.stock}</p>
                    <p className="text-xs text-muted-foreground">unidades</p>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-lg text-green-600">
                      ${(product.price * product.stock).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">valor total</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(product.id, -1)}
                      disabled={product.stock <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStock(product.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => updateStock(product.id, 10)}
                    >
                      +10
                    </Button>
                  </div>

                  <Badge 
                    variant={product.stock > 10 ? 'secondary' : product.stock > 0 ? 'default' : 'destructive'}
                  >
                    {product.stock > 10 ? 'OK' : product.stock > 0 ? 'Bajo' : 'Agotado'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron productos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
