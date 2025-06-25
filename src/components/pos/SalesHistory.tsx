
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePOS } from '@/contexts/POSContext';
import { useToast } from "@/hooks/use-toast";
import { Clock, FileText, CreditCard, User } from 'lucide-react';
import { Sale } from '@/types/pos';

export const SalesHistory = () => {
  const { sales } = usePOS();
  const { toast } = useToast();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const generateReceipt = (sale: Sale) => {
    const receiptContent = `
SISTEMA POS
============================
Recibo #${sale.id}
Fecha: ${sale.timestamp.toLocaleDateString()} ${sale.timestamp.toLocaleTimeString()}
${sale.customerName ? `Cliente: ${sale.customerName}` : ''}

----------------------------
PRODUCTOS:
${sale.items.map(item => 
  `${item.product.name} x${item.quantity}
   $${item.product.price.toFixed(2)} c/u = $${(item.product.price * item.quantity).toFixed(2)}`
).join('\n')}

----------------------------
Subtotal: $${sale.subtotal.toFixed(2)}
Impuestos: $${sale.tax.toFixed(2)}
TOTAL: $${sale.total.toFixed(2)}

Método de pago: ${sale.paymentMethod.toUpperCase()}
============================
¡Gracias por su compra!
    `;

    // Create and download receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${sale.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Recibo generado",
      description: `Recibo #${sale.id} descargado exitosamente`,
    });
  };

  const paymentMethodColors = {
    cash: 'bg-green-100 text-green-800',
    card: 'bg-blue-100 text-blue-800',
    digital: 'bg-purple-100 text-purple-800'
  };

  const paymentMethodLabels = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    digital: 'Digital'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Historial de Ventas</span>
            <Badge variant="secondary">{sales.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay ventas registradas</p>
                <p className="text-sm">Las ventas aparecerán aquí</p>
              </div>
            ) : (
              sales.map(sale => (
                <div
                  key={sale.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSale?.id === sale.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSale(sale)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg text-green-600">
                      ${sale.total.toFixed(2)}
                    </span>
                    <Badge className={paymentMethodColors[sale.paymentMethod]}>
                      {paymentMethodLabels[sale.paymentMethod]}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>#{sale.id}</span>
                    <span>{sale.timestamp.toLocaleString()}</span>
                  </div>
                  
                  {sale.customerName && (
                    <div className="flex items-center mt-2 text-sm">
                      <User className="h-3 w-3 mr-1" />
                      <span>{sale.customerName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <span>{sale.items.length} producto{sale.items.length !== 1 ? 's' : ''}</span>
                    <span className="mx-2">•</span>
                    <span>{sale.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sale Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Detalle de Venta</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSale ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl">Venta #{selectedSale.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedSale.timestamp.toLocaleDateString()} a las {selectedSale.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  onClick={() => generateReceipt(selectedSale)}
                  variant="outline"
                  size="sm"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Recibo
                </Button>
              </div>

              {selectedSale.customerName && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{selectedSale.customerName}</span>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Productos:</h4>
                {selectedSale.items.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${selectedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span>${selectedSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">${selectedSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span>Método de pago:</span>
                <Badge className={paymentMethodColors[selectedSale.paymentMethod]}>
                  <CreditCard className="h-3 w-3 mr-1" />
                  {paymentMethodLabels[selectedSale.paymentMethod]}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Selecciona una venta para ver los detalles</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
