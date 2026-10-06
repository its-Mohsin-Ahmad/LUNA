/* ------------------------------------------------------------------ */
/* Demo CRM data for the dashboard area (clearly marked, local only)   */
/* ------------------------------------------------------------------ */

import type { Lead, NotificationItem, Order, SalesTarget } from '@/lib/types';
import { PRODUCTS, getBestSellers } from '@/lib/data/products';

let seq = 0;
const mkOrder = (
  number: string,
  customerName: string,
  email: string,
  status: Order['status'],
  daysAgo: number,
  productIdx: number[],
  channel: Order['channel'] = 'WEB'
): Order => {
  const items = productIdx.map((i) => {
    const p = PRODUCTS[i % PRODUCTS.length];
    return { productId: p.id, name: p.name, image: p.images[0], price: p.price, qty: 1 };
  });
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = subtotal > 99 ? 0 : 9.9;
  const tax = +(subtotal * 0.05).toFixed(2);
  const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
  return {
    id: `ord_demo_${++seq}`,
    number,
    customerId: `usr_demo_${seq}`,
    customerName,
    email,
    channel,
    items,
    subtotal,
    discount: 0,
    shipping,
    tax,
    total: +(subtotal + shipping + tax).toFixed(2),
    paymentMethod: seq % 3 === 0 ? 'COD' : 'CARD',
    status,
    createdAt,
    address: {
      fullName: customerName,
      line1: `${100 + seq} Market Street`,
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States',
      phone: '+1 206 555 0100',
    },
    timeline: [
      { status: 'PENDING', at: createdAt, note: 'Order placed' },
      { status: 'PROCESSING', at: createdAt, note: 'Payment confirmed' },
      ...(daysAgo > 2
        ? [{ status: 'SHIPPED' as const, at: createdAt, note: 'Handed to courier' }]
        : []),
    ],
  };
};

export const DEMO_ORDERS: Order[] = [
  mkOrder('LUNA-260402-9K2M', 'Priya Sharma', 'priya@example.com', 'DELIVERED', 26, [0, 3, 7]),
  mkOrder('LUNA-260406-4H8T', 'James Okafor', 'james@example.com', 'OUT_FOR_DELIVERY', 4, [12, 15]),
  mkOrder('LUNA-260407-1D5W', 'Lena Fischer', 'lena@example.com', 'SHIPPED', 3, [20, 24, 30]),
  mkOrder('LUNA-260409-7Q3R', 'Omar Haddad', 'omar@example.com', 'PROCESSING', 1, [40, 44]),
  mkOrder('LUNA-260410-6N9Z', 'Sofia Rossi', 'sofia@example.com', 'PENDING', 0, [50]),
  mkOrder('LUNA-260405-3P7V', 'Chen Wei', 'chen@example.com', 'DELIVERED', 9, [60, 66, 72], 'MOBILE'),
  mkOrder('LUNA-260408-2M4Y', 'Ava Thompson', 'ava@example.com', 'CANCELLED', 6, [80], 'SALESMAN'),
  mkOrder('LUNA-260404-8B6X', 'Diego Alvarez', 'diego@example.com', 'DELIVERED', 12, [90, 96], 'SALESMAN'),
];

export const VENDOR_PRODUCTS = getBestSellers(16);

export const LEADS: Lead[] = [
  { id: 'lead_1', name: 'Marcus Feld', company: 'Feld & Sons Hardware', email: 'marcus@feldsons.de', phone: '+49 30 555 0142', value: 4800, stage: 'PROPOSAL', ownerId: 'usr_sales_1', source: 'Outbound', createdAt: '2026-03-18T10:00:00Z', note: 'Wants 120 units for Q3 staff gifting. Pricing sheet sent 2 days ago.' },
  { id: 'lead_2', name: 'Yuki Mori', company: 'Mori Studio', email: 'yori@moristudio.jp', phone: '+81 3 5550 0188', value: 2600, stage: 'QUALIFIED', ownerId: 'usr_sales_1', source: 'Referral', createdAt: '2026-03-25T14:30:00Z', note: 'Referred by Hanna Berg. Samples of the lighting range requested.' },
  { id: 'lead_3', name: 'Rachel Kim', company: 'Northwind Retail', email: 'rachel@northwind.co', phone: '+1 415 555 0166', value: 12500, stage: 'WON', ownerId: 'usr_sales_1', source: 'Event', createdAt: '2026-02-11T09:15:00Z', note: 'Closed after Expo West. First PO paid, reorders monthly.' },
  { id: 'lead_4', name: 'Tom Whitfield', company: 'Whitfield Outfitters', email: 'tom@whitfield.uk', phone: '+44 20 7555 0122', value: 3400, stage: 'CONTACTED', ownerId: 'usr_sales_1', source: 'Website', createdAt: '2026-04-01T16:45:00Z', note: 'Downloaded the wholesale guide — call booked for Friday.' },
  { id: 'lead_5', name: 'Ines Costa', company: 'Casa Verde', email: 'ines@casaverde.pt', phone: '+351 21 555 0199', value: 1900, stage: 'NEW', ownerId: 'usr_sales_1', source: 'Marketplace', createdAt: '2026-04-06T11:05:00Z', note: 'Inbound from the sell-on-LUNA page, home & living focus.' },
  { id: 'lead_6', name: 'Peter Novak', company: 'Novak Sports', email: 'peter@novaksport.si', phone: '+386 1 555 0111', value: 7200, stage: 'LOST', ownerId: 'usr_sales_1', source: 'Outbound', createdAt: '2026-01-30T13:20:00Z', note: 'Chose a competitor on lead time. Revisit in Q4.' },
  { id: 'lead_7', name: 'Fatima Zahra', company: 'Zahra Home', email: 'fatima@zahrahome.ae', phone: '+971 4 555 0177', value: 5600, stage: 'QUALIFIED', ownerId: 'usr_sales_1', source: 'Referral', createdAt: '2026-04-03T08:40:00Z', note: 'Dubai showroom, wants GCC exclusivity on 4 SKUs.' },
];

export const TARGETS: SalesTarget[] = [
  { month: 'Nov', target: 40000, achieved: 41200 },
  { month: 'Dec', target: 55000, achieved: 49800 },
  { month: 'Jan', target: 38000, achieved: 40100 },
  { month: 'Feb', target: 42000, achieved: 44600 },
  { month: 'Mar', target: 45000, achieved: 43900 },
  { month: 'Apr', target: 46000, achieved: 21400 },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'ntf_1', title: 'Payout sent', body: '$12,480.20 transferred to the Northbay Supply Co. account.', type: 'payout', at: '2026-04-08T09:00:00Z', read: false },
  { id: 'ntf_2', title: 'Low stock alert', body: '6 products dropped below their low-stock threshold this week.', type: 'stock', at: '2026-04-07T15:30:00Z', read: false },
  { id: 'ntf_3', title: 'New lead assigned', body: 'Ines Costa from Casa Verde was routed to your pipeline.', type: 'lead', at: '2026-04-06T11:10:00Z', read: false },
  { id: 'ntf_4', title: 'Order flagged', body: 'Order LUNA-260409-7Q3R awaits a manual fraud check.', type: 'order', at: '2026-04-05T18:45:00Z', read: true },
  { id: 'ntf_5', title: 'Review published', body: 'A 5-star review landed on the Merino Crew-Neck Sweater.', type: 'review', at: '2026-04-04T07:20:00Z', read: true },
  { id: 'ntf_6', title: 'Catalogue sync complete', body: 'All products synced with no errors at 03:00 UTC.', type: 'system', at: '2026-04-04T03:00:00Z', read: true },
];
