'use client';

/* ------------------------------------------------------------------ */
/* Cart drawer                                                         */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Tag, Truck, ShoppingBag } from 'lucide-react';
import { useCart, usePrefs } from '@/lib/store';
import { COMMERCE } from '@/lib/constants';
import { formatMoney } from '@/lib/utils';
import { Drawer } from '@/components/ui/overlays';
import { Button } from '@/components/ui/primitives';
import { QuantityStepper, EmptyState } from '@/components/ui/feedback';
import { SmartImage } from '@/components/ui/SmartImage';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, totals, coupon, applyCoupon, removeCoupon } = useCart();
  const { currency } = usePrefs();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const progress = Math.min(100, (totals.subtotal / COMMERCE.freeShippingThreshold) * 100);

  const submitCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(code);
    setCodeError(result.ok ? null : result.message);
    if (result.ok) setCode('');
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Your bag${totals.itemCount ? ` (${totals.itemCount})` : ''}`}
      width="max-w-[26rem]"
      footer={items.length > 0 ? <CartFooter onClose={onClose} /> : undefined}
    >
      {items.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Your bag is empty"
            description="Browse the collections and add something you love — it will show up here."
            action={{ label: 'Start shopping', href: '/shop' }}
          />
        </div>
      ) : (
        <>
          <div className="border-b border-line bg-cream/40 px-5 py-3.5">
            <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
              <Truck className="h-4 w-4 shrink-0 text-forest" />
              {totals.qualifiesForFreeShipping ? (
                <span>You have earned free delivery.</span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="tabular-nums">
                    {formatMoney(totals.freeShippingGap, currency)}
                  </strong>{' '}
                  for free delivery
                </span>
              )}
            </p>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress toward free delivery"
            >
              <div
                className="h-full rounded-full bg-forest-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartLineItem
                key={`${item.product.id}-${item.variant?.id ?? 'd'}`}
                item={item}
                onClose={onClose}
              />
            ))}
          </ul>

          <div className="border-t border-line bg-warm px-5 py-4">
            {coupon ? (
              <div className="flex items-center justify-between gap-3 rounded-md border border-forest/20 bg-cream px-3 py-2.5">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-forest">
                  <Tag className="h-3.5 w-3.5" />
                  {coupon} applied
                </p>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-muted hover:text-sale"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={submitCoupon} className="space-y-1.5">
                <label htmlFor="cart-coupon" className="text-[13px] font-semibold text-ink">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="cart-coupon"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeError(null);
                    }}
                    placeholder="LUNA10"
                    className="h-10 flex-1 rounded-md border border-line bg-white px-3 text-sm uppercase tracking-wide focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
                  />
                  <Button type="submit" size="sm" variant="outline" disabled={!code.trim()}>
                    Apply
                  </Button>
                </div>
                {codeError && (
                  <p className="text-xs font-medium text-sale" role="alert">
                    {codeError}
                  </p>
                )}
              </form>
            )}
          </div>
        </>
      )}
    </Drawer>
  );
}
type CartItemType = ReturnType<typeof useCart>['items'][number];

function CartLineItem({ item, onClose }: { item: CartItemType; onClose: () => void }) {
  const { setQty, remove } = useCart();
  const { currency } = usePrefs();

  return (
    <li className="flex gap-3 px-5 py-4">
      <Link href={`/product/${item.product.slug}`} onClick={onClose} className="shrink-0">
        <SmartImage
          src={item.product.images[0]}
          alt={item.product.name}
          seed={item.product.sku}
          aspect="square"
          wrapperClassName="h-20 w-20 rounded-lg"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${item.product.slug}`}
            onClick={onClose}
            className="clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-forest"
          >
            {item.product.name}
          </Link>
          <button
            type="button"
            onClick={() => remove(item.product.id, item.variant?.id)}
            aria-label={`Remove ${item.product.name} from bag`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded text-muted transition hover:bg-red-50 hover:text-sale"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
        {item.variant && (
          <p className="text-[11px] text-muted">
            {item.variant.label}: {item.variant.value}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <QuantityStepper
            size="sm"
            value={item.qty}
            max={item.variant?.stock ?? item.product.stock}
            onChange={(n) => setQty(item.product.id, n, item.variant?.id)}
            label={`Quantity for ${item.product.name}`}
          />
          <span className="text-sm font-bold tabular-nums text-ink">
            {formatMoney(item.product.price * item.qty, currency)}
          </span>
        </div>
      </div>
    </li>
  );
}

function CartFooter({ onClose }: { onClose: () => void }) {
  const { totals, discount } = useCart();
  const { currency } = usePrefs();

  return (
    <div className="space-y-3">
      <dl className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums text-ink">{formatMoney(totals.subtotal, currency)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-muted">Discount</dt>
            <dd className="font-semibold tabular-nums text-forest">
              −{formatMoney(discount, currency)}
            </dd>
          </div>
        )}
        <div className="flex items-center justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="tabular-nums text-ink">
            {totals.shipping === 0 ? 'Free' : formatMoney(totals.shipping, currency)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Estimated tax</dt>
          <dd className="tabular-nums text-ink">{formatMoney(totals.tax, currency)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-2.5 text-base font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(totals.total, currency)}</dd>
        </div>
      </dl>

      <Link
        href="/checkout"
        onClick={onClose}
        className="block w-full rounded-md bg-forest py-3 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-forest-600"
      >
        Checkout securely
      </Link>
      <Link
        href="/cart"
        onClick={onClose}
        className="block text-center text-[13px] font-semibold text-forest hover:underline"
      >
        View full bag
      </Link>
    </div>
  );
}