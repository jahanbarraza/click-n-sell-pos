
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Store } from '@/types/organization';

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (store: Omit<Store, 'id' | 'createdAt'>) => void;
  store?: Store | null;
}

export const StoreFormModal = ({ isOpen, onClose, onSubmit, store }: StoreFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    companyId: '1',
    companyName: 'Comidas Rapidas BigMax',
    city: '',
    address: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        code: store.code,
        companyId: store.companyId,
        companyName: store.companyName,
        city: store.city,
        address: store.address,
        phone: store.phone,
        email: store.email,
        status: store.status
      });
    } else {
      setFormData({
        name: '',
        code: '',
        companyId: '1',
        companyName: 'Comidas Rapidas BigMax',
        city: '',
        address: '',
        phone: '',
        email: '',
        status: 'active'
      });
    }
  }, [store, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {store ? 'Editar Tienda' : 'Nueva Tienda'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Tienda</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Calle 30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="Ej: 2546"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Compañía</Label>
            <Select value={formData.companyId} onValueChange={(value) => {
              handleInputChange('companyId', value);
              handleInputChange('companyName', 'Comidas Rapidas BigMax');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar compañía" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Comidas Rapidas BigMax</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Ej: Barranquilla"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Ej: Calle 26 #15-25"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Ej: 3022243805"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Ej: tienda@empresa.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {store ? 'Actualizar' : 'Crear'} Tienda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
