
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { usePOS } from '@/contexts/POSContext';
import { Search, Plus } from 'lucide-react';

export const ProductGrid = () => {
  const { products, addToCart } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Search and Categories */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar productos o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
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

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => addToCart(product)}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">
                  {product.name.charAt(0)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
                  <Badge variant={product.stock > 10 ? 'secondary' : 'destructive'} className="text-xs">
                    {product.stock}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};
