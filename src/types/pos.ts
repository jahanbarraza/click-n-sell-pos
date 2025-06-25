
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode?: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  tax: number;
  subtotal: number;
  timestamp: Date;
  paymentMethod: 'cash' | 'card' | 'digital';
  customerName?: string;
}

export interface InventoryAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
}

export type UserRole = 'admin' | 'employee';
