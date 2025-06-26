import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { PersonFormModal } from './PersonFormModal';

interface Person {
  id: string;
  name: string;
  email: string;
  identificationType: string;
  identificationNumber: string;
  address: string;
  phone: string;
  type: string;
  status: string;
}

const initialPersons: Person[] = [
  {
    id: '1',
    name: 'ASHLEE CASTRO SANDOVAL',
    email: 'ashleecastro@gmail.com',
    identificationType: 'Cédula de Extranjería',
    identificationNumber: '1045697507',
    address: 'Calle 18B # 17F - 24',
    phone: '3015678546',
    type: 'Cliente',
    status: 'Activo'
  },
  {
    id: '2',
    name: 'CONSUMIDOR FINAL',
    email: 'consumidor@final.com',
    identificationType: 'Cédula de Ciudadanía',
    identificationNumber: '0000000000',
    address: 'N/A',
    phone: 'N/A',
    type: 'Cliente',
    status: 'Activo'
  },
  {
    id: '3',
    name: 'IVAN JESUS CASTRO RUIZ',
    email: 'ivancastro@empresa.com',
    identificationType: 'Cédula de Ciudadanía',
    identificationNumber: '1234567890',
    address: 'Carrera 15 # 25-30',
    phone: '3201234567',
    type: 'Empleado',
    status: 'Activo'
  },
  {
    id: '4',
    name: 'luz anaya',
    email: 'luz.anaya@email.com',
    identificationType: 'Cédula de Ciudadanía',
    identificationNumber: '9876543210',
    address: 'Avenida 10 # 12-45',
    phone: '3109876543',
    type: 'Cliente',
    status: 'Activo'
  },
  {
    id: '5',
    name: 'SIRLEY CESPEDES',
    email: 'sirley.cespedes@empresa.com',
    identificationType: 'Cédula de Ciudadanía',
    identificationNumber: '5555555555',
    address: 'Calle 20 # 30-40',
    phone: '3155555555',
    type: 'Empleado',
    status: 'Activo'
  }
];

export const Persons = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos los tipos');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [persons, setPersons] = useState<Person[]>(initialPersons);

  // Filtrar personas según búsqueda y filtro
  const filteredPersons = persons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.identificationNumber.includes(searchTerm) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.phone.includes(searchTerm);
    
    const matchesFilter = filterType === 'Todos los tipos' || person.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreatePerson = (personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: Date.now().toString()
    };
    setPersons([...persons, newPerson]);
    setShowCreateModal(false);
  };

  const handleEditPerson = (personData: Omit<Person, 'id'>) => {
    if (selectedPerson) {
      setPersons(persons.map(person => 
        person.id === selectedPerson.id 
          ? { ...personData, id: selectedPerson.id }
          : person
      ));
      setShowEditModal(false);
      setSelectedPerson(null);
    }
  };

  const handleDeletePerson = () => {
    if (selectedPerson) {
      setPersons(persons.filter(person => person.id !== selectedPerson.id));
      setShowDeleteDialog(false);
      setSelectedPerson(null);
    }
  };

  const openEditModal = (person: Person) => {
    setSelectedPerson(person);
    setShowEditModal(true);
  };

  const openDeleteDialog = (person: Person) => {
    setSelectedPerson(person);
    setShowDeleteDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Personas</h1>
            <p className="text-gray-600">Administra clientes, empleados y proveedores</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Persona</span>
        </button>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre, identificación, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="Todos los tipos">Todos los tipos</option>
            <option value="Cliente">Cliente</option>
            <option value="Empleado">Empleado</option>
            <option value="Proveedor">Proveedor</option>
          </select>
        </div>
      </div>

      {/* Lista de personas */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Lista de personas</h2>
            <span className="text-sm text-gray-500">{filteredPersons.length} personas registrados</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Persona
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersons.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.identificationNumber}</div>
                    <div className="text-sm text-gray-500">{person.identificationType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{person.phone}</div>
                    <div className="text-sm text-gray-500">{person.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      person.type === 'Cliente' 
                        ? 'bg-blue-100 text-blue-800'
                        : person.type === 'Empleado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {person.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      person.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(person)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(person)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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

      {/* Modal de crear persona */}
      <PersonFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePerson}
        mode="create"
      />

      {/* Modal de editar persona */}
      <PersonFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPerson(null);
        }}
        onSubmit={handleEditPerson}
        person={selectedPerson}
        mode="edit"
      />

      {/* Diálogo de confirmación de eliminación */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Estás seguro?</h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Esto eliminará permanentemente la persona y removerá todos sus datos de nuestros servidores.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedPerson(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePerson}
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

