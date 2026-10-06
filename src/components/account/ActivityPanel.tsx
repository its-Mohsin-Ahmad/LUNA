'use client';

/* ------------------------------------------------------------------ */
/* Activity & alerts: searches, compare, recent views, notifications   */
/* ------------------------------------------------------------------ */

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Bell, History, Search, Sparkles } from 'lucide-react';
import { usePrefs, useToast } from '@/lib/store';
import { getProductsByIds } from '@/lib/data/products';
import { Button } from '@/components/ui';
import { SmartImage } from '@/components/ui/SmartImage';

function Row({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="display mb-3 flex items-center gap-2 text-base text-forest">
        <span className="text-forest-400">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const ALERTS = [
  {
    key: 'orderUpdates' as const,
    label: 'Order updates',
    note: 'Shipping, delivery and return notifications',
  },
  {
    key: 'emailOptIn' as const,
    label: 'Newsletter & drops',
    note: 'Weekly edit, early access and member-only deals',
  },
  {
    key: 'smsOptIn' as const,
    label: 'SMS alerts',
    note: 'Text me about price drops on wishlisted items',
  },
];

export function ActivityPanel() {
  const { searches, clearSearches, compare, clearCompare, recent, clearRecent, prefs, setPref } =
    usePrefs();
  const toast = useToast();

  const compareProducts = getProductsByIds(compare);
  const recentProducts = getProductsByIds(recent);

  return (
    <div className="space-y-5">
      {/* Notifications */}
      <Row icon={<Bell className="h-4 w-4" aria-hidden />} title="Alerts & newsletter">
        <ul className="divide-y divide-line">
          {ALERTS.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-0"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                <p className="text-[13px] text-muted">{item.note}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[item.key]}
                aria-label={item.label}
                onClick={() => {
                  const next = !prefs[item.key];
                  setPref(item.key, next);
                  toast.success(
                    next ? 'Turned on' : 'Turned off',
                    `${item.label} ${next ? 'enabled' : 'paused'}.`
                  );
                }}
                className={
                  prefs[item.key]
                    ? 'relative h-6 w-11 shrink-0 rounded-full bg-forest transition'
                    : 'relative h-6 w-11 shrink-0 rounded-full bg-line transition'
                }
              >
                <span
                  aria-hidden
                  className={
                    prefs[item.key]
                      ? 'absolute left-0.5 top-0.5 h-5 w-5 translate-x-5 rounded-full bg-white shadow transition-transform'
                      : 'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform'
                  }
                />
              </button>
            </li>
          ))}
        </ul>
      </Row>
      {/* Searches */}
      <Row icon={<Search className="h-4 w-4" aria-hidden />} title="Recent searches">
        {searches.length === 0 ? (
          <p className="text-[13px] text-muted">
            No searches yet — your latest terms appear here.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {searches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-line bg-warm px-3 py-1.5 text-[13px] font-medium text-ink transition hover:border-forest hover:text-forest"
              >
                {term}
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={clearSearches}>
              Clear
            </Button>
          </div>
        )}
      </Row>

      {/* Compare */}
      <Row icon={<Sparkles className="h-4 w-4" aria-hidden />} title="Compare list">
        {compareProducts.length === 0 ? (
          <p className="text-[13px] text-muted">
            Add up to 4 products to the compare list from any product card.
          </p>
        ) : (
          <div className="space-y-3">
            <ul className="flex flex-wrap gap-3">
              {compareProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-warm/60 p-2 pr-3"
                >
                  <span className="block h-10 w-10 overflow-hidden rounded-lg border border-line bg-white">
                    <SmartImage
                      src={product.images[0]}
                      alt={product.name}
                      aspect="square"
                      wrapperClassName="h-full w-full"
                    />
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="max-w-40 truncate text-[13px] font-semibold text-ink hover:text-forest"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Clear compare list
            </Button>
          </div>
        )}
      </Row>

      {/* Recently viewed */}
      <Row icon={<History className="h-4 w-4" aria-hidden />} title="Recently viewed">
        {recentProducts.length === 0 ? (
          <p className="text-[13px] text-muted">Products you view will show up here.</p>
        ) : (
          <div className="space-y-3">
            <ul className="flex flex-wrap gap-3">
              {recentProducts.slice(0, 8).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    className="block h-14 w-14 overflow-hidden rounded-xl border border-line bg-warm transition hover:border-forest"
                    title={product.name}
                  >
                    <SmartImage
                      src={product.images[0]}
                      alt={product.name}
                      aspect="square"
                      wrapperClassName="h-full w-full"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" onClick={clearRecent}>
              Clear history
            </Button>
          </div>
        )}
      </Row>
    </div>
  );
}
