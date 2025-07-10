import React, { useState } from 'react';
import { Tags, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { SubcategoryFormModal } from './SubcategoryFormModal';

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

interface Category {
  id: string;
  name: string;
  code: string;
  color: string;
}

export const Subcategories: React.FC = () => {
  console.log('Subcategories component rendering');

  // Categorías disponibles (simulando las que ya creamos)
  const categories: Category[] = [
    { id: '1', name: 'Bebidas', code: 'BEB', color: '#3B82F6' },
    { id: '2', name: 'Comidas', code: 'COM', color: '#10B981' },
    { id: '3', name: 'Postres', code: 'POS', color: '#EC4899' },
    { id: '4', name: 'Snacks', code: 'SNK', color: '#F59E0B' },
    { id: '5', name: 'Helados', code: 'HEL', color: '#06B6D4' }
  ];

  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    {
      id: '1',
      name: 'Bebidas Calientes',
      code: 'BC01',
      categoryId: '1',
      categoryName: 'Bebidas',
      status: 'Activo',
      order: 0,
      color: '#DC2626',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Bebidas Frías',
      code: 'BF02',
      categoryId: '1',
      categoryName: 'Bebidas',
      status: 'Activo',
      order: 1,
      color: '#2563EB',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Bebidas Alcohólicas',
      code: 'BA03',
      categoryId: '1',
      categoryName: 'Bebidas',
      status: 'Activo',
      order: 2,
      color: '#7C3AED',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Platos Principales',
      code: 'PP01',
      categoryId: '2',
      categoryName: 'Comidas',
      status: 'Activo',
      order: 0,
      color: '#059669',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Entradas',
      code: 'EN02',
      categoryId: '2',
      categoryName: 'Comidas',
      status: 'Activo',
      order: 1,
      color: '#16A34A',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Comida Rápida',
      code: 'CR03',
      categoryId: '2',
      categoryName: 'Comidas',
      status: 'Activo',
      order: 2,
      color: '#CA8A04',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      name: 'Postres Fríos',
      code: 'PF01',
      categoryId: '3',
      categoryName: 'Postres',
      status: 'Activo',
      order: 0,
      color: '#DB2777',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '8',
      name: 'Repostería',
      code: 'RP02',
      categoryId: '3',
      categoryName: 'Postres',
      status: 'Activo',
      order: 1,
      color: '#BE185D',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9',
      name: 'Snacks Salados',
      code: 'SS01',
      categoryId: '4',
      categoryName: 'Snacks',
      status: 'Activo',
      order: 0,
      color: '#D97706',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '10',
      name: 'Snacks Dulces',
      code: 'SD02',
      categoryId: '4',
      categoryName: 'Snacks',
      status: 'Activo',
      order: 1,
      color: '#EA580C',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '11',
      name: 'Helados Cremosos',
      code: 'HC01',
      categoryId: '5',
      categoryName: 'Helados',
      status: 'Activo',
      order: 0,
      color: '#0891B2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '12',
      name: 'Helados de Agua',
      code: 'HA02',
      categoryId: '5',
      categoryName: 'Helados',
      status: 'Activo',
      order: 1,
      color: '#0284C7',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleCreateSubcategory = () => {
    console.log('Opening create subcategory modal');
    setShowCreateModal(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    console.log('Editing subcategory:', subcategory.name);
    setSelectedSubcategory(subcategory);
    setShowEditModal(true);
  };

  const handleDeleteSubcategory = (subcategory: Subcategory) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la subcategoría "${subcategory.name}"?`)) {
      console.log('Deleting subcategory:', subcategory.name);
      setSubcategories(subcategories.filter(s => s.id !== subcategory.id));
    }
  };

  const handleSaveSubcategory = (subcategoryData: Omit<Subcategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedSubcategory) {
      // Editar subcategoría existente
      console.log('Updating subcategory:', selectedSubcategory.name);
      setSubcategories(subcategories.map(s => 
        s.id === selectedSubcategory.id 
          ? { ...s, ...subcategoryData, updatedAt: new Date() }
          : s
      ));
    } else {
      // Crear nueva subcategoría
      console.log('Creating new subcategory:', subcategoryData.name);
      const newSubcategory: Subcategory = {
        id: Date.now().toString(),
        ...subcategoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSubcategories([...subcategories, newSubcategory]);
    }
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedSubcategory(null);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedSubcategory(null);
  };

  // Filtrar subcategorías por categoría
  const filteredSubcategories = filterCategory === 'all' 
    ? subcategories 
    : subcategories.filter(s => s.categoryId === filterCategory);

  console.log('Filtered subcategories count:', filteredSubcategories.length);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Tags className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Subcategorías</h1>
            <p className="text-gray-600">Administra las subcategorías de productos del sistema</p>
          </div>
        </div>
        <button
          onClick={handleCreateSubcategory}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Subcategoría
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por categoría:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Categoría</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Orden</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Color</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubcategories.map((subcategory) => {
                const category = categories.find(c => c.id === subcategory.categoryId);
                return (
                  <tr key={subcategory.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: subcategory.color }}
                        />
                        <span className="font-medium text-gray-900">{subcategory.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{subcategory.code}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{subcategory.categoryName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subcategory.status === 'Activo' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subcategory.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{subcategory.order}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: subcategory.color }}
                        />
                        <span className="text-sm text-gray-600">{subcategory.color}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSubcategory(subcategory)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar subcategoría"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(subcategory)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar subcategoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de crear subcategoría */}
      <SubcategoryFormModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveSubcategory}
        categories={categories}
        existingSubcategories={subcategories}
      />

      {/* Modal de editar subcategoría */}
      <SubcategoryFormModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        onSave={handleSaveSubcategory}
        subcategory={selectedSubcategory}
        categories={categories}
        existingSubcategories={subcategories}
      />
    </div>
  );
};

export default Subcategories;
