import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, Plus, Pencil, Trash2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  company: string;
  type: 'Sistema' | 'Empresa';
}

export const Roles = () => {
  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrador',
      description: 'Administrador',
      company: 'Global',
      type: 'Sistema'
    },
    {
      id: '2',
      name: 'Gerente',
      description: 'Acceso a reportes y gestión',
      company: 'Global',
      type: 'Empresa'
    },
    {
      id: '3',
      name: 'Sistemas',
      description: 'Sistemas',
      company: 'Global',
      type: 'Sistema'
    },
    {
      id: '4',
      name: 'Técnico',
      description: 'Acceso a servicios técnicos',
      company: 'Global',
      type: 'Empresa'
    },
    {
      id: '5',
      name: 'Vendedor',
      description: 'Acceso a ventas y clientes',
      company: 'Global',
      type: 'Empresa'
    }
  ]);

  const handleNewRole = () => {
    // TODO: Implementar lógica para crear nuevo rol
    console.log('Crear nuevo rol');
  };

  const handleEditRole = (roleId: string) => {
    // TODO: Implementar lógica para editar rol
    console.log('Editar rol:', roleId);
  };

  const handleDeleteRole = (roleId: string) => {
    // TODO: Implementar lógica para eliminar rol
    console.log('Eliminar rol:', roleId);
  };

  const getTypeBadgeVariant = (type: string) => {
    return type === 'Sistema' ? 'secondary' : 'default';
  };

  const getTypeBadgeClass = (type: string) => {
    return type === 'Sistema' 
      ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' 
      : 'bg-green-100 text-green-800 hover:bg-green-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Roles</h1>
            <p className="text-gray-600">Administra los roles y permisos del sistema</p>
          </div>
        </div>
        
        <Button onClick={handleNewRole} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Rol
        </Button>
      </div>

      {/* Roles Table Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Lista de roles</CardTitle>
          <p className="text-sm text-gray-600">{roles.length} Roles registrados</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Compañía</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{role.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{role.description}</TableCell>
                  <TableCell className="text-gray-600">{role.company}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getTypeBadgeVariant(role.type)}
                      className={getTypeBadgeClass(role.type)}
                    >
                      {role.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role.id)}
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
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

