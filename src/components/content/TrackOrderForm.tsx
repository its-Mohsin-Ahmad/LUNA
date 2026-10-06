'use client';

/* ------------------------------------------------------------------ */
/* Track order — local lookup of an order number + email               */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, PackageSearch, SearchX } from 'lucide-react';
import { STORAGE_KEYS, readStore } from '@/lib/store/storage';
import type { Order } from '@/lib/types';
import { formatMoney } from '@/lib/utils';
import { Button, Input, StatusBadge } from '@/components/ui';

export function TrackOrderForm() {
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Order | null | undefined>(undefined);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (number.trim().length < 4) next.number = 'Enter the order number from your confirmation';
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter the email used at checkout';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const orders = readStore<Order[]>(STORAGE_KEYS.orders, []);
    const clean = number.trim().toUpperCase();
    const match = orders.find(
      (o) => o.number.toUpperCase() === clean && o.email.toLowerCase() === email.trim().toLowerCase()
    );
    setResult(match ?? null);
  };

  if (result) {
    return (
      <div className="space-y-5 rounded-2xl border border-line bg-white p-6" aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-forest-400">
              Order {result.number}
            </p>
            <p className="mt-1 text-sm text-muted">
              Placed {new Date(result.createdAt).toLocaleDateString()} ·{' '}
              {result.items.length} item{result.items.length === 1 ? '' : 's'} ·{' '}
              {formatMoney(result.total)}
            </p>
          </div>
          <StatusBadge status={result.status} />
        </div>

        <ol className="space-y-2 border-t border-line pt-4">
          {[...result.timeline].reverse().map((entry, i) => (
            <li key={`${entry.status}-${entry.at}`} className="flex gap-3 text-[13px]">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === 0 ? 'bg-forest' : 'bg-line'}`}
                aria-hidden
              />
              <span>
                <strong className="text-ink">{entry.status.replace(/_/g, ' ').toLowerCase()}</strong>{' '}
                — <span className="text-muted">{entry.note}</span>{' '}
                <span className="text-muted">({new Date(entry.at).toLocaleString()})</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4">
          <Link
            href={`/order-confirmation?number=${encodeURIComponent(result.number)}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline"
          >
            Full order details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setResult(undefined)}>
            Track another order
          </Button>
        </div>
      </div>
    );
  }

  if (result === null) {
    return (
      <div className="space-y-5 rounded-2xl border border-sale/40 bg-sale/5 p-6" aria-live="polite">
        <p className="flex items-center gap-2 text-sm font-bold text-sale">
          <SearchX className="h-4 w-4" aria-hidden />
          No matching order
        </p>
        <p className="text-[13px] leading-relaxed text-muted">
          Nothing matched <strong className="text-ink">{number}</strong> with that email. Orders are
          stored in this browser for the demo — use the address you checked out with, or place a
          test order to try the flow.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm" onClick={() => setResult(undefined)}>
            Try again
          </Button>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline"
          >
            Browse the shop
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Order number"
          required
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          error={errors.number}
          placeholder="LUNA-260415-8F3K"
          icon={<PackageSearch className="h-4 w-4" />}
        />
        <Input
          label="Email at checkout"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <Button type="submit" variant="primary" icon={<SearchX className="h-4 w-4" />}>
        Track my order
      </Button>
    </form>
  );
}