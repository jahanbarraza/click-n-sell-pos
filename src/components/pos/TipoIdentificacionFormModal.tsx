
import React, { useState, useEffect } from 'react';
import { X, CreditCard, FileText, Globe, Code } from 'lucide-react';

interface TipoIdentificacion {
  id: string;
  nombre: string;
  descripcion: string;
  pais: string;
  formato: string;
  estado: 'Activo' | 'Inactivo';
}

interface TipoIdentificacionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tipo: Omit<TipoIdentificacion, 'id'>) => void;
  tipo?: TipoIdentificacion | null;
  mode: 'create' | 'edit';
}

export const TipoIdentificacionFormModal: React.FC<TipoIdentificacionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tipo,
  mode
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    pais: 'Colombia',
    formato: '',
    estado: 'Activo' as 'Activo' | 'Inactivo'
  });

  // Resetear formulario cuando se abre/cierra o cambia el tipo
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && tipo) {
        setFormData({
          nombre: tipo.nombre,
          descripcion: tipo.descripcion,
          pais: tipo.pais,
          formato: tipo.formato,
          estado: tipo.estado
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          pais: 'Colombia',
          formato: '',
          estado: 'Activo'
        });
      }
    }
  }, [isOpen, mode, tipo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateRegex = (pattern: string): boolean => {
    try {
      new RegExp(pattern);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.descripcion.trim() || !formData.formato.trim()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Validar que el formato sea un regex válido
    if (!validateRegex(formData.formato)) {
      alert('El formato debe ser una expresión regular válida');
      return;
    }

    const tipoData = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      pais: formData.pais,
      formato: formData.formato.trim(),
      estado: formData.estado
    };

    onSubmit(tipoData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Nuevo Tipo de Identificación' : 'Editar Tipo de Identificación'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' 
                  ? 'Completa la información para crear un nuevo tipo de identificación'
                  : 'Modifica la información del tipo de identificación'
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
                <CreditCard className="w-4 h-4 inline mr-1" />
                Nombre del Tipo *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ej: Cédula de Ciudadanía"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                País *
              </label>
              <select
                value={formData.pais}
                onChange={(e) => handleInputChange('pais', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Colombia">Colombia</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Perú">Perú</option>
                <option value="Brasil">Brasil</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="México">México</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="España">España</option>
              </select>
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
                placeholder="Describe el tipo de documento de identificación"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Formato (Regex) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Code className="w-4 h-4 inline mr-1" />
                Formato de Validación (Regex) *
              </label>
              <input
                type="text"
                value={formData.formato}
                onChange={(e) => handleInputChange('formato', e.target.value)}
                placeholder="Ej: ^[0-9]{8,10}$ para números de 8 a 10 dígitos"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Expresión regular para validar el formato del documento. 
                Ejemplos: ^[0-9]{8,10}$ (números), ^[A-Z]{2}[0-9]{6}$ (letras + números)
              </p>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Ejemplos de formatos comunes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de formatos comunes:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div><code className="bg-white px-1 rounded">^[0-9]{8,10}$</code> - Números de 8 a 10 dígitos</div>
              <div><code className="bg-white px-1 rounded">^[0-9]{9,10}-[0-9]$</code> - NIT (9-10 dígitos + guión + dígito)</div>
              <div><code className="bg-white px-1 rounded">^[A-Z]{2}[0-9]{6}$</code> - 2 letras seguidas de 6 números</div>
              <div><code className="bg-white px-1 rounded">^[0-9]{6,10}$</code> - Números de 6 a 10 dígitos</div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'create' ? 'Crear Tipo' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
