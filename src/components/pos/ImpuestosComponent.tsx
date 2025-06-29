
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign, Percent } from 'lucide-react';
import { ImpuestoFormModal } from './ImpuestoFormModal';

interface Impuesto {
  id: string;
  nombre: string;
  codigo: string;
  tipo: 'IVA' | 'ICO' | 'INC' | 'RTE';
  porcentaje: number;
  descripcion: string;
  estado: 'Activo' | 'Inactivo';
}

export const ImpuestosComponent = () => {
  const [impuestos, setImpuestos] = useState<Impuesto[]>([
    {
      id: '1',
      nombre: 'EXCENTO',
      codigo: 'EXCENTO',
      tipo: 'IVA',
      porcentaje: 0.0,
      descripcion: 'EXCENTO',
      estado: 'Activo'
    },
    {
      id: '2',
      nombre: 'IVA 16%',
      codigo: 'IVA16',
      tipo: 'IVA',
      porcentaje: 14.0,
      descripcion: 'IVA AL 16%',
      estado: 'Activo'
    },
    {
      id: '3',
      nombre: 'IVA AL 19%',
      codigo: 'IVA19',
      tipo: 'IVA',
      porcentaje: 19.0,
      descripcion: 'IVA AL 19%',
      estado: 'Activo'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImpuesto, setSelectedImpuesto] = useState<Impuesto | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleCreateImpuesto = () => {
    setSelectedImpuesto(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditImpuesto = (impuesto: Impuesto) => {
    setSelectedImpuesto(impuesto);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteImpuesto = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este impuesto?')) {
      setImpuestos(impuestos.filter(impuesto => impuesto.id !== id));
    }
  };

  const handleSubmitImpuesto = (impuestoData: Omit<Impuesto, 'id'>) => {
    if (modalMode === 'create') {
      const newImpuesto: Impuesto = {
        ...impuestoData,
        id: Date.now().toString()
      };
      setImpuestos([...impuestos, newImpuesto]);
    } else if (selectedImpuesto) {
      setImpuestos(impuestos.map(impuesto => 
        impuesto.id === selectedImpuesto.id 
          ? { ...impuestoData, id: selectedImpuesto.id }
          : impuesto
      ));
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'IVA':
        return 'bg-blue-100 text-blue-800';
      case 'ICO':
        return 'bg-green-100 text-green-800';
      case 'INC':
        return 'bg-yellow-100 text-yellow-800';
      case 'RTE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Impuestos</h1>
            <p className="text-gray-500">Administra los impuestos del sistema</p>
          </div>
        </div>
        <Button onClick={handleCreateImpuesto} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo Impuesto</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{impuestos.length}</div>
            <p className="text-sm text-gray-600">Total Impuestos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {impuestos.filter(i => i.estado === 'Activo').length}
            </div>
            <p className="text-sm text-gray-600">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {impuestos.filter(i => i.estado === 'Inactivo').length}
            </div>
            <p className="text-sm text-gray-600">Inactivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {impuestos.filter(i => i.tipo === 'IVA').length}
            </div>
            <p className="text-sm text-gray-600">IVA</p>
          </CardContent>
        </Card>
      </div>

      {/* Impuestos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Impuestos</CardTitle>
          <CardDescription>
            Gestiona todos los impuestos configurados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Nombre</th>
                  <th className="text-left p-3 font-medium">Código</th>
                  <th className="text-left p-3 font-medium">Tipo</th>
                  <th className="text-left p-3 font-medium">Porcentaje</th>
                  <th className="text-left p-3 font-medium">Descripción</th>
                  <th className="text-left p-3 font-medium">Estado</th>
                  <th className="text-left p-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {impuestos.map((impuesto) => (
                  <tr key={impuesto.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{impuesto.nombre}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="font-mono">
                        {impuesto.codigo}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getTipoColor(impuesto.tipo)}>
                        {impuesto.tipo}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Percent className="w-3 h-3 text-gray-500" />
                        <span className="font-mono">{impuesto.porcentaje.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{impuesto.descripcion}</td>
                    <td className="p-3">
                      <Badge 
                        variant={impuesto.estado === 'Activo' ? 'default' : 'secondary'}
                        className={impuesto.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {impuesto.estado}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditImpuesto(impuesto)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteImpuesto(impuesto.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ImpuestoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitImpuesto}
        impuesto={selectedImpuesto}
        mode={modalMode}
      />
    </div>
  );
};
