export type ProductType = 'physical' | 'pdf';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: ProductType;
  image_url: string;
  pdf_url?: string;
  created_at: string;
  is_featured: boolean;
  download_count: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
