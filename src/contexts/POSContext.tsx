import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, CartItem, Sale, UserRole } from '@/types/pos';

interface POSContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Sales
  sales: Sale[];
  completeSale: (paymentMethod: Sale['paymentMethod'], customerName?: string) => Sale;
  
  // User
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  // Calculations
  getCartTotal: () => { subtotal: number; tax: number; total: number };
  getLowStockAlerts: () => Product[];
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const TAX_RATE = 0.1; // 10% tax

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Café Americano',
    price: 2.50,
    category: 'Bebidas',
    stock: 100,
    barcode: '7501234567890',
    description: 'Café negro americano'
  },
  {
    id: '2',
    name: 'Cappuccino',
    price: 3.50,
    category: 'Bebidas',
    stock: 80,
    barcode: '7501234567891',
    description: 'Café con leche espumosa'
  },
  {
    id: '3',
    name: 'Hamburguesa Clásica',
    price: 8.99,
    category: 'Comidas',
    stock: 25,
    barcode: '7501234567892',
    description: 'Hamburguesa con carne, lechuga, tomate'
  },
  {
    id: '4',
    name: 'Pizza Margherita',
    price: 12.99,
    category: 'Comidas',
    stock: 15,
    barcode: '7501234567893',
    description: 'Pizza con tomate, mozzarella y albahaca'
  },
  {
    id: '5',
    name: 'Cheesecake',
    price: 4.99,
    category: 'Postres',
    stock: 20,
    barcode: '7501234567894',
    description: 'Pastel de queso con base de galleta'
  },
  {
    id: '6',
    name: 'Tiramisu',
    price: 5.99,
    category: 'Postres',
    stock: 5,
    barcode: '7501234567895',
    description: 'Postre italiano con café y mascarpone'
  }
];

export const POSProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('admin'); // Changed from 'employee' to 'admin'

  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: string, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (product.stock < quantity) return;
    
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= product.stock) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }
        return prev;
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.product.id === productId && quantity <= item.product.stock
        ? { ...item, quantity }
        : item
    ));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const completeSale = useCallback((paymentMethod: Sale['paymentMethod'], customerName?: string) => {
    const { subtotal, tax, total } = getCartTotal();
    const sale: Sale = {
      id: Date.now().toString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      timestamp: new Date(),
      paymentMethod,
      customerName
    };

    // Update product stock
    cart.forEach(item => {
      updateProduct(item.product.id, { 
        stock: item.product.stock - item.quantity 
      });
    });

    setSales(prev => [sale, ...prev]);
    clearCart();
    return sale;
  }, [cart, getCartTotal, updateProduct, clearCart]);

  const getLowStockAlerts = useCallback(() => {
    return products.filter(product => product.stock <= 10);
  }, [products]);

  const value: POSContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    sales,
    completeSale,
    userRole,
    setUserRole,
    getCartTotal,
    getLowStockAlerts
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
