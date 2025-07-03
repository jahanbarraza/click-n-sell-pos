
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePOS } from '@/contexts/POSContext';
import { Search, Plus, Package, Filter } from 'lucide-react';

export const ProductGrid = () => {
  const { products, addToCart, cashRegisterOpen } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  console.log('ProductGrid - Products:', products);
  console.log('ProductGrid - Products length:', products.length);
  console.log('ProductGrid - Cash register open:', cashRegisterOpen);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  console.log('ProductGrid - Filtered products:', filteredProducts);

  const getStockBadgeColor = (stock: number) => {
    if (stock <= 0) return 'bg-red-500 text-white';
    if (stock <= 10) return 'bg-orange-500 text-white';
    return 'bg-green-500 text-white';
  };

  const handleAddToCart = (product: any) => {
    if (!cashRegisterOpen) {
      console.log('Cannot add to cart - cash register closed');
      return;
    }
    console.log('Adding product to cart:', product);
    addToCart(product);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Productos Disponibles</span>
          <Badge variant="secondary">{products.length}</Badge>
        </CardTitle>
        
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.filter(cat => cat !== 'all').map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {!cashRegisterOpen && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-center font-medium">
              La caja está cerrada. Abra la caja para comenzar a vender.
            </p>
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              Debug: {products.length} productos cargados, {filteredProducts.length} mostrados
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className={`hover:shadow-md transition-shadow border border-gray-200 ${
                  !cashRegisterOpen ? 'opacity-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Product Name and Stock */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.id}</p>
                        <p className="text-xs text-gray-400">{product.category}</p>
                      </div>
                      <Badge 
                        className={`ml-2 ${getStockBadgeColor(product.stock)}`}
                      >
                        Stock: {product.stock}
                      </Badge>
                    </div>
                    
                    {/* Price and Add Button */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl text-green-600">
                        ${product.price.toLocaleString()}
                      </span>
                      <Button 
                        size="sm" 
                        className="h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0 || !cashRegisterOpen}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-muted-foreground">
                {products.length === 0 ? 'No hay productos disponibles' : 'No se encontraron productos'}
              </p>
              {products.length === 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-400">
                    Los productos aparecerán aquí cuando se agreguen al sistema
                  </p>
                  <p className="text-xs text-gray-400">
                    Debug: Productos en contexto: {products.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
