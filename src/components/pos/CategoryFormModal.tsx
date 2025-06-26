import React, { useState, useEffect } from 'react';
import { X, Tag, Palette } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  code: string;
  company: string;
  status: 'Activo' | 'Inactivo';
  order: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  category?: Category | null;
  existingCategories: Category[];
}

const PREDEFINED_COLORS = [
  '#3B82F6', // Azul
  '#10B981', // Verde
  '#EC4899', // Rosa
  '#F59E0B', // Naranja
  '#06B6D4', // Celeste
  '#8B5CF6', // Púrpura
  '#EF4444', // Rojo
  '#6B7280', // Gris
  '#84CC16', // Lima
  '#F97316', // Naranja oscuro
  '#14B8A6', // Teal
  '#A855F7'  // Violeta
];

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  existingCategories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    company: 'StampOut Food S.A.S.',
    status: 'Activo' as 'Activo' | 'Inactivo',
    order: 0,
    color: '#3B82F6'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        code: category.code,
        company: category.company,
        status: category.status,
        order: category.order,
        color: category.color
      });
    } else {
      // Para nueva categoría, calcular el siguiente orden
      const maxOrder = existingCategories.length > 0 
        ? Math.max(...existingCategories.map(c => c.order))
        : -1;
      setFormData({
        name: '',
        code: '',
        company: 'StampOut Food S.A.S.',
        status: 'Activo',
        order: maxOrder + 1,
        color: '#3B82F6'
      });
    }
    setErrors({});
  }, [category, existingCategories]);

  const generateCodeFromName = (name: string): string => {
    if (!name) return '';
    
    // Generar código de 3 letras basado en el nombre
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    } else {
      return words.map(word => word.charAt(0)).join('').substring(0, 3).toUpperCase();
    }
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      code: category ? prev.code : generateCodeFromName(name)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (existingCategories.some(c => 
      c.name.toLowerCase() === formData.name.toLowerCase() && 
      c.id !== category?.id
    )) {
      newErrors.name = 'Ya existe una categoría con este nombre';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    } else if (formData.code.length > 3) {
      newErrors.code = 'El código no puede tener más de 3 caracteres';
    } else if (existingCategories.some(c => 
      c.code.toLowerCase() === formData.code.toLowerCase() && 
      c.id !== category?.id
    )) {
      newErrors.code = 'Ya existe una categoría con este código';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'La compañía es requerida';
    }

    if (!formData.color.match(/^#[0-9A-F]{6}$/i)) {
      newErrors.color = 'El color debe ser un código hexadecimal válido';
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

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
    setShowColorPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-700 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {category ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-sm text-gray-600">
                {category ? 'Modifica la información de la categoría' : 'Completa la información para crear una nueva categoría'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Bebidas"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="BEB"
                maxLength={3}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Máximo 3 caracteres</p>
            </div>

            {/* Compañía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compañía *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="StampOut Food S.A.S."
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'Activo' | 'Inactivo' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            {/* Orden */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden *
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">Orden de visualización</p>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: formData.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    errors.color ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="#3B82F6"
                />
              </div>
              {errors.color && (
                <p className="mt-1 text-sm text-red-600">{errors.color}</p>
              )}
              
              {/* Color Picker */}
              {showColorPicker && (
                <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Colores predefinidos:</p>
                  <div className="grid grid-cols-6 gap-2">
                    {PREDEFINED_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded border-2 ${
                          formData.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Información adicional:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• El código se genera automáticamente basado en el nombre</li>
              <li>• El código debe ser único y tener máximo 3 caracteres</li>
              <li>• El orden determina la posición en listas y menús</li>
              <li>• Las categorías inactivas no aparecerán en el punto de venta</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
            >
              {category ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

