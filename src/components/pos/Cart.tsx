
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/contexts/POSContext';
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash, CreditCard } from 'lucide-react';

export const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, completeSale, clearCart } = usePOS();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('card');
  
  const { subtotal, tax, total } = getCartTotal();

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito para completar la venta",
        variant: "destructive"
      });
      return;
    }

    const sale = completeSale(paymentMethod, customerName || undefined);
    setCustomerName('');
    
    toast({
      title: "Venta completada",
      description: `Venta #${sale.id} por $${sale.total.toFixed(2)} registrada exitosamente`,
    });
  };

  if (cart.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Carrito</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <p>El carrito está vacío</p>
            <p className="text-sm">Selecciona productos para agregar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Carrito</span>
          </div>
          <Badge variant="secondary">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Cart Items */}
        <div className="flex-1 space-y-3 max-h-64 overflow-y-auto">
          {cart.map(item => (
            <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ${item.product.price.toFixed(2)} c/u
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="text-right">
                <p className="font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          <Label htmlFor="customer-name">Cliente (opcional)</Label>
          <Input
            id="customer-name"
            placeholder="Nombre del cliente"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Método de pago</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'card', label: 'Tarjeta' },
              { value: 'cash', label: 'Efectivo' },
              { value: 'digital', label: 'Digital' }
            ].map(method => (
              <Button
                key={method.value}
                variant={paymentMethod === method.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod(method.value as any)}
              >
                {method.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button 
            onClick={handleCompleteSale}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            Completar Venta - ${total.toFixed(2)}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="w-full"
          >
            Limpiar Carrito
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
