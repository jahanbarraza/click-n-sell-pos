import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Users, Plus, Search, Filter, Pencil, Trash2, User } from 'lucide-react';

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

interface PersonFormData {
  name: string;
  address: string;
  identification: string;
  identificationType: string;
  phone: string;
  email: string;
  type: 'Cliente' | 'Empleado' | 'Proveedor';
  status: 'Activo' | 'Inactivo';
}

const initialFormData: PersonFormData = {
  name: '',
  address: '',
  identification: '',
  identificationType: 'Cédula de Ciudadanía',
  phone: '',
  email: '',
  type: 'Cliente',
  status: 'Activo'
};

export const Persons = () => {
  const [persons, setPersons] = useState<Person[]>([
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PersonFormData>(initialFormData);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [deletingPersonId, setDeletingPersonId] = useState<string | null>(null);

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
    setFormData(initialFormData);
    setIsCreateModalOpen(true);
  };

  const handleEditPerson = (personId: string) => {
    const person = persons.find(p => p.id === personId);
    if (person) {
      setFormData({
        name: person.name,
        address: person.address,
        identification: person.identification,
        identificationType: person.identificationType,
        phone: person.phone,
        email: person.email,
        type: person.type,
        status: person.status
      });
      setEditingPersonId(personId);
      setIsEditModalOpen(true);
    }
  };

  const handleDeletePerson = (personId: string) => {
    setDeletingPersonId(personId);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateSubmit = () => {
    const newPerson: Person = {
      id: Date.now().toString(),
      ...formData
    };
    setPersons([...persons, newPerson]);
    setIsCreateModalOpen(false);
    setFormData(initialFormData);
  };

  const handleEditSubmit = () => {
    if (editingPersonId) {
      setPersons(persons.map(person => 
        person.id === editingPersonId 
          ? { ...person, ...formData }
          : person
      ));
      setIsEditModalOpen(false);
      setEditingPersonId(null);
      setFormData(initialFormData);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingPersonId) {
      setPersons(persons.filter(person => person.id !== deletingPersonId));
      setIsDeleteDialogOpen(false);
      setDeletingPersonId(null);
    }
  };

  const handleFormChange = useCallback((field: keyof PersonFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

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

  const PersonForm = React.memo(({ isEdit = false }: { isEdit?: boolean }) => {
    const formId = isEdit ? 'edit-form' : 'create-form';
    
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${formId}-name`}>Nombre Completo *</Label>
            <Input
              id={`${formId}-name`}
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              placeholder="Ingrese el nombre completo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-email`}>Correo Electrónico *</Label>
            <Input
              id={`${formId}-email`}
              type="email"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${formId}-identificationType`}>Tipo de Identificación *</Label>
            <Select value={formData.identificationType} onValueChange={(value) => handleFormChange('identificationType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cédula de Ciudadanía">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="Cédula de Extranjería">Cédula de Extranjería</SelectItem>
                <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                <SelectItem value="NIT">NIT</SelectItem>
                <SelectItem value="Consumidor Final">Consumidor Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-identification`}>Número de Identificación *</Label>
            <Input
              id={`${formId}-identification`}
              value={formData.identification}
              onChange={(e) => handleFormChange('identification', e.target.value)}
              placeholder="Número de documento"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${formId}-address`}>Dirección</Label>
          <Input
            id={`${formId}-address`}
            value={formData.address}
            onChange={(e) => handleFormChange('address', e.target.value)}
            placeholder="Dirección completa"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${formId}-phone`}>Teléfono</Label>
            <Input
              id={`${formId}-phone`}
              value={formData.phone}
              onChange={(e) => handleFormChange('phone', e.target.value)}
              placeholder="Número de teléfono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-type`}>Tipo *</Label>
            <Select value={formData.type} onValueChange={(value: 'Cliente' | 'Empleado' | 'Proveedor') => handleFormChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cliente">Cliente</SelectItem>
                <SelectItem value="Empleado">Empleado</SelectItem>
                <SelectItem value="Proveedor">Proveedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${formId}-status`}>Estado *</Label>
          <Select value={formData.status} onValueChange={(value: 'Activo' | 'Inactivo') => handleFormChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  });

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
                        <User className="h-4 w-4 text-blue-600" />
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

      {/* Create Person Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              <span>Nueva Persona</span>
            </DialogTitle>
            <DialogDescription>
              Ingresa la información de la nueva persona. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <PersonForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSubmit} className="bg-blue-600 hover:bg-blue-700">
              Crear Persona
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Person Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <Pencil className="h-4 w-4 text-blue-600" />
              </div>
              <span>Editar Persona</span>
            </DialogTitle>
            <DialogDescription>
              Modifica la información de la persona. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <PersonForm isEdit={true} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit} className="bg-blue-600 hover:bg-blue-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la persona
              y removerá todos sus datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

