import React, { useState, useEffect } from 'react';
import { X, Package, FileText, Tag, DollarSign, Hash, BarChart3 } from 'lucide-react';

interface Product {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  subCategoria: string;
  precioBase: number;
  unidad: string;
  estado: 'activo' | 'inactivo';
  imagen?: string;
  descripcion?: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  product?: Product | null;
  mode: 'create' | 'edit';
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  mode
}) => {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    subCategoria: '',
    precioBase: '',
    unidad: 'UND',
    estado: 'activo' as 'activo' | 'inactivo'
  });

  // Categorías y subcategorías disponibles
  const categorias = {
    'Carcasas': ['Carcasa Mujer', 'Carcasa Hombre', 'Carcasa Universal'],
    'Huawei': ['Mate XT ULTIMATE DESIGN', 'P Series', 'Nova Series'],
    'Accesorios': ['Cargadores', 'Cables', 'Audífonos'],
    'Samsung': ['Galaxy S Series', 'Galaxy A Series', 'Galaxy Note'],
    'Apple': ['iPhone', 'iPad', 'AirPods'],
    'Xiaomi': ['Redmi', 'Mi Series', 'POCO']
  };

  const unidades = ['UND', 'KG', 'LT', 'MT', 'PAR', 'SET'];

  // Generar código automático para productos nuevos
  const generateProductCode = (): string => {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return `PROD${randomNum}`;
  };

  // Resetear formulario cuando se abre/cierra o cambia el producto
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        setFormData({
          codigo: product.codigo,
          nombre: product.nombre,
          descripcion: product.descripcion || '',
          categoria: product.categoria,
          subCategoria: product.subCategoria,
          precioBase: product.precioBase.toString(),
          unidad: product.unidad,
          estado: product.estado
        });
      } else {
        setFormData({
          codigo: generateProductCode(),
          nombre: '',
          descripcion: '',
          categoria: '',
          subCategoria: '',
          precioBase: '',
          unidad: 'UND',
          estado: 'activo'
        });
      }
    }
  }, [isOpen, mode, product]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar subcategoría si cambia la categoría
    if (field === 'categoria') {
      setFormData(prev => ({
        ...prev,
        categoria: value,
        subCategoria: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.categoria || !formData.subCategoria || !formData.precioBase) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar que el precio sea un número válido
    const precio = parseFloat(formData.precioBase);
    if (isNaN(precio) || precio <= 0) {
      alert('El precio debe ser un número válido mayor a 0');
      return;
    }

    const productData = {
      codigo: formData.codigo,
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria,
      subCategoria: formData.subCategoria,
      precioBase: precio,
      unidad: formData.unidad,
      estado: formData.estado
    };

    onSubmit(productData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' 
                  ? 'Completa la información para crear un nuevo producto'
                  : 'Modifica la información del producto'
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Código del Producto *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="PROD001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-gray-50"
                readOnly={mode === 'create'}
                required
              />
              {mode === 'create' && (
                <p className="text-xs text-gray-500 mt-1">Código generado automáticamente</p>
              )}
            </div>

            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-1" />
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: iPhone 15 Pro Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Categoría *
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar categoría</option>
                {Object.keys(categorias).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sub Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Sub Categoría *
              </label>
              <select
                value={formData.subCategoria}
                onChange={(e) => handleInputChange('subCategoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
                disabled={!formData.categoria}
              >
                <option value="">Seleccionar subcategoría</option>
                {formData.categoria && categorias[formData.categoria as keyof typeof categorias]?.map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>

            {/* Precio Base */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Precio Base *
              </label>
              <input
                type="number"
                value={formData.precioBase}
                onChange={(e) => handleInputChange('precioBase', e.target.value)}
                placeholder="25600"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              />
            </div>

            {/* Unidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Unidad *
              </label>
              <select
                value={formData.unidad}
                onChange={(e) => handleInputChange('unidad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              >
                {unidades.map(unidad => (
                  <option key={unidad} value={unidad}>{unidad}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                placeholder="Descripción detallada del producto (opcional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Información adicional:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• El código del producto se genera automáticamente para productos nuevos</div>
              <div>• El precio base debe ser un número válido mayor a 0</div>
              <div>• La subcategoría depende de la categoría seleccionada</div>
              <div>• Los productos inactivos no aparecerán en el punto de venta</div>
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
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

