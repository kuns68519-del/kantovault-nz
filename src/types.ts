export type Era =
  | 'City & Vehicles'
  | 'Architecture & Landmarks'
  | 'Space & Science'
  | 'Fantasy & Adventure';

export type ProductCategory =
  | 'Starter Set'
  | 'Vehicle Set'
  | 'Building Set'
  | 'Collector Display Set'
  | 'Bulk Brick Pack';

export interface Product {
  id: string;
  sku: string;
  code: number;
  name: string;
  setName: string;
  pieces: number;
  age: string;
  era: Era;
  category: ProductCategory;
  priceNzd: number;
  badge: string;
  shortSpec: string;
  description: string;
  contents: string[];
  condition: string;
  stock: number;
  demandScore: number;
  imageUrl: string;
  fallbackImageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderSummary {
  orderNumber: string;
  customerName: string;
  email: string;
  region: string;
  courierMethod: string;
  paymentMethod: string;
  items: CartItem[];
  subtotalNzd: number;
  shippingNzd: number;
  totalNzd: number;
  placedAt: string;
}
