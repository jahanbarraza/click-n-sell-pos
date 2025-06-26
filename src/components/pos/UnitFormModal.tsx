
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  symbol: string;
  company: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UnitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  unit?: Unit | null;
}

export const UnitFormModal: React.FC<UnitFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  unit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    company: 'Global',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (unit) {
      setFormData({
        name: unit.name,
        symbol: unit.symbol,
        company: unit.company,
        description: unit.description
      });
    } else {
      setFormData({
        name: '',
        symbol: '',
        company: 'Global',
        description: ''
      });
    }
    setErrors({});
  }, [unit, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'El símbolo es requerido';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'La compañía es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {unit ? 'Editar Unidad' : 'Nueva Unidad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ingresa el nombre de la unidad"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Símbolo *
            </label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                errors.symbol ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: UND, KG, MT"
            />
            {errors.symbol && <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Compañía *
            </label>
            <select
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="Global">Global</option>
              <option value="Local">Local</option>
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
            </select>
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe la unidad de medida"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              {unit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
