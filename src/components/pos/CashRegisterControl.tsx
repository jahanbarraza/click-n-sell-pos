
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
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {cashRegisterOpen ? (
              <Unlock className="h-5 w-5 text-green-600" />
            ) : (
              <Lock className="h-5 w-5 text-red-600" />
            )}
            <span>Estado de Caja</span>
          </div>
          <Badge variant={cashRegisterOpen ? "default" : "destructive"}>
            {cashRegisterOpen ? "Caja Abierta" : "Caja Cerrada"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!cashRegisterOpen ? (
          <div className="space-y-4">
            {!showOpenForm ? (
              <Button 
                onClick={() => setShowOpenForm(true)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Abrir Caja
              </Button>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="initialAmount" className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
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
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleOpenCash} className="flex-1 bg-green-600 hover:bg-green-700">
                    Confirmar Apertura
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowOpenForm(false)}
                    className="flex-1"
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
            className="w-full"
          >
            <Lock className="h-4 w-4 mr-2" />
            Cerrar Caja
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
