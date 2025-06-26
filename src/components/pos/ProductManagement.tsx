import React, { useState } from 'react';
import { Package, Plus, Eye, Edit, Trash2, Smartphone } from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';

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
}

const initialProducts: Product[] = [
  {
    id: '1',
    codigo: 'PROD229',
    nombre: 'Huawei 400',
    categoria: 'Carcasas',
    subCategoria: 'Carcasa Mujer',
    precioBase: 25600,
    unidad: 'UND',
    estado: 'activo',
    imagen: '/placeholder-phone.png'
  },
  {
    id: '2',
    codigo: 'PROD434',
    nombre: 'Mate XT ULTIMATE DESIGN',
    categoria: 'Huawei',
    subCategoria: 'Mate XT ULTIMATE DESIGN',
    precioBase: 15600,
    unidad: 'UND',
    estado: 'activo',
    imagen: '/placeholder-phone.png'
  },
  {
    id: '3',
    codigo: 'PROD947',
    nombre: 'Motorola AX',
    categoria: 'Carcasas',
    subCategoria: 'Carcasa Mujer',
    precioBase: 43500,
    unidad: 'UND',
    estado: 'activo',
    imagen: '/placeholder-phone.png'
  },
  {
    id: '4',
    codigo: 'PROD666',
    nombre: 'Motorola AX100',
    categoria: 'Huawei',
    subCategoria: 'Mate XT ULTIMATE DESIGN',
    precioBase: 43000,
    unidad: 'UND',
    estado: 'activo',
    imagen: '/placeholder-phone.png'
  },
  {
    id: '5',
    codigo: 'PROD805',
    nombre: 'Redmi 13C',
    categoria: 'Carcasas',
    subCategoria: 'Carcasa Mujer',
    precioBase: 11200,
    unidad: 'UND',
    estado: 'activo',
    imagen: '/placeholder-phone.png'
  }
];

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('es-CO')}`;
  };

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const handleSubmitProduct = (productData: Omit<Product, 'id'>) => {
    if (showCreateModal) {
      // Crear nuevo producto
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString()
      };
      setProducts([...products, newProduct]);
      setShowCreateModal(false);
    } else if (showEditModal && selectedProduct) {
      // Editar producto existente
      setProducts(products.map(product => 
        product.id === selectedProduct.id 
          ? { ...productData, id: selectedProduct.id }
          : product
      ));
      setShowEditModal(false);
      setSelectedProduct(null);
    }
  };

  const confirmDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(product => product.id !== selectedProduct.id));
      setShowDeleteDialog(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600">Administra el catálogo de productos del sistema</p>
          </div>
        </div>
        <button
          onClick={handleCreateProduct}
          className="flex items-center space-x-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.codigo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.categoria}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.subCategoria}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatPrice(product.precioBase)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.unidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.estado === 'activo' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Ver producto"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Editar producto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Eliminar producto"
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

      {/* Diálogo de confirmación de eliminación */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Estás seguro?</h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "{selectedProduct?.nombre}" 
              y removerá todos sus datos de nuestros servidores.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualización */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Detalles del Producto</h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Cerrar</span>
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                <p className="text-sm text-gray-900">{selectedProduct.codigo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <p className="text-sm text-gray-900">{selectedProduct.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <p className="text-sm text-gray-900">{selectedProduct.categoria}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Categoría</label>
                <p className="text-sm text-gray-900">{selectedProduct.subCategoria}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Base</label>
                <p className="text-sm text-gray-900">{formatPrice(selectedProduct.precioBase)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
                <p className="text-sm text-gray-900">{selectedProduct.unidad}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedProduct.estado === 'activo' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedProduct.estado}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear producto */}
      <ProductFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitProduct}
        mode="create"
      />

      {/* Modal de editar producto */}
      <ProductFormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
        mode="edit"
      />
    </div>
  );
};

