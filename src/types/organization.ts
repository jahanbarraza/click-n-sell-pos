
export interface Company {
  id: string;
  name: string;
  country: string;
  nit: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  companyId: string;
  companyName: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}
