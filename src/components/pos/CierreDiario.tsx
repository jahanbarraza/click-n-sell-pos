
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePOS } from '@/contexts/POSContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  Users,
  Building2
} from 'lucide-react';

export const CierreDiario = () => {
  const { sales } = usePOS();
  const { user } = useAuth();
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isManualClose, setIsManualClose] = useState(false);

  // Filtrar ventas por fecha seleccionada
  const selectedDateSales = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    const selected = new Date(selectedDate);
    return saleDate.toDateString() === selected.toDateString();
  });

  const hasDailyClose = selectedDateSales.length > 0;

  const handleManualClose = () => {
    setIsManualClose(true);
    console.log('Generando cierre manual para la fecha:', selectedDate);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cierre Diario</h1>
          <p className="text-gray-600 mt-1">
            Resumen general de ventas del día de {new Date(selectedDate).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{user?.name?.toUpperCase() || 'USUARIO'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building2 className="h-4 w-4" />
            <span>Todas las tiendas</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border-2">
        <CardContent className="p-8">
          {/* Date Section */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold">Cierre del Día - {new Date(selectedDate).toLocaleDateString('es-ES')}</h2>
                <p className="text-sm text-gray-600">
                  El cierre diario se ejecuta automáticamente a las 10:00 PM o puede realizarse manualmente
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Automático 10:00 PM</span>
            </div>
          </div>

          {/* Status Section */}
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay cierre del día</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                El cierre diario se ejecuta automáticamente a las 10:00 PM o puedes generarlo manualmente.
              </p>
            </div>

            <Button 
              onClick={handleManualClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              disabled={isManualClose}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isManualClose ? 'Cierre Generado' : 'Generar Cierre Manual'}
            </Button>
          </div>

          {/* Information Message */}
          {isManualClose && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-green-800 font-medium">
                  Cierre manual generado exitosamente para el día {new Date(selectedDate).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Sistema StampOut POS - Versión 1.0.0</p>
      </div>
    </div>
  );
};
