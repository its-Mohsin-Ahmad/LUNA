/* ------------------------------------------------------------------ */
/* LUNA — Core type definitions                                        */
/* ------------------------------------------------------------------ */

export type Role = 'CUSTOMER' | 'VENDOR' | 'SALESMAN' | 'ADMIN';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'PKR' | 'INR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // relative to USD
  locale: string;
}

/* ------------------------- Catalog ------------------------- */

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  image: string;
  subcategories: Subcategory[];
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  initials: string;
  country: string;
  category: string; // category slug
  description: string;
}

export interface ProductVariant {
  id: string;
  type: 'color' | 'size' | 'style' | 'capacity' | 'flavor' | 'scent';
  label: string;
  value: string;
  swatch?: string;
  stock: number;
  priceDelta?: number;
}

export interface Spec {
  label: string;
  value: string;
}

export type ProductTag =
  | 'featured'
  | 'new'
  | 'sale'
  | 'bestseller'
  | 'eco'
  | 'exclusive'
  | 'limited';

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  price: number;
  originalPrice?: number;
  discountPct?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  lowStockAt: number;
  description: string;
  highlights: string[];
  specs: Spec[];
  images: string[];
  variants: ProductVariant[];
  tags: ProductTag[];
  weightKg: number;
  warrantyMonths?: number;
  returnDays: number;
  deliveryDays: number;
  createdAt: string; // ISO date
}

/** Compact authoring shape used by the seed data files. */
export interface ProductSeed {
  n: string; // name
  b: string; // brand
  sub: string; // subcategory slug
  p: number; // price
  op?: number; // original price
  r: number; // rating
  rc: number; // review count
  sold: number;
  s: number; // stock
  d: string; // description
  tags?: ProductTag[];
  colors?: string[];
  sizes?: string[];
  w?: number; // weight kg
  war?: number; // warranty months
}

/* ------------------------- Cart & wishlist ------------------------- */

export interface CartLine {
  productId: string;
  variantId?: string;
  qty: number;
  addedAt: number;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  qty: number;
}

/* ------------------------- Reviews ------------------------- */

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}
/* ------------------------- Orders ------------------------- */

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  variantLabel?: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  at: string;
  note: string;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  email: string;
  channel: 'WEB' | 'MOBILE' | 'SALESMAN';
  salesmanId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: 'CARD' | 'COD' | 'WALLET' | 'BANK';
  status: OrderStatus;
  createdAt: string;
  address: Address;
  timeline: OrderTimelineEntry[];
}

/* ------------------------- Users & auth ------------------------- */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar: string;
  joinedAt: string;
  addresses: Address[];
  wishlist: string[];
  verified: boolean;
}

export interface Session {
  user: User;
  token: string;
  issuedAt: number;
}

/* ------------------------- Sales & CRM ------------------------- */

export type LeadStage = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  stage: LeadStage;
  ownerId: string;
  source: 'Website' | 'Referral' | 'Event' | 'Outbound' | 'Marketplace';
  createdAt: string;
  note: string;
}

export interface SalesTarget {
  month: string;
  target: number;
  achieved: number;
}

/* ------------------------- CMS & content ------------------------- */

export interface Coupon {
  code: string;
  description: string;
  type: 'percent' | 'flat' | 'freeship';
  value: number;
  minSpend: number;
  expiresAt: string;
  active: boolean;
  usageLimit: number;
  used: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
  product: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  cta: { label: string; href: string };
  secondary: { label: string; href: string };
  image: string;
  tone: 'dark' | 'light';
  /** Hex background tint for the split hero layout. */
  bg?: string;
  /** Compact dark-green promotional panel shown top-right of the hero. */
  sale?: { kicker: string; upTo?: string; percent: string; suffix?: string };
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'order' | 'stock' | 'lead' | 'system' | 'review' | 'payout';
  at: string;
  read: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
  group: 'Orders' | 'Shipping' | 'Returns' | 'Account' | 'Payments';
}

export interface Breadcrumb {
  label: string;
  href?: string;
}