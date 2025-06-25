
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Users, Mail, Phone } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalPurchases: number;
  lastPurchase?: Date;
}

export const CustomerManagement = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([
    { 
      id: '1', 
      name: 'Juan Pérez', 
      email: 'juan@email.com', 
      phone: '+1234567890',
      totalPurchases: 450.00,
      lastPurchase: new Date('2024-01-15')
    },
    { 
      id: '2', 
      name: 'María García', 
      email: 'maria@email.com', 
      phone: '+0987654321',
      totalPurchases: 280.50,
      lastPurchase: new Date('2024-01-10')
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "El nombre del cliente es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (editingCustomer) {
      setCustomers(prev => prev.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, name: formData.name, email: formData.email, phone: formData.phone }
          : customer
      ));
      toast({
        title: "Cliente actualizado",
        description: `${formData.name} ha sido actualizado exitosamente`
      });
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        totalPurchases: 0
      };
      setCustomers(prev => [...prev, newCustomer]);
      toast({
        title: "Cliente agregado",
        description: `${formData.name} ha sido agregado exitosamente`
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setEditingCustomer(null);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
    toast({
      title: "Cliente eliminado",
      description: `${customer.name} ha sido eliminado`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Clientes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Editar Cliente' : 'Agregar Cliente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingCustomer ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(customer => (
          <Card key={customer.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                </div>
                <Badge variant="secondary">
                  ${customer.totalPurchases.toFixed(2)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.email && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
              )}

              {customer.lastPurchase && (
                <p className="text-xs text-muted-foreground">
                  Última compra: {customer.lastPurchase.toLocaleDateString()}
                </p>
              )}

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(customer)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(customer)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No hay clientes</h3>
              <p className="text-muted-foreground mb-4">
                Comienza agregando clientes para gestionar mejor tus ventas
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Cliente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
