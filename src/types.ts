export type Era =
  | 'WOTC 1999–2001'
  | 'EX & Classic 2003–2010'
  | 'XY Era 2014–2016'
  | 'Special & Sun & Moon';

export type ProductCategory =
  | 'Theme Deck Box'
  | 'Elite Trainer Box'
  | 'Collection Box'
  | 'Collector Tin'
  | 'Blister & Vintage Pack';

export interface Product {
  id: string;
  sku: string;
  tcgId: number;
  name: string;
  setName: string;
  year: number;
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
