import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Building } from 'lucide-react';
import { CategoryFormModal } from './CategoryFormModal';

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

export const CategoriesComponent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Bebidas',
      code: 'BEB',
      company: 'StampOut Food S.A.S.',
      status: 'Activo',
      order: 0,
      color: '#3B82F6',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Comidas',
      code: 'COM',
      company: 'StampOut Food S.A.S.',
      status: 'Activo',
      order: 1,
      color: '#10B981',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Postres',
      code: 'POS',
      company: 'StampOut Food S.A.S.',
      status: 'Activo',
      order: 2,
      color: '#EC4899',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Snacks',
      code: 'SNK',
      company: 'StampOut Food S.A.S.',
      status: 'Activo',
      order: 3,
      color: '#F59E0B',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Helados',
      code: 'HEL',
      company: 'StampOut Food S.A.S.',
      status: 'Activo',
      order: 4,
      color: '#06B6D4',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCreateCategory = () => {
    setShowCreateModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`)) {
      setCategories(categories.filter(c => c.id !== category.id));
    }
  };

  const handleSaveCategory = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedCategory) {
      // Editar categoría existente
      setCategories(categories.map(c => 
        c.id === selectedCategory.id 
          ? { ...c, ...categoryData, updatedAt: new Date() }
          : c
      ));
    } else {
      // Crear nueva categoría
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCategories([...categories, newCategory]);
    }
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-800 rounded-lg">
            <Tag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
            <p className="text-gray-600">Administra las categorías de productos del sistema</p>
          </div>
        </div>
        <button
          onClick={handleCreateCategory}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Compañía</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Orden</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Color</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{category.code}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{category.company}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === 'Activo' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{category.order}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-600">{category.color}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Editar categoría"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Eliminar categoría"
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

      {/* Modal de crear categoría */}
      <CategoryFormModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        existingCategories={categories}
      />

      {/* Modal de editar categoría */}
      <CategoryFormModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        category={selectedCategory}
        existingCategories={categories}
      />
    </div>
  );
};

