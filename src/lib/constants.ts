import type { Currency, CurrencyCode, LeadStage, OrderStatus } from './types';

/* ------------------------------- Brand ------------------------------- */

export const SITE = {
  name: 'LUNA',
  tagline: 'Shop Better. Live Better. Discover More.',
  description:
    'LUNA is a premium international marketplace for electronics, fashion, home, beauty, sports, grocery and more — curated quality, honest prices, fast worldwide delivery.',
  supportEmail: 'support@luna.shop',
  salesEmail: 'sales@luna.shop',
  phone: '+1 (800) 555-0142',
  whatsapp: '+1 (800) 555-0199',
  hours: 'Mon–Sun, 08:00 – 22:00 UTC',
  foundedYear: 2014,
  addresses: [
    { city: 'Seattle', line: '1420 Harbour Tower, 88 Pike Street', country: 'United States' },
    { city: 'Dubai', line: 'Level 21, Bay Gate Business Tower', country: 'United Arab Emirates' },
    { city: 'Karachi', line: 'Plot 22, Ocean Mall, Clifton Block 5', country: 'Pakistan' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
  ],
} as const;

/* ---------------------------- Commerce rules ---------------------------- */

export const COMMERCE = {
  freeShippingThreshold: 99,
  expressShipping: 24.5,
  standardShipping: 9.9,
  taxRate: 0.05,
  maxQtyPerLine: 10,
  flashSaleHours: 12,
  loyaltyPointsPerDollar: 1,
  pointsRedeemValue: 0.01, // $0.01 per point
} as const;

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, locale: 'en-GB' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 3.67, locale: 'en-AE' },
  { code: 'PKR', symbol: 'Rs ', name: 'Pakistani Rupee', rate: 278, locale: 'en-PK' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.3, locale: 'en-IN' },
];

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'ur', label: 'اردو' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

/* ----------------------------- Status maps ----------------------------- */

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; tone: 'amber' | 'blue' | 'violet' | 'green' | 'red' | 'slate'; hint: string }
> = {
  PENDING: { label: 'Pending', tone: 'amber', hint: 'Awaiting payment confirmation' },
  PROCESSING: { label: 'Processing', tone: 'blue', hint: 'Payment received, preparing order' },
  PACKED: { label: 'Packed', tone: 'violet', hint: 'Picked and packed in warehouse' },
  SHIPPED: { label: 'Shipped', tone: 'blue', hint: 'Handed to courier partner' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', tone: 'blue', hint: 'Courier is out for delivery' },
  DELIVERED: { label: 'Delivered', tone: 'green', hint: 'Delivered to the customer' },
  CANCELLED: { label: 'Cancelled', tone: 'red', hint: 'Order cancelled' },
  RETURNED: { label: 'Returned', tone: 'slate', hint: 'Return approved and refunded' },
};

export const ORDER_FLOW: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const LEAD_STAGE_META: Record<
  LeadStage,
  { label: string; tone: 'blue' | 'amber' | 'violet' | 'green' | 'red' }
> = {
  NEW: { label: 'New lead', tone: 'blue' },
  CONTACTED: { label: 'Contacted', tone: 'amber' },
  QUALIFIED: { label: 'Qualified', tone: 'violet' },
  PROPOSAL: { label: 'Proposal sent', tone: 'violet' },
  WON: { label: 'Won', tone: 'green' },
  LOST: { label: 'Lost', tone: 'red' },
};

export const LEAD_STAGES: LeadStage[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

/* ------------------------------ Shop filters ------------------------------ */

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'popular', label: 'Most popular' },
  { value: 'discount', label: 'Biggest discount' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export const PRICE_BANDS = [
  { id: '0-25', label: 'Under $25', min: 0, max: 25 },
  { id: '25-50', label: '$25 – $50', min: 25, max: 50 },
  { id: '50-100', label: '$50 – $100', min: 50, max: 100 },
  { id: '100-250', label: '$100 – $250', min: 100, max: 250 },
  { id: '250-1000', label: '$250 – $1,000', min: 250, max: 1000 },
  { id: '1000-inf', label: '$1,000 & above', min: 1000, max: Number.POSITIVE_INFINITY },
] as const;

export const RATING_FILTERS = [4.5, 4, 3.5] as const;

export const PAYMENT_METHODS = [
  { id: 'CARD', label: 'Credit / debit card' },
  { id: 'COD', label: 'Cash on delivery' },
  { id: 'WALLET', label: 'Digital wallet' },
  { id: 'BANK', label: 'Bank transfer' },
] as const;

export function currencyByCode(code: CurrencyCode): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}