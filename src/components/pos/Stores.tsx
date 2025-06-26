import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StoreFormModal } from './StoreFormModal';
import { Store, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Store as StoreType } from '@/types/organization';

export const Stores = () => {
  const [stores, setStores] = useState<StoreType[]>([
    {
      id: '1',
      name: 'Calle 30',
      code: '2546',
      companyId: '1',
      companyName: 'Comidas Rapidas BigMax',
      city: 'Barranquilla',
      address: 'calle26#15-25',
      phone: '3022243805',
      email: '07luzca@gmail.com',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Hipódromo',
      code: 'TIENDA14',
      companyId: '1',
      companyName: 'Comidas Rapidas BigMax',
      city: 'Cali',
      address: 'Centro Comercial Andino',
      phone: '3000000000',
      email: 'admin@techcell.com',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Los Robles',
      code: '25525',
      companyId: '1',
      companyName: 'Comidas Rapidas BigMax',
      city: 'Bogotá, D.C.',
      address: 'Cra53d#128a-41',
      phone: '3022243805',
      email: '07luzca@gmail.com',
      status: 'active',
      createdAt: new Date()
    },
    {
      id: '4',
      name: 'Ciudadela 20 Julio',
      code: '25526',
      companyId: '1',
      companyName: 'Comidas Rapidas BigMax',
      city: 'Santa Marta',
      address: 'Calle 15 #22-30',
      phone: '3022243806',
      email: 'ciudadela@bigmax.com',
      status: 'active',
      createdAt: new Date()
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStore = (storeData: Omit<StoreType, 'id' | 'createdAt'>) => {
    const newStore: StoreType = {
      ...storeData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date()
    };
    setStores([...stores, newStore]);
    setIsModalOpen(false);
  };

  const handleEditStore = (storeData: Omit<StoreType, 'id' | 'createdAt'>) => {
    if (selectedStore) {
      const updatedStore: StoreType = {
        ...storeData,
        id: selectedStore.id,
        createdAt: selectedStore.createdAt
      };
      setStores(stores.map(store => 
        store.id === selectedStore.id ? updatedStore : store
      ));
      setSelectedStore(null);
      setIsModalOpen(false);
    }
  };

  const handleDeleteStore = (storeId: string) => {
    setStores(stores.filter(store => store.id !== storeId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Tiendas</h1>
            <p className="text-gray-600">Administra las tiendas del sistema</p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tienda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Tiendas</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar tiendas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {stores.length} tienda{stores.length !== 1 ? 's' : ''} registrada{stores.length !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Compañía</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.code}</TableCell>
                  <TableCell>{store.companyName}</TableCell>
                  <TableCell>{store.city}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>{store.phone}</TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>
                    <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                      {store.status === 'active' ? 'activo' : 'inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStore(store);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteStore(store.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStores.length === 0 && (
            <div className="text-center py-8">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron tiendas</p>
            </div>
          )}
        </CardContent>
      </Card>

      <StoreFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStore(null);
        }}
        onSubmit={selectedStore ? handleEditStore : handleAddStore}
        store={selectedStore}
      />
    </div>
  );
};
