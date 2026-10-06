'use client';

/* ------------------------------------------------------------------ */
/* Orders: list of the signed-in customer's orders with quick actions  */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, PackageOpen } from 'lucide-react';
import { useAuth } from '@/lib/store';
import { STORAGE_KEYS, readStore } from '@/lib/store/storage';
import type { Order } from '@/lib/types';
import { formatMoney } from '@/lib/utils';
import { StatusBadge, EmptyState } from '@/components/ui';
import { SmartImage } from '@/components/ui/SmartImage';
import { Skeleton } from '@/components/ui/feedback';

const PAYMENT_LABELS: Record<Order['paymentMethod'], string> = {
  CARD: 'Card',
  COD: 'Cash on delivery',
  WALLET: 'LUNA wallet',
  BANK: 'Bank transfer',
};

export function OrdersPanel() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const all = readStore<Order[]>(STORAGE_KEYS.orders, []);
    setOrders(
      all
        .filter((o) => o.customerId === user.id || o.customerId === 'guest')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    );
  }, [user]);

  if (orders === null) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="h-6 w-6" />}
        title="No orders yet"
        description="When you place an order it shows up here with live status, invoices and one-tap reorders."
        action={{ label: 'Start shopping', href: '/shop' }}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => {
        const itemCount = order.items.reduce((n, i) => n + i.qty, 0);
        return (
          <li
            key={order.id}
            className="rounded-2xl border border-line bg-white p-5 transition hover:border-forest/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/order-confirmation?number=${encodeURIComponent(order.number)}`}
                  className="text-sm font-bold text-forest underline-offset-4 hover:underline"
                >
                  {order.number}
                </Link>
                <StatusBadge status={order.status} />
                <span className="text-xs text-muted">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <span className="text-sm font-bold text-ink">{formatMoney(order.total)}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 4).map((item) => (
                    <span
                      key={item.productId}
                      className="block h-10 w-10 overflow-hidden rounded-lg border border-line bg-warm"
                    >
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        aspect="square"
                        wrapperClassName="h-full w-full"
                      />
                    </span>
                  ))}
                </div>
                <span className="text-[13px] text-muted">
                  {itemCount} item{itemCount === 1 ? '' : 's'} · {PAYMENT_LABELS[order.paymentMethod]}
                </span>
              </div>

              <Link
                href={`/order-confirmation?number=${encodeURIComponent(order.number)}`}
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-forest underline-offset-4 hover:underline"
              >
                Track order
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
