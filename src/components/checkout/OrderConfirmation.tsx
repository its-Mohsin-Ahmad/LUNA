'use client';

/* ------------------------------------------------------------------ */
/* Order confirmation: success hero, stage timeline, items, summary    */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  HelpCircle,
  MapPin,
  PackageCheck,
} from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types';
import { STORAGE_KEYS, readStore } from '@/lib/store/storage';
import { cn, formatMoney } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { EmptyState, LinkButton, StatusBadge } from '@/components/ui';
import { Skeleton } from '@/components/ui/feedback';

const STATUS_FLOW: { status: OrderStatus; label: string }[] = [
  { status: 'PENDING', label: 'Placed' },
  { status: 'PROCESSING', label: 'Processing' },
  { status: 'PACKED', label: 'Packed' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

const PAYMENT_LABELS: Record<Order['paymentMethod'], string> = {
  CARD: 'Card',
  COD: 'Cash on delivery',
  WALLET: 'LUNA wallet',
  BANK: 'Bank transfer',
};

function etaLabel(createdAt: string): string {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ------------------------------- Loading ------------------------------- */

function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl border border-line bg-white p-8">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="mt-5 h-7 w-64" />
        <Skeleton className="mt-2.5 h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

/* --------------------------- Order confirmation ------------------------ */

export function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const orders = readStore<Order[]>(STORAGE_KEYS.orders, []);
    setOrder(orders.find((o) => o.number === orderNumber) ?? null);
  }, [orderNumber]);

  if (order === undefined) return <LoadingState />;

  if (order === null) {
    return (
      <EmptyState
        icon={<Clock3 className="h-6 w-6" />}
        title="Order not found"
        description={
          orderNumber
            ? `We could not find order ${orderNumber} on this device. Orders are stored locally in your browser — open this page in the browser where you checked out, or browse the shop in the meantime.`
            : 'This link is missing an order number. Orders are stored locally in your browser — open the confirmation from your order history, or browse the shop in the meantime.'
        }
        action={{ label: 'Browse the shop', href: '/shop' }}
      />
    );
  }

  const terminal =
    order.status === 'CANCELLED' || order.status === 'RETURNED';
  const stageIndex = STATUS_FLOW.findIndex((s) => s.status === order.status);

  return (
    <div className="space-y-6" aria-live="polite">
      {/* Success hero */}
      <header className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div className="space-y-3">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream">
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="display text-[28px] leading-tight text-forest sm:text-[34px]">
                {terminal ? 'Order update' : 'Order confirmed'}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              {terminal
                ? `Order ${order.number} was ${order.status.toLowerCase()}. A confirmation was sent to ${order.email}.`
                : `Thank you, ${order.customerName.split(' ')[0]}! We sent a confirmation to ${order.email} and will notify you at every step. Estimated delivery: ${etaLabel(order.createdAt)}.`}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-[12.5px] font-semibold tracking-wide text-forest">
                Order {order.number}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-medium text-muted">
                {PAYMENT_LABELS[order.paymentMethod]}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-medium text-muted">
                {order.items.reduce((n, i) => n + i.qty, 0)} item
                {order.items.reduce((n, i) => n + i.qty, 0) === 1 ? '' : 's'}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:items-end">
            <LinkButton href="/shop">Continue shopping</LinkButton>
            <Link
              href="/account"
              className="text-sm font-bold text-forest underline-offset-4 hover:underline"
            >
              View my orders
            </Link>
          </div>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* Stage timeline */}
          <section
            id="timeline"
            className="rounded-2xl border border-line bg-white p-5 sm:p-6"
            aria-label="Order progress"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="display text-lg text-forest">Track your order</h2>
              <span className="text-xs font-medium text-muted">
                {terminal ? 'No further updates' : `Arriving by ${etaLabel(order.createdAt)}`}
              </span>
            </div>

            {terminal ? (
              <p className="text-sm leading-relaxed text-muted">
                This order has been {order.status.toLowerCase()}. Refunds, if applicable, land
                within 3–5 business days to the original payment method.
              </p>
            ) : (
              <ol className="grid grid-cols-3 gap-y-5 sm:grid-cols-6">
                {STATUS_FLOW.map((step, i) => {
                  const done = i < stageIndex;
                  const active = i === stageIndex;
                  return (
                    <li
                      key={step.status}
                      className="relative flex flex-col items-center gap-1.5 text-center"
                      aria-current={active ? 'step' : undefined}
                    >
                      {i > 0 && (
                        <span
                          aria-hidden
                          className={cn(
                            'absolute right-1/2 top-3.5 -z-0 hidden h-0.5 w-full sm:block',
                            done || active ? 'bg-forest' : 'bg-line'
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          'relative z-10 grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-bold',
                          done && 'border-forest bg-forest text-cream',
                          active && 'border-forest bg-white text-forest ring-4 ring-forest/10',
                          !done && !active && 'border-line bg-white text-muted'
                        )}
                      >
                        {done ? <PackageCheck className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          'text-[11px] font-semibold leading-tight',
                          done || active ? 'text-ink' : 'text-muted'
                        )}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            <ul className="mt-6 space-y-2.5 border-t border-line pt-4">
              {[...order.timeline].reverse().map((entry, i) => (
                <li key={`${entry.status}-${i}`} className="flex items-start gap-3 text-sm">
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">
                      {entry.status.charAt(0) + entry.status.slice(1).toLowerCase()}
                    </p>
                    <p className="text-[13px] leading-relaxed text-muted">{entry.note}</p>
                  </div>
                  <time className="shrink-0 text-xs text-muted">{timeLabel(entry.at)}</time>
                </li>
              ))}
            </ul>
          </section>

          {/* Items */}
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6" aria-label="Order items">
            <h2 className="display mb-4 text-lg text-forest">
              {order.items.length} item{order.items.length === 1 ? '' : 's'} in this order
            </h2>
            <ul className="divide-y divide-line">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 py-3.5 first:pt-0">
                  <Link
                    href={`/product/${item.productId}`}
                    className="block h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-warm"
                  >
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      aspect="square"
                      wrapperClassName="h-full w-full"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.productId}`}
                      className="line-clamp-1 text-sm font-semibold text-ink transition hover:text-forest"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">
                      {item.variantLabel ? `${item.variantLabel} · ` : ''}Qty {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-ink">
                    {formatMoney(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        {/* Right rail */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5" aria-label="Payment summary">
            <h2 className="display mb-4 text-lg text-forest">Summary</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatMoney(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">
                    Discount{order.couponCode ? ` · ${order.couponCode}` : ''}
                  </dt>
                  <dd className="font-semibold text-sale">−{formatMoney(order.discount)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-semibold text-ink">
                  {order.shipping === 0 ? 'Free' : formatMoney(order.shipping)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted">Tax</dt>
                <dd className="font-semibold text-ink">{formatMoney(order.tax)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
                <dt className="text-sm font-bold text-forest">Total paid</dt>
                <dd className="display text-lg text-forest">{formatMoney(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <CreditCard className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {PAYMENT_LABELS[order.paymentMethod]} · {order.paymentMethod === 'COD' ? 'pay when it arrives' : 'paid securely'}
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5" aria-label="Shipping address">
            <h2 className="display mb-3 flex items-center gap-2 text-base text-forest">
              <MapPin className="h-4 w-4 text-forest-400" aria-hidden />
              Shipping to
            </h2>
            <address className="space-y-0.5 text-sm not-italic leading-relaxed text-muted">
              <p className="font-semibold text-ink">{order.address.fullName}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>
                {order.address.city}, {order.address.state} {order.address.zip}
              </p>
              <p>{order.address.country}</p>
              <p className="pt-1 text-xs">{order.address.phone}</p>
            </address>
          </section>

          <section className="rounded-2xl border border-dashed border-line bg-cream/50 p-5" aria-label="Help">
            <h2 className="display mb-2 flex items-center gap-2 text-base text-forest">
              <HelpCircle className="h-4 w-4 text-forest-400" aria-hidden />
              Need a hand?
            </h2>
            <p className="mb-3 text-[13px] leading-relaxed text-muted">
              Questions about delivery or returns? Our team replies within 24 hours.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-bold text-forest underline-offset-4 hover:underline"
              >
                Contact support
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/account"
                className="text-sm font-bold text-forest underline-offset-4 hover:underline"
              >
                Order history
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

