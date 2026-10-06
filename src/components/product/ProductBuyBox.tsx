'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  Bell,
  Store,
  ChevronRight,
} from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart, usePrefs, useToast } from '@/lib/store';
import { COMMERCE } from '@/lib/constants';
import { cn, formatMoney, compactNumber, timeAgo } from '@/lib/utils';
import { getBrand } from '@/lib/data/products/brands';
import { Badge, Button, Rating } from '@/components/ui/primitives';

export function ProductBuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const { isWishlisted, toggleWishlist, currency } = usePrefs();
  const { success } = useToast();

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);

  const colorVariants = useMemo(
    () => product.variants.filter((v) => v.type === 'color'),
    [product.variants]
  );
  const sizeVariants = useMemo(
    () => product.variants.filter((v) => v.type === 'size'),
    [product.variants]
  );
  const activeVariant = product.variants.find(
    (v) => v.value === selected.color && v.value === selected.size
  );
  const maxQty = Math.min(activeVariant?.stock ?? product.stock, COMMERCE.maxQtyPerLine);
  const saved = isWishlisted(product.id);
  const lowStock = product.stock <= product.lowStockAt;

  const handleAdd = () => {
    const variantId =
      product.variants.find((v) => v.value === selected.color && v.value === selected.size)?.id ??
      undefined;
    add(product.id, qty, variantId);
    success('Added to your bag', `${product.name} Ã— ${qty}`);
  };

  return (
    <aside className="space-y-5 lg:sticky lg:top-[152px] lg:self-start">
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-muted">
          <Link href={`/shop/${product.categorySlug}`} className="hover:text-forest">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/shop/${product.categorySlug}?sub=${product.subcategorySlug}`}
            className="hover:text-forest"
          >
            {product.subcategory}
          </Link>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          {product.brand}
        </p>
        <h1 className="display text-[26px] leading-tight text-forest sm:text-[30px]">
          {product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <Rating value={product.rating} count={product.reviewCount} />
          <span className="text-xs text-muted">{compactNumber(product.soldCount)} sold</span>
        </div>

        <div className="flex flex-wrap items-baseline gap-3 pt-1">
          <span className="text-[28px] font-bold tabular-nums text-ink">
            {formatMoney(product.price, currency)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm tabular-nums text-muted line-through">
                {formatMoney(product.originalPrice, currency)}
              </span>
              <Badge tone="sale">
                Save {formatMoney(product.originalPrice - product.price, currency)}
              </Badge>
            </>
          )}
        </div>
        <p className="text-xs text-muted">
          Inclusive of taxes. Free delivery over ${COMMERCE.freeShippingThreshold}.
        </p>
      </div>
{colorVariants.length > 0 && (
        <fieldset className="space-y-2.5">
          <legend className="text-[13px] font-semibold text-ink">
            Colour: <span className="font-normal text-muted">{selected.color ?? '—'}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelected((s) => ({ ...s, color: v.value }))}
                aria-pressed={selected.color === v.value}
                aria-label={`Colour ${v.value}`}
                title={`${v.value} — ${v.stock} in stock`}
                className={cn(
                  'h-9 w-9 rounded-full border-2 transition',
                  selected.color === v.value
                    ? 'border-forest ring-2 ring-forest/20'
                    : 'border-line hover:border-forest/40'
                )}
                style={{ backgroundColor: v.swatch }}
              >
                <span className="sr-only">{v.value}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {sizeVariants.length > 0 && (
        <fieldset className="space-y-2.5">
          <legend className="text-[13px] font-semibold text-ink">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelected((s) => ({ ...s, size: v.value }))}
                aria-pressed={selected.size === v.value}
                className={cn(
                  'min-w-[46px] rounded-md border px-3 py-2 text-sm font-semibold transition',
                  selected.size === v.value
                    ? 'border-forest bg-forest text-white'
                    : 'border-line bg-white text-ink hover:border-forest'
                )}
              >
                {v.value}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-2 text-[13px]">
        {product.stock === 0 ? (
          <span className="font-semibold text-sale">Out of stock</span>
        ) : lowStock ? (
          <span className="font-semibold text-sale">Only {product.stock} left in stock</span>
        ) : (
          <span className="flex items-center gap-1.5 font-medium text-forest">
            <Check className="h-4 w-4" />
            In stock — ships today
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex h-12 items-center rounded-md border border-line bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            className="grid h-12 w-11 place-items-center text-forest transition hover:bg-cream disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            aria-label="Quantity"
            value={qty}
            min={1}
            max={maxQty}
            onChange={(e) => setQty(Math.min(maxQty, Math.max(1, Number(e.target.value) || 1)))}
            className="qty-input w-11 border-0 bg-transparent text-center text-sm font-bold tabular-nums"
          />
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            aria-label="Increase quantity"
            disabled={qty >= maxQty}
            className="grid h-12 w-11 place-items-center text-forest transition hover:bg-cream disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button
          size="lg"
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="flex-1"
          icon={<ShoppingBag className="h-4 w-4" />}
        >
          Add to bag
        </Button>
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="outline"
          size="lg"
          onClick={handleAdd}
          disabled={product.stock === 0}
          className="flex-1"
        >
          Buy now
        </Button>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
          className={cn(
            'grid h-12 w-12 place-items-center rounded-md border transition',
            saved ? 'border-sale text-sale' : 'border-line text-muted hover:text-sale'
          )}
        >
          <Heart className={cn('h-5 w-5', saved && 'fill-current')} />
        </button>
      </div>

      <ProductTrust product={product} />
    </aside>
  );
}
/* ----------------------------- Trust block ----------------------------- */

function ProductTrust({ product }: { product: Product }) {
  const brand = getBrand(product.brandSlug);

  return (
    <>
      {product.stock === 0 && (
        <Button
          variant="secondary"
          size="md"
          fullWidth
          icon={<Bell className="h-4 w-4" />}
          onClick={() => {
            window.alert(
              `We will email you at the address on your account as soon as ${product.name} is back in stock.`
            );
          }}
        >
          Notify me when available
        </Button>
      )}

      <ul className="space-y-2.5 border-t border-line pt-4 text-[13px] text-muted">
        <li className="flex items-center gap-2.5">
          <Truck className="h-4 w-4 shrink-0 text-forest" />
          Free delivery over ${COMMERCE.freeShippingThreshold}, tracked end to end
        </li>
        <li className="flex items-center gap-2.5">
          <RotateCcw className="h-4 w-4 shrink-0 text-forest" />
          {product.returnDays}-day free returns, prepaid label included
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-forest" />
          {product.warrantyMonths ?? 12}-month warranty and buyer protection
        </li>
        {brand && (
          <li className="flex items-center gap-2.5">
            <Store className="h-4 w-4 shrink-0 text-forest" />
            Sold by{' '}
            <Link href={`/brand/${brand.slug}`} className="font-semibold text-forest hover:underline">
              {brand.name}
            </Link>{' '}
            ({brand.country})
          </li>
        )}
      </ul>

      <p className="text-[11px] text-muted">
        SKU {product.sku} · Added {timeAgo(product.createdAt)}
      </p>
    </>
  );
}
