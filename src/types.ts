export type CategorySlug =
  | 'women'
  | 'men'
  | 'kids'
  | 'home-decor'
  | 'jewellery'
  | 'skin-hair'
  | 'gifts-crafts'
  | 'wedding'
  | 'winter-26'
  | 'online-sale';

export interface Product {
  id: string;
  sku: string;
  name: string;
  subBrand: 'Naiem Arong' | 'NA Studio' | 'NA Heritage' | 'NA Noir';
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  description: string;
  fabricOrMaterial: string;
  sizes: string[];
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  onSale: boolean;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  tagline: string;
  visible: boolean;
  sortOrder: number;
}

export interface HeroBanner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  targetCategory: string;
  image: string;
  theme: 'dark' | 'light' | 'crimson';
  active: boolean;
  sortOrder: number;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  ctaLabel: string;
  targetCategory: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  selectedSize: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  paymentMethod: 'Cash on Delivery' | 'bKash / Nagad' | 'Card Payment';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email?: string;
  phone?: string;
  region: 'Bangladesh' | 'Outside Bangladesh';
  createdAt: string;
}

export interface StorefrontPayload {
  products: Product[];
  categories: CategoryItem[];
  heroBanners: HeroBanner[];
  promoBanners: PromoBanner[];
}

export interface AdminOverviewPayload extends StorefrontPayload {
  orders: Order[];
  subscribers: Subscriber[];
}
