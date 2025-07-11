
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePOS } from '@/contexts/POSContext';
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash, ShoppingCart, User, CreditCard, Receipt } from 'lucide-react';
import { TicketGenerator } from './TicketGenerator';

export const Cart = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    completeSale,
    clearCart,
    cashRegisterOpen
  } = usePOS();
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [manualDiscount, setManualDiscount] = useState(0);
  const [observations, setObservations] = useState('');
  const [lastSale, setLastSale] = useState(null);

  const { subtotal, tax, total } = getCartTotal();
  const discountAmount = manualDiscount;
  const finalTotal = Math.max(0, total - discountAmount);

  const handleCompleteSale = () => {
    if (!cashRegisterOpen) {
      toast({
        title: "Caja cerrada",
        description: "Debe abrir la caja antes de procesar ventas",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito para completar la venta",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Método de pago requerido",
        description: "Selecciona un método de pago para continuar",
        variant: "destructive"
      });
      return;
    }

    const sale = completeSale(paymentMethod as any, selectedCustomer || undefined);
    setLastSale(sale);
    setSelectedCustomer('');
    setPaymentMethod('');
    setManualDiscount(0);
    setObservations('');
    
    toast({
      title: "Venta completada",
      description: `Venta #${sale.id} por $${finalTotal.toLocaleString()} registrada exitosamente`
    });
  };

  const isDisabled = !cashRegisterOpen;

  return (
    <Card className="h-full rounded-tr-3xl rounded-tl-3xl py-[5px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Carrito de Compras</span>
          </div>
          {cart.length > 0 && (
            <Badge variant="secondary">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 px-[10px] my-[10px] py-[10px] rounded-md mx-[10px]">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Carrito vacío</p>
            {isDisabled && (
              <p className="text-red-500 text-sm mt-2">Abra la caja para comenzar</p>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.product.price.toLocaleString()} c/u
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0" 
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    disabled={isDisabled}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0" 
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} 
                    disabled={item.quantity >= item.product.stock || isDisabled}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                    onClick={() => removeFromCart(item.product.id)}
                    disabled={isDisabled}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="text-right">
                  <p className="font-bold">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customer Selection */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Cliente (Opcional)</span>
          </Label>
          <Select 
            value={selectedCustomer} 
            onValueChange={setSelectedCustomer}
            disabled={isDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cliente1">Cliente General</SelectItem>
              <SelectItem value="cliente2">Juan Pérez</SelectItem>
              <SelectItem value="cliente3">María García</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Método de Pago *</span>
          </Label>
          <Select 
            value={paymentMethod} 
            onValueChange={setPaymentMethod}
            disabled={isDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="card">Tarjeta Débito</SelectItem>
              <SelectItem value="digital">Pago Digital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Manual Discount */}
        <div className="space-y-2">
          <Label>Descuento Manual</Label>
          <Input 
            type="number" 
            value={manualDiscount} 
            onChange={(e) => setManualDiscount(Number(e.target.value) || 0)} 
            placeholder="0" 
            min="0" 
            max={total}
            disabled={isDisabled}
          />
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <Label>Observaciones</Label>
          <Textarea 
            value={observations} 
            onChange={(e) => setObservations(e.target.value)} 
            placeholder="Observaciones adicionales..." 
            rows={3}
            disabled={isDisabled}
          />
        </div>

        {/* Totals */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Impuestos:</span>
            <span>${tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Descuento:</span>
            <span>-${discountAmount.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-xl">
            <span>Total:</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Process Sale Button */}
        <Button 
          onClick={handleCompleteSale} 
          className="w-full h-12 bg-blue-500 hover:bg-blue-600" 
          disabled={cart.length === 0 || !paymentMethod || isDisabled}
        >
          <Receipt className="h-4 w-4 mr-2" />
          {isDisabled ? "Caja Cerrada" : "Procesar Venta"}
        </Button>

        {/* Clear Cart Button */}
        <Button 
          variant="outline" 
          onClick={clearCart} 
          className="w-full"
          disabled={isDisabled}
        >
          Limpiar Carrito
        </Button>

        {/* Last Sale Ticket */}
        {lastSale && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Venta Completada</h4>
            <p className="text-sm text-green-700 mb-3">
              Ticket #{lastSale.id} - ${lastSale.total.toLocaleString()}
            </p>
            <TicketGenerator sale={lastSale} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
