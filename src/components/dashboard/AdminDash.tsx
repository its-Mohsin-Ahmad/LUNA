'use client';

/* ------------------------------------------------------------------ */
/* Admin dashboard: platform overview, all orders, catalogue, team     */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { Bell, Boxes, LayoutDashboard, ShoppingBag, Users } from 'lucide-react';
import { DEMO_ACCOUNTS } from '@/lib/store/auth';
import { STORAGE_KEYS, readStore } from '@/lib/store/storage';
import type { Order } from '@/lib/types';
import { CATEGORIES } from '@/lib/data/categories';
import { BRANDS } from '@/lib/data/products/brands';
import { PRODUCTS, getLowStock, getBestSellers } from '@/lib/data/products';
import { formatMoney, compactNumber } from '@/lib/utils';
import { Badge, StatusBadge } from '@/components/ui';
import { StatCard, PanelCard, TABLE, type DashTab } from './dashPrimitives';
import { DEMO_ORDERS, NOTIFICATIONS } from './demoData';

export const ADMIN_TABS: DashTab[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'orders', label: 'All orders', icon: ShoppingBag },
  { key: 'catalogue', label: 'Catalogue', icon: Boxes },
  { key: 'team', label: 'Team & users', icon: Users },
];

const ROLE_TONE: Record<string, 'forest' | 'gold' | 'info' | 'neutral'> = {
  ADMIN: 'forest',
  SALESMAN: 'gold',
  VENDOR: 'info',
  CUSTOMER: 'neutral',
};

export function AdminDash({ tab }: { tab: string }) {
  const [realOrders, setRealOrders] = useState<Order[]>([]);

  useEffect(() => {
    setRealOrders(readStore<Order[]>(STORAGE_KEYS.orders, []));
  }, []);

  const allOrders = [...realOrders, ...DEMO_ORDERS];
  const gmv = allOrders.reduce((s, o) => s + o.total, 0);
  const lowStock = getLowStock(10);
  const topSellers = getBestSellers(6);

  if (tab === 'orders') {
    return (
      <PanelCard title={`Orders — ${allOrders.length} (demo + placed here)`}>
        <div className={TABLE.wrap}>
          <table className={TABLE.table}>
            <thead className={TABLE.head}>
              <tr>
                <th className={TABLE.th}>Order</th>
                <th className={TABLE.th}>Customer</th>
                <th className={TABLE.th}>Channel</th>
                <th className={TABLE.th}>Total</th>
                <th className={TABLE.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((o) => (
                <tr key={o.id}>
                  <td className={TABLE.td}>
                    <span className="font-semibold text-forest">{o.number}</span>
                    <span className="block text-xs text-muted">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className={TABLE.td}>
                    <span className="block">{o.customerName}</span>
                    <span className="text-xs text-muted">{o.email}</span>
                  </td>
                  <td className={TABLE.td}>
                    <Badge tone="neutral">{o.channel}</Badge>
                  </td>
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

  if (tab === 'catalogue') {
    return (
      <div className="space-y-6">
        <PanelCard
          title={`Low stock — ${lowStock.length} products`}
          action={<Badge tone="warning">Reorder point</Badge>}
        >
          <div className={TABLE.wrap}>
            <table className={TABLE.table}>
              <thead className={TABLE.head}>
                <tr>
                  <th className={TABLE.th}>Product</th>
                  <th className={TABLE.th}>Category</th>
                  <th className={TABLE.th}>Stock</th>
                  <th className={TABLE.th}>Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td className={TABLE.td}>
                      <span className="clamp-1 block max-w-[280px] font-semibold">{p.name}</span>
                      <span className="text-xs text-muted">{p.brand}</span>
                    </td>
                    <td className={TABLE.td}>
                      <span className="text-muted">{p.category}</span>
                    </td>
                    <td className={TABLE.td}>
                      <Badge tone={p.stock === 0 ? 'sale' : 'gold'}>{p.stock}</Badge>
                    </td>
                    <td className={TABLE.td}>{formatMoney(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>

        <PanelCard title="Top sellers">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topSellers.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl bg-warm px-3.5 py-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest text-xs font-bold text-cream">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="clamp-1 block text-[13px] font-semibold text-ink">{p.name}</span>
                  <span className="block text-xs text-muted">
                    {compactNumber(p.soldCount)} sold · {formatMoney(p.price)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    );
  }

  if (tab === 'team') {
    return (
      <div className="space-y-6">
        <PanelCard title={`Accounts — ${DEMO_ACCOUNTS.length} demo users`}>
          <div className={TABLE.wrap}>
            <table className={TABLE.table}>
              <thead className={TABLE.head}>
                <tr>
                  <th className={TABLE.th}>Name</th>
                  <th className={TABLE.th}>Email</th>
                  <th className={TABLE.th}>Role</th>
                  <th className={TABLE.th}>Title</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ACCOUNTS.map((a) => (
                  <tr key={a.id}>
                    <td className={TABLE.td}>
                      <strong>{a.name}</strong>
                    </td>
                    <td className={TABLE.td}>
                      <span className="text-muted">{a.email}</span>
                    </td>
                    <td className={TABLE.td}>
                      <Badge tone={ROLE_TONE[a.role] ?? 'neutral'}>{a.role}</Badge>
                    </td>
                    <td className={TABLE.td}>{a.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">
            Registered accounts from the demo sign-up flow are stored in this browser alongside
            these seed users.
          </p>
        </PanelCard>
      </div>
    );
  }

  /* Overview */
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Boxes} label="Products" value={String(PRODUCTS.length)} hint={`${CATEGORIES.length} categories · ${BRANDS.length} brands`} />
        <StatCard icon={ShoppingBag} label="Orders" value={String(allOrders.length)} hint="Demo + placed here" />
        <StatCard icon={LayoutDashboard} label="GMV" value={formatMoney(gmv)} hint="Across visible orders" tone="forest" />
        <StatCard icon={Users} label="Accounts" value={String(DEMO_ACCOUNTS.length)} hint="Seed demo users" />
      </div>

      <PanelCard title="Notifications" action={<Bell className="h-4 w-4 text-muted" aria-hidden />}>
        <ul className="space-y-3">
          {NOTIFICATIONS.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 rounded-xl px-3.5 py-3 ${n.read ? '' : 'bg-cream/70'}`}
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-line' : 'bg-forest'}`}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-ink">
                  {n.title}
                  {!n.read && (
                    <span className="ml-2 rounded-full bg-forest px-1.5 py-0.5 text-[9px] font-bold uppercase text-cream">
                      New
                    </span>
                  )}
                </span>
                <span className="block text-xs leading-relaxed text-muted">{n.body}</span>
                <span className="block text-[11px] text-muted/80">
                  {new Date(n.at).toLocaleString()}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </PanelCard>
    </div>
  );
}