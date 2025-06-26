
import React, { useState } from 'react';
import { Ruler, Plus, Edit, Trash2 } from 'lucide-react';
import { UnitFormModal } from './UnitFormModal';

interface Unit {
  id: string;
  name: string;
  symbol: string;
  company: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Units: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([
    {
      id: '1',
      name: 'Unidades',
      symbol: 'UND',
      company: 'Global',
      description: 'Unidades',
      createdAt: new Date('2025-06-14'),
      updatedAt: new Date('2025-06-14')
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const handleCreateUnit = () => {
    setShowCreateModal(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowEditModal(true);
  };

  const handleDeleteUnit = (unit: Unit) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la unidad "${unit.name}"?`)) {
      setUnits(units.filter(u => u.id !== unit.id));
    }
  };

  const handleSaveUnit = (unitData: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedUnit) {
      // Editar unidad existente
      setUnits(units.map(u => 
        u.id === selectedUnit.id 
          ? { ...u, ...unitData, updatedAt: new Date() }
          : u
      ));
    } else {
      // Crear nueva unidad
      const newUnit: Unit = {
        id: Date.now().toString(),
        ...unitData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setUnits([...units, newUnit]);
    }
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUnit(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUnit(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Ruler className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Unidades</h1>
            <p className="text-gray-600">Administra las unidades de medida del sistema</p>
          </div>
        </div>
        <button
          onClick={handleCreateUnit}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Unidad
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Símbolo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Compañía</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha Creación</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{unit.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {unit.symbol}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      {unit.company}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{unit.description}</td>
                  <td className="py-3 px-4 text-gray-700">{formatDate(unit.createdAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUnit(unit)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Editar unidad"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Eliminar unidad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de crear unidad */}
      <UnitFormModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveUnit}
      />

      {/* Modal de editar unidad */}
      <UnitFormModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        onSave={handleSaveUnit}
        unit={selectedUnit}
      />
    </div>
  );
};
