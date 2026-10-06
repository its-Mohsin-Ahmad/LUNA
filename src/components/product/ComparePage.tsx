'use client';

/* ------------------------------------------------------------------ */
/* Compare page: side-by-side attribute table for saved products       */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { GitCompare, Plus, ShoppingCart, X } from 'lucide-react';
import { useCart, usePrefs, useToast } from '@/lib/store';
import { getProductsByIds, getBestSellers } from '@/lib/data/products';
import { cn, compactNumber, formatMoney } from '@/lib/utils';
import { Button, EmptyState } from '@/components/ui';
import { Rating } from '@/components/ui/primitives';
import { SmartImage } from '@/components/ui/SmartImage';
import { ProductCard } from '@/components/product/ProductCard';

export function ComparePage() {
  const { compare, toggleCompare, clearCompare } = usePrefs();
  const { add } = useCart();
  const { success } = useToast();

  const products = getProductsByIds(compare).slice(0, 4);
  const suggestions = getBestSellers(8)
    .filter((p) => !compare.includes(p.id))
    .slice(0, 4);

  if (products.length === 0) {
    return (
      <div className="space-y-8">
        <EmptyState
          icon={<GitCompare className="h-6 w-6" />}
          title="Nothing to compare yet"
          description="Add up to four products using the compare icon on any product card — they will line up here side by side."
          action={{ label: 'Browse products', href: '/shop' }}
        />
        <div>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-forest-400">
            Best sellers to start with
          </p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {getBestSellers(4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const rows: { label: string; render: (p: (typeof products)[number]) => React.ReactNode }[] = [
    { label: 'Price', render: (p) => <strong className="text-ink">{formatMoney(p.price)}</strong> },
    { label: 'Rating', render: (p) => <Rating value={p.rating} count={p.reviewCount} size="xs" /> },
    { label: 'Brand', render: (p) => p.brand },
    { label: 'Category', render: (p) => `${p.category} · ${p.subcategory}` },
    {
      label: 'Availability',
      render: (p) =>
        p.stock === 0 ? (
          <span className="font-semibold text-sale">Out of stock</span>
        ) : p.stock <= p.lowStockAt ? (
          <span className="font-semibold text-gold">Only {p.stock} left</span>
        ) : (
          <span className="font-semibold text-forest">In stock ({p.stock})</span>
        ),
    },
    {
      label: 'Delivery',
      render: (p) =>
        `${p.deliveryDays} business day${p.deliveryDays > 1 ? 's' : ''}`,
    },
    { label: 'Free returns', render: (p) => `${p.returnDays} days` },
    { label: 'Warranty', render: (p) => (p.warrantyMonths ? `${p.warrantyMonths} months` : '—') },
    { label: 'Sold', render: (p) => compactNumber(p.soldCount) },
    { label: 'SKU', render: (p) => <span className="text-muted">{p.sku}</span> },
  ];

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto rounded-2xl border border-line bg-white thin-scrollbar">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">Side-by-side product comparison</caption>
          <thead>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="w-36 p-4 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-muted"
              >
                Product
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className="min-w-[170px] border-l border-line p-4 text-left align-top"
                >
                  <div className="relative space-y-2.5">
                    <Link href={`/product/${p.slug}`} className="block">
                      <SmartImage
                        src={p.images[0]}
                        alt={p.name}
                        seed={p.sku}
                        aspect="square"
                        wrapperClassName="h-24 w-24 rounded-xl"
                      />
                    </Link>
                    <Link
                      href={`/product/${p.slug}`}
                      className="clamp-2 block text-[13.5px] font-semibold leading-snug text-ink hover:text-forest"
                    >
                      {p.name}
                    </Link>
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<ShoppingCart className="h-3.5 w-3.5" />}
                      onClick={() => {
                        add(p.id, 1);
                        success('Added to your bag', p.name);
                      }}
                    >
                      Add to bag
                    </Button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(p.id)}
                      aria-label={`Remove ${p.name} from comparison`}
                      className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-muted shadow-soft transition hover:bg-cream hover:text-sale"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className={cn('border-b border-line', i % 2 === 1 && 'bg-warm/50')}
              >
                <th scope="row" className="p-4 text-left text-[12.5px] font-semibold text-muted">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td key={p.id} className="border-l border-line p-4 text-[13px] text-ink">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="p-4" />
              {products.map((p) => (
                <td key={p.id} className="border-l border-line p-4">
                  <Link
                    href={`/product/${p.slug}`}
                    className="text-[13px] font-bold text-forest underline-offset-4 hover:underline"
                  >
                    View details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-muted">
          Comparing {products.length} of 4 slots.
          {products.length === 4 && ' Remove one to add another product.'}
        </p>
        <Button variant="ghost" size="sm" onClick={clearCompare}>
          Clear all
        </Button>
      </div>

      {products.length < 4 && suggestions.length > 0 && (
        <div>
          <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-forest-400">
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add more to compare
          </p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {products.length >= 4 && (
        <p className="text-center text-[13px] text-muted">
          Full — or explore the whole catalogue on the{' '}
          <Link href="/shop" className="font-semibold text-forest hover:underline">
            shop
          </Link>
          .
        </p>
      )}
    </div>
  );
}