export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string[];
  isAvailable: boolean;
  status: 'active' | 'inactive';
}
