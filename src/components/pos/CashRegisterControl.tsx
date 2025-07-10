
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { usePOS } from '@/contexts/POSContext';
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock, DollarSign } from 'lucide-react';

export const CashRegisterControl = () => {
  const { cashRegisterOpen, openCashRegister, closeCashRegister } = usePOS();
  const { toast } = useToast();
  const [initialAmount, setInitialAmount] = useState<number>(0);
  const [showOpenForm, setShowOpenForm] = useState(false);

  const handleOpenCash = () => {
    openCashRegister(initialAmount);
    setShowOpenForm(false);
    setInitialAmount(0);
    toast({
      title: "Caja abierta",
      description: `Caja abierta con $${initialAmount.toFixed(2)} iniciales`,
    });
  };

  const handleCloseCash = () => {
    closeCashRegister();
    toast({
      title: "Caja cerrada",
      description: "La caja ha sido cerrada exitosamente",
    });
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {cashRegisterOpen ? (
              <Unlock className="h-4 w-4 text-green-600" />
            ) : (
              <Lock className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm font-medium">Estado de Caja</span>
          </div>
          <Badge 
            variant={cashRegisterOpen ? "default" : "destructive"}
            className="text-xs px-2 py-1"
          >
            {cashRegisterOpen ? "Abierta" : "Cerrada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {!cashRegisterOpen ? (
          <div className="space-y-3">
            {!showOpenForm ? (
              <Button 
                onClick={() => setShowOpenForm(true)}
                className="w-full h-9 bg-green-600 hover:bg-green-700 text-sm"
              >
                <Unlock className="h-3 w-3 mr-1" />
                Abrir Caja
              </Button>
            ) : (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="initialAmount" className="flex items-center space-x-1 text-xs">
                    <DollarSign className="h-3 w-3" />
                    <span>Monto Inicial</span>
                  </Label>
                  <Input
                    id="initialAmount"
                    type="number"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(Number(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex space-x-1">
                  <Button 
                    onClick={handleOpenCash} 
                    className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-xs"
                  >
                    Confirmar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowOpenForm(false)}
                    className="flex-1 h-8 text-xs"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button 
            onClick={handleCloseCash}
            variant="destructive"
            className="w-full h-9 text-sm"
          >
            <Lock className="h-3 w-3 mr-1" />
            Cerrar Caja
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
