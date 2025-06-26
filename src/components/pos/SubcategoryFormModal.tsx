import React, { useState, useEffect } from 'react';
import { X, Tags, AlertCircle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface Subcategory {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  categoryName: string;
  status: 'Activo' | 'Inactivo';
  order: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SubcategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subcategoryData: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  subcategory?: Subcategory | null;
  categories: Category[];
  existingSubcategories: Subcategory[];
}

export const SubcategoryFormModal: React.FC<SubcategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subcategory,
  categories,
  existingSubcategories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    categoryId: '',
    categoryName: '',
    status: 'Activo' as 'Activo' | 'Inactivo',
    order: 0,
    color: '#3B82F6'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Colores predefinidos para subcategorías
  const predefinedColors = [
    '#DC2626', '#2563EB', '#7C3AED', '#059669',
    '#16A34A', '#CA8A04', '#DB2777', '#BE185D',
    '#D97706', '#EA580C', '#0891B2', '#0284C7',
    '#1F2937', '#374151', '#6B7280', '#9CA3AF'
  ];

  useEffect(() => {
    if (subcategory) {
      // Modo edición
      setFormData({
        name: subcategory.name,
        code: subcategory.code,
        categoryId: subcategory.categoryId,
        categoryName: subcategory.categoryName,
        status: subcategory.status,
        order: subcategory.order,
        color: subcategory.color
      });
    } else {
      // Modo creación - calcular siguiente orden disponible
      const maxOrder = existingSubcategories.length > 0 
        ? Math.max(...existingSubcategories.map(s => s.order))
        : -1;
      
      setFormData({
        name: '',
        code: '',
        categoryId: '',
        categoryName: '',
        status: 'Activo',
        order: maxOrder + 1,
        color: '#3B82F6'
      });
    }
    setErrors({});
  }, [subcategory, existingSubcategories, isOpen]);

  const generateCode = (name: string, categoryCode: string): string => {
    if (!name || !categoryCode) return '';
    
    // Tomar las primeras 2 letras del nombre y agregar número secuencial
    const namePrefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
    const categoryPrefix = categoryCode.substring(0, 1);
    
    // Encontrar el siguiente número disponible para esta categoría
    const existingCodes = existingSubcategories
      .filter(s => s.categoryId === formData.categoryId && s.id !== subcategory?.id)
      .map(s => s.code);
    
    let counter = 1;
    let newCode = `${namePrefix}${counter.toString().padStart(2, '0')}`;
    
    while (existingCodes.includes(newCode)) {
      counter++;
      newCode = `${namePrefix}${counter.toString().padStart(2, '0')}`;
    }
    
    return newCode;
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => {
      const selectedCategory = categories.find(c => c.id === prev.categoryId);
      const newCode = selectedCategory ? generateCode(name, selectedCategory.code) : '';
      
      return {
        ...prev,
        name,
        code: newCode
      };
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    if (selectedCategory) {
      setFormData(prev => ({
        ...prev,
        categoryId,
        categoryName: selectedCategory.name,
        code: generateCode(prev.name, selectedCategory.code)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else {
      // Verificar unicidad del nombre dentro de la misma categoría
      const duplicateName = existingSubcategories.find(s => 
        s.name.toLowerCase() === formData.name.toLowerCase() &&
        s.categoryId === formData.categoryId &&
        s.id !== subcategory?.id
      );
      if (duplicateName) {
        newErrors.name = 'Ya existe una subcategoría con este nombre en la categoría seleccionada';
      }
    }

    // Validar código
    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    } else if (formData.code.length > 5) {
      newErrors.code = 'El código no puede tener más de 5 caracteres';
    } else {
      // Verificar unicidad del código
      const duplicateCode = existingSubcategories.find(s => 
        s.code.toLowerCase() === formData.code.toLowerCase() &&
        s.id !== subcategory?.id
      );
      if (duplicateCode) {
        newErrors.code = 'Ya existe una subcategoría con este código';
      }
    }

    // Validar categoría
    if (!formData.categoryId) {
      newErrors.categoryId = 'Debe seleccionar una categoría';
    }

    // Validar color
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (!colorRegex.test(formData.color)) {
      newErrors.color = 'El color debe ser un código hexadecimal válido (ej: #3B82F6)';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <Tags className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {subcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
              </h2>
              <p className="text-sm text-gray-600">
                {subcategory ? 'Modifica la información de la subcategoría' : 'Completa la información para crear una nueva subcategoría'}
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
            {/* Nombre de la Subcategoría */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Subcategoría *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Bebidas Calientes"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
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
                placeholder="BC01"
                maxLength={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <p className="mt-1 text-xs text-gray-500">Máximo 5 caracteres</p>
              {errors.code && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.code}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.categoryId}
                </p>
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
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <p className="mt-1 text-xs text-gray-500">Orden de visualización</p>
            </div>

            {/* Color */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <div className="space-y-3">
                {/* Colores predefinidos */}
                <div className="grid grid-cols-8 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        formData.color === color 
                          ? 'border-gray-800 scale-110' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                {/* Input de color personalizado */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#3B82F6"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.color && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.color}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Información adicional:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• El código se genera automáticamente basado en el nombre y categoría</li>
              <li>• El código debe ser único en todo el sistema</li>
              <li>• El nombre debe ser único dentro de la misma categoría</li>
              <li>• El orden determina la posición en listas y menús</li>
              <li>• Las subcategorías inactivas no aparecerán en el punto de venta</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-gray-200">
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
              {subcategory ? 'Actualizar Subcategoría' : 'Crear Subcategoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

