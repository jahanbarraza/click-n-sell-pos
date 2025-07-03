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
  cashRegisterOpen: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  processSale: (paymentMethod: 'cash' | 'card' | 'digital') => void;
  completeSale: (paymentMethod: 'cash' | 'card' | 'digital', customerName?: string) => Sale;
  getCartTotal: () => { subtotal: number; tax: number; total: number };
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
  openCashRegister: (initialAmount: number) => void;
  closeCashRegister: () => void;
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
  const [cashRegisterOpen, setCashRegisterOpen] = useState<boolean>(false);

  // Use the user role from AuthContext
  const userRole = user?.role || 'cashier';

  useEffect(() => {
    // Load data from localStorage or set default values
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Set default products if none exist
      const defaultProducts: Product[] = [
        {
          id: '1',
          name: 'Coca Cola 350ml',
          price: 2500,
          category: 'Bebidas',
          stock: 50,
          barcode: '7501234567890',
          description: 'Refresco de cola 350ml'
        },
        {
          id: '2',
          name: 'Pan Integral',
          price: 3200,
          category: 'Panadería',
          stock: 25,
          barcode: '7501234567891',
          description: 'Pan integral familiar'
        },
        {
          id: '3',
          name: 'Leche Entera 1L',
          price: 4500,
          category: 'Lácteos',
          stock: 30,
          barcode: '7501234567892',
          description: 'Leche entera pasteurizada 1 litro'
        },
        {
          id: '4',
          name: 'Arroz Blanco 1kg',
          price: 5800,
          category: 'Granos',
          stock: 20,
          barcode: '7501234567893',
          description: 'Arroz blanco premium 1kg'
        },
        {
          id: '5',
          name: 'Aceite Vegetal 500ml',
          price: 6200,
          category: 'Aceites',
          stock: 15,
          barcode: '7501234567894',
          description: 'Aceite vegetal para cocinar 500ml'
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
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

    const storedCashRegister = localStorage.getItem('cashRegisterOpen');
    if (storedCashRegister) {
      setCashRegisterOpen(JSON.parse(storedCashRegister));
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
    localStorage.setItem('cashRegisterOpen', JSON.stringify(cashRegisterOpen));
  }, [products, categories, customers, users, sales, cart, cashRegisterOpen]);

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

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const completeSale = (paymentMethod: 'cash' | 'card' | 'digital', customerName?: string): Sale => {
    const saleItems = cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { subtotal, tax, total } = getCartTotal();

    const newSale: Sale = {
      id: Math.random().toString(36).substring(7),
      items: saleItems,
      subtotal: subtotal,
      tax: tax,
      total: total,
      timestamp: new Date(),
      paymentMethod: paymentMethod,
      customerName: customerName
    };

    setSales([...sales, newSale]);
    setCart([]);

    // Update product stock
    saleItems.forEach(item => {
      setProducts(prevProducts => prevProducts.map(product =>
        product.id === item.product.id ? { ...product, stock: product.stock - item.quantity } : product
      ));
    });

    return newSale;
  };

  const processSale = (paymentMethod: 'cash' | 'card' | 'digital') => {
    const saleItems = cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { subtotal, tax, total } = getCartTotal();

    const newSale: Sale = {
      id: Math.random().toString(36).substring(7),
      items: saleItems,
      subtotal: subtotal,
      tax: tax,
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

  const openCashRegister = (initialAmount: number) => {
    setCashRegisterOpen(true);
  };

  const closeCashRegister = () => {
    setCashRegisterOpen(false);
  };

  const value = {
    products,
    categories,
    customers,
    users,
    sales,
    cart,
    userRole,
    cashRegisterOpen,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    processSale,
    completeSale,
    getCartTotal,
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
    openCashRegister,
    closeCashRegister,
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};
