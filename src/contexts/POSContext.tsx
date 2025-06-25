import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Product, Customer, Sale, CartItem, Category, User as POSUser } from '@/types/pos';

interface POSContextType {
  products: Product[];
  categories: Category[];
  customers: Customer[];
  users: POSUser[];
  sales: Sale[];
  cart: CartItem[];
  userRole: 'admin' | 'cashier';
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  processSale: (paymentMethod: 'cash' | 'card' | 'digital') => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addUser: (user: POSUser) => void;
  updateUser: (user: POSUser) => void;
  deleteUser: (userId: string) => void;
  getLowStockAlerts: () => Product[];
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const usePOS = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};

export const POSProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<POSUser[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Use the user role from AuthContext
  const userRole = user?.role || 'cashier';

  useEffect(() => {
    // Load data from localStorage or default values
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }

    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers));
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const storedSales = localStorage.getItem('sales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    }

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('customers', JSON.stringify(customers));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [products, categories, customers, users, sales, cart]);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const addToCart = (product: Product) => {
    const existingCartItem = cart.find(item => item.product.id === product.id);
    if (existingCartItem) {
      updateCartQuantity(product.id, existingCartItem.quantity + 1);
    } else {
      setCart([...cart, { product: product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(cart.map(item =>
      item.product.id === productId ? { ...item, quantity: quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const processSale = (paymentMethod: 'cash' | 'card' | 'digital') => {
    const saleItems = cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price
    }));

    const total = saleItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const newSale: Sale = {
      id: Math.random().toString(36).substring(7),
      items: saleItems,
      total: total,
      timestamp: new Date(),
      paymentMethod: paymentMethod
    };

    setSales([...sales, newSale]);
    setCart([]);

    // Update product stock
    saleItems.forEach(item => {
      setProducts(products.map(product =>
        product.id === item.product.id ? { ...product, stock: product.stock - item.quantity } : product
      ));
    });
  };

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (category: Category) => {
    setCategories(categories.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const addCustomer = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? customer : c));
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
  };

  const addUser = (user: POSUser) => {
    setUsers([...users, user]);
  };

  const updateUser = (user: POSUser) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const getLowStockAlerts = () => {
    return products.filter(product => product.stock <= 10);
  };

  const value = {
    products,
    categories,
    customers,
    users,
    sales,
    cart,
    userRole,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    processSale,
    addCategory,
    updateCategory,
    deleteCategory,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addUser,
    updateUser,
    deleteUser,
    getLowStockAlerts,
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};
