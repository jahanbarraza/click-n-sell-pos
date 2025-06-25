
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Tag } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export const CategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Bebidas', description: 'Bebidas frías y calientes', productCount: 12 },
    { id: '2', name: 'Comidas', description: 'Platos principales y entradas', productCount: 8 },
    { id: '3', name: 'Postres', description: 'Dulces y postres', productCount: 5 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: formData.name, description: formData.description }
          : cat
      ));
      toast({
        title: "Categoría actualizada",
        description: `${formData.name} ha sido actualizada exitosamente`
      });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        productCount: 0
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Categoría agregada",
        description: `${formData.name} ha sido agregada exitosamente`
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategories(prev => prev.filter(cat => cat.id !== category.id));
    toast({
      title: "Categoría eliminada",
      description: `${category.name} ha sido eliminada`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
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
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Actualizar' : 'Agregar'}
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
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Badge variant="secondary">
                  {category.productCount} productos
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.description && (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(category)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <Tag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
              <p className="text-muted-foreground mb-4">
                Comienza agregando categorías para organizar tus productos
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Categoría
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
