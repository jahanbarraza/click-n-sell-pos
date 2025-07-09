
import React, { useState } from 'react';
import { CreditCard, Plus, Edit, Trash2, Globe } from 'lucide-react';
import { TipoIdentificacionFormModal } from './TipoIdentificacionFormModal';

interface TipoIdentificacion {
  id: string;
  nombre: string;
  descripcion: string;
  pais: string;
  formato: string;
  estado: 'Activo' | 'Inactivo';
}

const initialTipos: TipoIdentificacion[] = [
  {
    id: '1',
    nombre: 'Cédula de Ciudadanía',
    descripcion: 'Cédula de Ciudadanía',
    pais: 'Colombia',
    formato: '^[0-9]{8,10}$',
    estado: 'Activo'
  },
  {
    id: '2',
    nombre: 'Cédula de Extranjería',
    descripcion: 'Documento de identidad para extranjeros residentes',
    pais: 'Colombia',
    formato: '^[0-9]{6,10}$',
    estado: 'Activo'
  },
  {
    id: '3',
    nombre: 'Consumidor Final',
    descripcion: 'Consumidor final',
    pais: 'Colombia',
    formato: '^[0-9]{8,10}$',
    estado: 'Activo'
  },
  {
    id: '4',
    nombre: 'NIT',
    descripcion: 'Número de Identificación Tributaria',
    pais: 'Colombia',
    formato: '^[0-9]{9,10}-[0-9]$',
    estado: 'Activo'
  }
];

export const TiposIdentificacionComponent = () => {
  const [tipos, setTipos] = useState<TipoIdentificacion[]>(initialTipos);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoIdentificacion | null>(null);

  const handleCreateTipo = () => {
    setShowCreateModal(true);
  };

  const handleEditTipo = (tipo: TipoIdentificacion) => {
    setSelectedTipo(tipo);
    setShowEditModal(true);
  };

  const handleDeleteTipo = (tipo: TipoIdentificacion) => {
    setSelectedTipo(tipo);
    setShowDeleteDialog(true);
  };

  const handleSubmitTipo = (tipoData: Omit<TipoIdentificacion, 'id'>) => {
    if (showCreateModal) {
      // Crear nuevo tipo
      const newTipo: TipoIdentificacion = {
        ...tipoData,
        id: Date.now().toString()
      };
      setTipos([...tipos, newTipo]);
      setShowCreateModal(false);
    } else if (showEditModal && selectedTipo) {
      // Editar tipo existente
      setTipos(tipos.map(tipo => 
        tipo.id === selectedTipo.id 
          ? { ...tipoData, id: selectedTipo.id }
          : tipo
      ));
      setShowEditModal(false);
      setSelectedTipo(null);
    }
  };

  const confirmDeleteTipo = () => {
    if (selectedTipo) {
      setTipos(tipos.filter(tipo => tipo.id !== selectedTipo.id));
      setShowDeleteDialog(false);
      setSelectedTipo(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tipos de Identificación</h1>
            <p className="text-gray-600">Administra los tipos de documentos de identificación</p>
          </div>
        </div>
        <button
          onClick={handleCreateTipo}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Tipo</span>
        </button>
      </div>

      {/* Lista de tipos de identificación */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Lista de Identificación</h2>
            <span className="text-sm text-gray-500">{tipos.length} identificaciones registrados</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Identificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tipos.map((tipo) => (
                <tr key={tipo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{tipo.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{tipo.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{tipo.pais}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                      {tipo.formato}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTipo(tipo)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Editar tipo"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTipo(tipo)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Eliminar tipo"
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

      {/* Modal de crear tipo */}
      <TipoIdentificacionFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitTipo}
        mode="create"
      />

      {/* Modal de editar tipo */}
      <TipoIdentificacionFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTipo(null);
        }}
        onSubmit={handleSubmitTipo}
        tipo={selectedTipo}
        mode="edit"
      />

      {/* Diálogo de confirmación de eliminación */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Estás seguro?</h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de identificación "{selectedTipo?.nombre}" 
              y removerá todos sus datos de nuestros servidores.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedTipo(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTipo}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
