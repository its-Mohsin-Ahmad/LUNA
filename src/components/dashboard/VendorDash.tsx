'use client';

/* ------------------------------------------------------------------ */
/* Vendor dashboard: store performance, inventory, fulfilment, payouts */
/* ------------------------------------------------------------------ */

import { AlertTriangle, Boxes, PackageCheck, Wallet } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatMoney, compactNumber } from '@/lib/utils';
import { StatusBadge, Badge } from '@/components/ui';
import { StatCard, PanelCard, TABLE, type DashTab } from './dashPrimitives';
import { DEMO_ORDERS, VENDOR_PRODUCTS } from './demoData';

export const VENDOR_TABS: DashTab[] = [
  { key: 'overview', label: 'Overview', icon: Boxes },
  { key: 'inventory', label: 'Inventory', icon: PackageCheck },
  { key: 'fulfilment', label: 'Fulfilment', icon: AlertTriangle },
  { key: 'payouts', label: 'Payouts', icon: Wallet },
];

const PAYOUTS = [
  { date: '2026-04-04', ref: 'PAY-0404', amount: 12480.2, status: 'Sent' },
  { date: '2026-03-28', ref: 'PAY-0328', amount: 9860.75, status: 'Sent' },
  { date: '2026-03-21', ref: 'PAY-0321', amount: 11205.4, status: 'Sent' },
  { date: '2026-03-14', ref: 'PAY-0314', amount: 8742.1, status: 'Sent' },
];

const stockBadge = (p: Product) =>
  p.stock === 0 ? (
    <Badge tone="sale">Out of stock</Badge>
  ) : p.stock <= p.lowStockAt ? (
    <Badge tone="gold">Low · {p.stock}</Badge>
  ) : (
    <Badge tone="success">In stock · {p.stock}</Badge>
  );

export function VendorDash({ tab }: { tab: string }) {
  const units = VENDOR_PRODUCTS.reduce((s, p) => s + p.soldCount, 0);
  const gmv = VENDOR_PRODUCTS.reduce((s, p) => s + p.price * p.soldCount, 0);
  const lowStock = VENDOR_PRODUCTS.filter((p) => p.stock <= p.lowStockAt).length;
  const avgRating =
    VENDOR_PRODUCTS.reduce((s, p) => s + p.rating, 0) / (VENDOR_PRODUCTS.length || 1);
  const queue = DEMO_ORDERS.filter((o) =>
    ['PENDING', 'PROCESSING', 'PACKED', 'SHIPPED'].includes(o.status)
  );

  if (tab === 'inventory') {
    return (
      <PanelCard title={`Inventory — ${VENDOR_PRODUCTS.length} SKUs`}>
        <div className={TABLE.wrap}>
          <table className={TABLE.table}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Product</th>
                <th className={TABLE.th}>SKU</th>
                <th className={TABLE.th}>Price</th>
                <th className={TABLE.th}>Stock</th>
                <th className={TABLE.th}>Sold</th>
              </tr>
            </thead>
            <tbody>
              {VENDOR_PRODUCTS.map((p) => (
                <tr key={p.id}>
                  <td className={TABLE.td}>
                    <span className="clamp-1 block max-w-[260px] font-semibold">{p.name}</span>
                    <span className="text-xs text-muted">{p.brand}</span>
                  </td>
                  <td className={TABLE.td}>
                    <span className="text-muted">{p.sku}</span>
                  </td>
                  <td className={TABLE.td}>{formatMoney(p.price)}</td>
                  <td className={TABLE.td}>{stockBadge(p)}</td>
                  <td className={TABLE.td}>{compactNumber(p.soldCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    );
  }

  if (tab === 'fulfilment') {
    return (
      <PanelCard title={`Fulfilment queue — ${queue.length} open`}>
        <div className={TABLE.wrap}>
          <table className={TABLE.table}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Order</th>
                <th className={TABLE.th}>Customer</th>
                <th className={TABLE.th}>Items</th>
                <th className={TABLE.th}>Total</th>
                <th className={TABLE.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((o) => (
                <tr key={o.id}>
                  <td className={TABLE.td}>
                    <span className="font-semibold text-forest">{o.number}</span>
                    <span className="block text-xs text-muted">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className={TABLE.td}>{o.customerName}</td>
                  <td className={TABLE.td}>{o.items.length}</td>
                  <td className={TABLE.td}>{formatMoney(o.total)}</td>
                  <td className={TABLE.td}>
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    );
  }

  if (tab === 'payouts') {
    return (
      <PanelCard title="Weekly payouts">
        <div className={TABLE.wrap}>
          <table className={TABLE.table}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Date</th>
                <th className={TABLE.th}>Reference</th>
                <th className={TABLE.th}>Amount</th>
                <th className={TABLE.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p) => (
                <tr key={p.ref}>
                  <td className={TABLE.td}>{p.date}</td>
                  <td className={TABLE.td}>
                    <span className="text-muted">{p.ref}</span>
                  </td>
                  <td className={TABLE.td}>
                    <strong>{formatMoney(p.amount)}</strong>
                  </td>
                  <td className={TABLE.td}>
                    <Badge tone="success">{p.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted">
          Payouts run every Friday in your settlement currency. Commission of 12% is deducted
          before transfer.
        </p>
      </PanelCard>
    );
  }

  /* Overview */
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Boxes} label="Active SKUs" value={String(VENDOR_PRODUCTS.length)} hint="Northbay Supply Co." />
        <StatCard icon={PackageCheck} label="Units sold" value={compactNumber(units)} hint="Lifetime" />
        <StatCard icon={Wallet} label="Lifetime GMV" value={formatMoney(gmv)} hint="Before commission" tone="forest" />
        <StatCard
          icon={AlertTriangle}
          label="Low stock"
          value={String(lowStock)}
          hint={`Avg rating ${avgRating.toFixed(1)}★`}
          tone={lowStock > 0 ? 'gold' : 'white'}
        />
      </div>

      <PanelCard
        title="Stock needing attention"
        action={<span className="text-xs text-muted">At or below reorder point</span>}
      >
        <div className={TABLE.wrap}>
          <table className={TABLE.table}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Product</th>
                <th className={TABLE.th}>Stock</th>
                <th className={TABLE.th}>Price</th>
                <th className={TABLE.th}>Sold</th>
              </tr>
            </thead>
            <tbody>
              {VENDOR_PRODUCTS.filter((p) => p.stock <= p.lowStockAt)
                .slice(0, 6)
                .map((p) => (
                  <tr key={p.id}>
                    <td className={TABLE.td}>
                      <span className="clamp-1 block max-w-[260px] font-semibold">{p.name}</span>
                    </td>
                    <td className={TABLE.td}>{stockBadge(p)}</td>
                    <td className={TABLE.td}>{formatMoney(p.price)}</td>
                    <td className={TABLE.td}>{compactNumber(p.soldCount)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </div>
  );
}