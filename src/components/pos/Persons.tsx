import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  address: string;
  identification: string;
  identificationType: string;
  phone: string;
  email: string;
  type: 'Cliente' | 'Empleado' | 'Proveedor';
  status: 'Activo' | 'Inactivo';
}

export const Persons = () => {
  const [persons] = useState<Person[]>([
    {
      id: '1',
      name: 'ASHLEE CASTRO SANDOVAL',
      address: 'Calle 18B # 17F - 24',
      identification: '1045697507',
      identificationType: 'Cédula de Extranjería',
      phone: '3015678546',
      email: 'ashleecastro@gmail.com',
      type: 'Cliente',
      status: 'Activo'
    },
    {
      id: '2',
      name: 'CONSUMIDOR FINAL',
      address: 'CONSUMIDOR FINAL',
      identification: '22222222',
      identificationType: 'Consumidor Final',
      phone: '3333333333333',
      email: 'consumidorfinal@tienda.com',
      type: 'Cliente',
      status: 'Activo'
    },
    {
      id: '3',
      name: 'IVAN JESUS CASTRO RUIZ',
      address: 'CALLE 18B No 17F - 24',
      identification: '72009461',
      identificationType: 'Cédula de Extranjería',
      phone: '3003162985',
      email: 'admin@tienda.com',
      type: 'Empleado',
      status: 'Activo'
    },
    {
      id: '4',
      name: 'luz anaya',
      address: 'Cra53d#128a-41',
      identification: '26254587',
      identificationType: 'Cédula de Ciudadanía',
      phone: '5254865',
      email: '07luzca@gmail.com',
      type: 'Cliente',
      status: 'Activo'
    },
    {
      id: '5',
      name: 'SIRLEY CESPEDES',
      address: 'Calle 18B No 17F - 24',
      identification: '1045697508',
      identificationType: 'Cédula de Extranjería',
      phone: '302243805',
      email: '07luzca@gmail.com',
      type: 'Empleado',
      status: 'Activo'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPersons = persons.filter(person => {
    const matchesSearch = 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.identification.includes(searchTerm) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm);
    
    const matchesFilter = filterType === 'all' || person.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleNewPerson = () => {
    // TODO: Implementar lógica para crear nueva persona
    console.log('Crear nueva persona');
  };

  const handleEditPerson = (personId: string) => {
    // TODO: Implementar lógica para editar persona
    console.log('Editar persona:', personId);
  };

  const handleDeletePerson = (personId: string) => {
    // TODO: Implementar lógica para eliminar persona
    console.log('Eliminar persona:', personId);
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Cliente':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Empleado':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'Proveedor':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'Activo' 
      ? 'bg-green-100 text-green-800 hover:bg-green-100' 
      : 'bg-red-100 text-red-800 hover:bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Personas</h1>
            <p className="text-gray-600">Administra clientes, empleados y proveedores</p>
          </div>
        </div>
        
        <Button onClick={handleNewPerson} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Persona
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, identificación, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="Cliente">Cliente</SelectItem>
              <SelectItem value="Empleado">Empleado</SelectItem>
              <SelectItem value="Proveedor">Proveedor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Persons Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Lista de personas</CardTitle>
          <p className="text-sm text-gray-600">{filteredPersons.length} personas registrados</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Persona</TableHead>
                <TableHead>Identificación</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersons.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{person.identification}</div>
                      <div className="text-sm text-gray-500">{person.identificationType}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{person.phone}</div>
                      <div className="text-sm text-gray-500">{person.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={getTypeBadgeClass(person.type)}
                    >
                      {person.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={getStatusBadgeClass(person.status)}
                    >
                      {person.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPerson(person.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePerson(person.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

