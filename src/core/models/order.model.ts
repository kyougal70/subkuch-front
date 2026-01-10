export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  productDescription: string;
  productCategory: string;
  qty: number;
  price: number;
  totalPrice: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  netPrice: number;
  customerName: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  userId: number | undefined
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  qty: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  netPrice: number;
  status: string;
  createdAt: string;
}

