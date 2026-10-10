'use client';

/* ------------------------------------------------------------------ */
/* Product card used on every listing surface                         */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart, usePrefs, useToast } from '@/lib/store';
import { cn, formatMoney } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge, Rating } from '@/components/ui/primitives';

export function ProductCard({
  product,
  className,
  compact = false,
  priority = false,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
  priority?: boolean;
  /** Kept for API compatibility; quick view opens from listing surfaces. */
  onQuickView?: (product: Product) => void;
}) {
  const { add } = useCart();
  const { isWishlisted, toggleWishlist } = usePrefs();
  const { push, success } = useToast();
  const saved = isWishlisted(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.id, 1);
    success('Added to your bag', product.name);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    push({
      title: saved ? 'Removed from wishlist' : 'Saved to wishlist',
      description: product.name,
      variant: saved ? 'info' : 'success',
      image: product.images[0],
      action: !saved ? { label: 'View wishlist', href: '/wishlist' } : undefined,
    });
  };

  return (
    <article
      className={cn(
        'product-card group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-shadow hover:shadow-card-hover',
        className
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="flex h-full flex-col focus-visible:outline-none"
        aria-label={`${product.name} by ${product.brand}`}
      >
        <div className="card-image relative overflow-hidden bg-warm">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            seed={product.sku}
            aspect={compact ? 'square' : '4/5'}
            priority={priority}
          />
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {product.discountPct && <Badge tone="sale">−{product.discountPct}%</Badge>}
            {product.tags.includes('new') && !product.discountPct && <Badge tone="forest">New</Badge>}
            {product.tags.includes('exclusive') && !product.discountPct && (
              <Badge tone="gold">Exclusive</Badge>
            )}
          </div>

          <button
            type="button"
            onClick={handleWish}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={saved}
            className={cn(
              'absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-ink/50 transition active:scale-95',
              saved ? 'text-sale' : 'hover:text-sale'
            )}
          >
            <span
              className={cn(
                'grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-soft',
                saved && 'text-sale'
              )}
            >
              <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
            </span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-2.5 sm:p-3.5">
          <h3 className="clamp-2 min-h-[32px] text-[13px] font-semibold leading-snug text-ink transition-colors group-hover:text-forest sm:min-h-[34px] sm:text-[13.5px] sm:text-sm">
            {product.name}
          </h3>
          <Rating value={product.rating} count={product.reviewCount} size="xs" />
          <div className="mt-auto flex items-end justify-between gap-1.5 pt-1.5">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
              <span className="text-[14.5px] font-bold tabular-nums text-ink sm:text-base">
                {formatMoney(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] tabular-nums text-muted line-through sm:text-xs">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className="tap-squish grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest text-white transition hover:bg-forest-600 sm:h-9 sm:w-9"
            >
              <ShoppingBag className="h-4 w-4 sm:h-[17px] sm:w-[17px]" aria-hidden />
            </button>
          </div>
        </div>
      </Link>

      {product.stock === 0 && (
        <div className="absolute inset-0 grid place-items-center bg-white/75">
          <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">
            Out of stock
          </span>
        </div>
      )}
    </article>
  );
}

/* --------------------------- Compact row variant --------------------------- */

/** Minimal horizontal row used in cart, wishlist and order summaries. */
export function ProductRow({
  product,
  qty,
  variantLabel,
  children,
}: {
  product: Product;
  qty?: number;
  variantLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <Link href={`/product/${product.slug}`} className="shrink-0">
        <SmartImage
          src={product.images[0]}
          alt={product.name}
          seed={product.sku}
          aspect="square"
          wrapperClassName="h-20 w-20 rounded-lg"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/product/${product.slug}`}
          className="clamp-2 text-sm font-semibold leading-snug text-ink transition hover:text-forest"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted">
          {product.brand}
          {variantLabel ? ` · ${variantLabel}` : ''}
        </p>
        {qty !== undefined && <p className="text-xs text-muted">Qty {qty}</p>}
        {children}
      </div>
    </div>
  );
}