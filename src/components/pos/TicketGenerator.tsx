
import React from 'react';
import { Sale } from '@/types/pos';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface TicketGeneratorProps {
  sale: Sale;
  onPrint?: () => void;
}

export const TicketGenerator: React.FC<TicketGeneratorProps> = ({ sale, onPrint }) => {
  const generateTicketContent = () => {
    return `
============================
       SISTEMA POS
============================
Ticket #${sale.id}
Fecha: ${sale.timestamp.toLocaleDateString()}
Hora: ${sale.timestamp.toLocaleTimeString()}
${sale.customerName ? `Cliente: ${sale.customerName}` : 'Cliente General'}

----------------------------
PRODUCTOS:
----------------------------
${sale.items.map(item => 
  `${item.product.name}
Cant: ${item.quantity} x $${item.product.price.toLocaleString()}
Subtotal: $${(item.product.price * item.quantity).toLocaleString()}`
).join('\n\n')}

----------------------------
TOTALES:
----------------------------
Subtotal: $${sale.subtotal.toLocaleString()}
Impuestos (10%): $${sale.tax.toLocaleString()}
TOTAL: $${sale.total.toLocaleString()}

Método de pago: ${getPaymentMethodLabel(sale.paymentMethod)}

============================
¡Gracias por su compra!
Vuelva pronto
============================
    `;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      cash: 'Efectivo',
      card: 'Tarjeta Débito',
      digital: 'Pago Digital'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const handlePrint = () => {
    const ticketContent = generateTicketContent();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ticket #${sale.id}</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
                margin: 0;
                padding: 20px;
                white-space: pre-line;
              }
              @media print {
                body { margin: 0; padding: 10px; }
              }
            </style>
          </head>
          <body>
            ${ticketContent.replace(/\n/g, '<br>')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }

    if (onPrint) {
      onPrint();
    }
  };

  const handleDownload = () => {
    const ticketContent = generateTicketContent();
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${sale.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={handlePrint} size="sm" className="flex items-center space-x-1">
        <Printer className="h-4 w-4" />
        <span>Imprimir</span>
      </Button>
      <Button onClick={handleDownload} variant="outline" size="sm">
        Descargar
      </Button>
    </div>
  );
};
