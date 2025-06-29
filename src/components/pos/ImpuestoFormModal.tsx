
import React, { useState, useEffect } from 'react';
import { X, DollarSign, Hash, FileText, Percent } from 'lucide-react';

interface Impuesto {
  id: string;
  nombre: string;
  codigo: string;
  tipo: 'IVA' | 'ICO' | 'INC' | 'RTE';
  porcentaje: number;
  descripcion: string;
  estado: 'Activo' | 'Inactivo';
}

interface ImpuestoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (impuesto: Omit<Impuesto, 'id'>) => void;
  impuesto?: Impuesto | null;
  mode: 'create' | 'edit';
}

export const ImpuestoFormModal: React.FC<ImpuestoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  impuesto,
  mode
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    tipo: 'IVA' as 'IVA' | 'ICO' | 'INC' | 'RTE',
    porcentaje: 0,
    descripcion: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });

  // Resetear formulario cuando se abre/cierra o cambia el impuesto
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && impuesto) {
        setFormData({
          nombre: impuesto.nombre,
          codigo: impuesto.codigo,
          tipo: impuesto.tipo,
          porcentaje: impuesto.porcentaje,
          descripcion: impuesto.descripcion,
          estado: impuesto.estado
        });
      } else {
        setFormData({
          nombre: '',
          codigo: '',
          tipo: 'IVA',
          porcentaje: 0,
          descripcion: '',
          estado: 'Activo'
        });
      }
    }
  }, [isOpen, mode, impuesto]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.codigo.trim() || !formData.descripcion.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.porcentaje < 0 || formData.porcentaje > 100) {
      alert('El porcentaje debe estar entre 0 y 100');
      return;
    }

    const impuestoData = {
      nombre: formData.nombre.trim(),
      codigo: formData.codigo.trim().toUpperCase(),
      tipo: formData.tipo,
      porcentaje: parseFloat(formData.porcentaje.toString()),
      descripcion: formData.descripcion.trim(),
      estado: formData.estado
    };

    onSubmit(impuestoData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Nuevo Impuesto' : 'Editar Impuesto'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' 
                  ? 'Completa la información para crear un nuevo impuesto'
                  : 'Modifica la información del impuesto'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Nombre del Impuesto *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: IVA 19%"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Código *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value.toUpperCase())}
                placeholder="Ej: IVA19"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Impuesto *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="IVA">IVA - Impuesto al Valor Agregado</option>
                <option value="ICO">ICO - Impuesto al Consumo</option>
                <option value="INC">INC - Impuesto Nacional al Consumo</option>
                <option value="RTE">RTE - Retención en la Fuente</option>
              </select>
            </div>

            {/* Porcentaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-1" />
                Porcentaje *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.porcentaje}
                onChange={(e) => handleInputChange('porcentaje', parseFloat(e.target.value) || 0)}
                placeholder="19.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Describe el impuesto y su aplicación"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-700 mb-2">Información sobre tipos de impuestos:</h4>
            <div className="text-xs text-blue-600 space-y-1">
              <div><strong>IVA:</strong> Impuesto al Valor Agregado aplicado a bienes y servicios</div>
              <div><strong>ICO:</strong> Impuesto al Consumo aplicado a productos específicos</div>
              <div><strong>INC:</strong> Impuesto Nacional al Consumo</div>
              <div><strong>RTE:</strong> Retención en la Fuente aplicada en transacciones</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {mode === 'create' ? 'Crear Impuesto' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
