'use client';

/* ------------------------------------------------------------------ */
/* Customer dashboard: overview, orders, saved items                   */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Package, PiggyBank, ShoppingBag, Sparkles } from 'lucide-react';
import { useAuth, usePrefs } from '@/lib/store';
import { STORAGE_KEYS, readStore } from '@/lib/store/storage';
import type { Order } from '@/lib/types';
import { COMMERCE } from '@/lib/constants';
import { formatMoney } from '@/lib/utils';
import { StatusBadge } from '@/components/ui';
import { EmptyState } from '@/components/ui/feedback';
import { StatCard, PanelCard, TABLE, type DashTab } from './dashPrimitives';
import { OrdersPanel } from '@/components/account/OrdersPanel';
import { WishlistPanel } from '@/components/account/WishlistPanel';

export const CUSTOMER_TABS: DashTab[] = [
  { key: 'overview', label: 'Overview', icon: ShoppingBag },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'saved', label: 'Saved items', icon: Heart },
];

export function CustomerDash({ tab }: { tab: string }) {
  const { user } = useAuth();
  const { wishlist } = usePrefs();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    const all = readStore<Order[]>(STORAGE_KEYS.orders, []);
    setOrders(
      all
        .filter((o) => o.customerId === user.id || o.customerId === 'guest')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
  }, [user]);

  if (tab === 'orders') return <OrdersPanel />;
  if (tab === 'saved') return <WishlistPanel />;

  const spend = orders.reduce((s, o) => s + o.total, 0);
  const points = Math.floor(spend * COMMERCE.loyaltyPointsPerDollar);
  const recent = orders.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="Orders" value={String(orders.length)} hint="All time" />
        <StatCard icon={PiggyBank} label="Lifetime spend" value={formatMoney(spend)} hint="Including shipping" />
        <StatCard icon={Heart} label="Saved items" value={String(wishlist.length)} hint="On your wishlist" />
        <StatCard icon={Sparkles} label="Loyalty points" value={formatMoney(points)} hint={`${COMMERCE.loyaltyPointsPerDollar} pt per $1`} tone="forest" />
      </div>

      <PanelCard
        title="Recent orders"
        action={
          recent.length > 0 ? (
            <Link href="/account/orders" className="text-[13px] font-bold text-forest hover:underline">
              View all
            </Link>
          ) : undefined
        }
      >
        {recent.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="No orders yet"
            description="Your first order will show up here with live status and one-tap reorder."
            action={{ label: 'Start shopping', href: '/shop' }}
          />
        ) : (
          <div className={TABLE.wrap}>
            <table className={TABLE.table}>
              <thead className={TABLE.head}>
                <tr>
                  <th className={TABLE.th}>Order</th>
                  <th className={TABLE.th}>Date</th>
                  <th className={TABLE.th}>Total</th>
                  <th className={TABLE.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td className={TABLE.td}>
                      <Link
                        href={`/order-confirmation?number=${encodeURIComponent(o.number)}`}
                        className="font-semibold text-forest hover:underline"
                      >
                        {o.number}
                      </Link>
                    </td>
                    <td className={TABLE.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className={TABLE.td}>{formatMoney(o.total)}</td>
                    <td className={TABLE.td}>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>

      <PanelCard title="Jump to">
        <div className="flex flex-wrap gap-3">
          <Link href="/account/orders" className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-ink transition hover:border-forest hover:bg-cream">
            All orders
          </Link>
          <Link href="/account/addresses" className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-ink transition hover:border-forest hover:bg-cream">
            Addresses
          </Link>
          <Link href="/track-order" className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-ink transition hover:border-forest hover:bg-cream">
            Track a parcel
          </Link>
          <Link href="/compare" className="rounded-md border border-line px-4 py-2 text-[13px] font-semibold text-ink transition hover:border-forest hover:bg-cream">
            Compare products
          </Link>
        </div>
      </PanelCard>
    </div>
  );
}