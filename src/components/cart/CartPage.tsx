'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart, usePrefs } from '@/lib/store';
import { formatMoney } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button, EmptyState } from '@/components/ui';
import { QuantityStepper } from '@/components/ui/feedback';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { getBestSellers } from '@/lib/data/products';

export function CartPage() {
  const { items, totals, setQty, remove, clear, coupon, applyCoupon, removeCoupon, discount } =
    useCart();
  const { currency } = usePrefs();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(code);
    setError(result.ok ? null : result.message);
    if (result.ok) setCode('');
  };

  if (items.length === 0) {
    return (
      <div className="space-y-10">
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Your bag is empty"
          description="Nothing here yet. Browse the collections and add something you love. Free delivery on orders over $99."
          action={{ label: 'Start shopping', href: '/shop' }}
        />
        <ProductCarousel
          eyebrow="Popular now"
          title="Best sellers"
          products={getBestSellers(10)}
          href="/shop?sort=popular"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="display text-xl text-forest">
            {totals.itemCount} item{totals.itemCount === 1 ? '' : 's'}
          </h2>
          <button
            type="button"
            onClick={clear}
            className="text-[13px] font-semibold text-muted underline underline-offset-2 transition hover:text-sale"
          >
            Clear bag
          </button>
        </div>

        <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
          {items.map((item) => (
            <CartLine
              key={`${item.product.id}-${item.variant?.id ?? 'd'}`}
              item={item}
              onQty={(n) => setQty(item.product.id, n, item.variant?.id)}
              onRemove={() => remove(item.product.id, item.variant?.id)}
            />
          ))}
        </ul>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
        >
          Continue shopping
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <CartSummary
        coupon={coupon}
        code={code}
        error={error}
        discount={discount}
        onCodeChange={(v) => {
          setCode(v);
          setError(null);
        }}
        onSubmitCoupon={submitCoupon}
        onRemoveCoupon={removeCoupon}
      />
    </div>
  );
}

type CartItem = ReturnType<typeof useCart>['items'][number];

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={accent ? 'font-semibold tabular-nums text-forest' : 'tabular-nums text-ink'}>
        {value}
      </dd>
    </div>
  );
}
function CartLine({
  item,
  onQty,
  onRemove,
}: {
  item: CartItem;
  onQty: (n: number) => void;
  onRemove: () => void;
}) {
  const { currency } = usePrefs();
  return (
    <li className="flex gap-4 p-4 sm:p-5">
      <Link href={`/product/${item.product.slug}`} className="shrink-0">
        <SmartImage
          src={item.product.images[0]}
          alt={item.product.name}
          seed={item.product.sku}
          aspect="square"
          wrapperClassName="h-24 w-24 rounded-xl sm:h-28 sm:w-28"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {item.product.brand}
            </p>
            <Link
              href={`/product/${item.product.slug}`}
              className="clamp-2 text-sm font-semibold leading-snug text-ink transition hover:text-forest sm:text-[15px]"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="mt-0.5 text-xs text-muted">
                {item.variant.label}: {item.variant.value}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.product.name} from bag`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted transition hover:bg-red-50 hover:text-sale"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={item.qty}
            max={item.variant?.stock ?? item.product.stock}
            onChange={onQty}
            label={`Quantity for ${item.product.name}`}
          />
          <div className="text-right">
            <p className="text-[15px] font-bold tabular-nums text-ink">
              {formatMoney(item.product.price * item.qty, currency)}
            </p>
            {item.product.originalPrice && (
              <p className="text-[11px] tabular-nums text-muted line-through">
                {formatMoney(item.product.originalPrice * item.qty, currency)}
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
/* __SUMMARY__ */
function CartSummary({
  coupon,
  code,
  error,
  discount,
  onCodeChange,
  onSubmitCoupon,
  onRemoveCoupon,
}: {
  coupon: string | null;
  code: string;
  error: string | null;
  discount: number;
  onCodeChange: (v: string) => void;
  onSubmitCoupon: (e: React.FormEvent) => void;
  onRemoveCoupon: () => void;
}) {
  const { totals } = useCart();
  const { currency } = usePrefs();

  return (
    <aside className="lg:sticky lg:top-[152px] lg:self-start">
      <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
        <h2 className="display text-lg text-forest">Order summary</h2>

        <form onSubmit={onSubmitCoupon} className="space-y-1.5">
          <label htmlFor="page-coupon" className="text-[13px] font-semibold text-ink">
            Promo code
          </label>
          {coupon ? (
            <div className="flex items-center justify-between gap-3 rounded-md border border-forest/20 bg-cream px-3 py-2.5">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-forest">
                <Tag className="h-3.5 w-3.5" />
                {coupon}
              </p>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-xs font-semibold text-muted hover:text-sale"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  id="page-coupon"
                  value={code}
                  onChange={(e) => onCodeChange(e.target.value)}
                  placeholder="LUNA10"
                  className="h-10 flex-1 rounded-md border border-line px-3 text-sm uppercase tracking-wide focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
                />
                <Button type="submit" size="sm" variant="outline" disabled={!code.trim()}>
                  Apply
                </Button>
              </div>
              {error && (
                <p className="text-xs font-medium text-sale" role="alert">
                  {error}
                </p>
              )}
            </>
          )}
        </form>

        <dl className="space-y-2 border-t border-line pt-4 text-sm">
          <Row label="Subtotal" value={formatMoney(totals.subtotal, currency)} />
          {discount > 0 && (
            <Row label="Promo discount" value={`-${formatMoney(discount, currency)}`} accent />
          )}
          <Row
            label="Delivery"
            value={totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping, currency)}
          />
          <Row label="Estimated tax" value={formatMoney(totals.tax, currency)} />
          <div className="flex items-center justify-between border-t border-line pt-3 text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatMoney(totals.total, currency)}</dd>
          </div>
        </dl>

        {!totals.qualifiesForFreeShipping && (
          <p className="rounded-md bg-cream px-3 py-2.5 text-[12.5px] text-forest">
            Add {formatMoney(totals.freeShippingGap, currency)} more for free delivery.
          </p>
        )}

        <Link
          href="/checkout"
          className="block w-full rounded-md bg-forest py-3.5 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-forest-600"
        >
          Proceed to checkout
        </Link>

        <ul className="space-y-2 pt-1 text-[12.5px] text-muted">
          <li className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-forest" />
            Secure checkout: card, wallet or cash on delivery
          </li>
          <li className="flex items-center gap-2">
            <RotateCcw className="h-3.5 w-3.5 shrink-0 text-forest" />
            Free returns within 30 days
          </li>
          <li className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 shrink-0 text-forest" />
            Dispatched within 24 hours
          </li>
        </ul>
      </div>
    </aside>
  );
}
/* __REST__ */