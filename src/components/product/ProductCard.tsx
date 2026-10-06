'use client';

/* ------------------------------------------------------------------ */
/* Product card used on every listing surface                         */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { Eye, GitCompare, Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart, usePrefs, useToast } from '@/lib/store';
import { cn, formatMoney, compactNumber } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge, Rating } from '@/components/ui/primitives';

export function ProductCard({
  product,
  className,
  compact = false,
  priority = false,
  onQuickView,
}: {
  product: Product;
  className?: string;
  compact?: boolean;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}) {
  const { add } = useCart();
  const { isWishlisted, toggleWishlist, compare, toggleCompare } = usePrefs();
  const { push, success } = useToast();
  const saved = isWishlisted(product.id);
  const comparing = compare.includes(product.id);
  const lowStock = product.stock <= product.lowStockAt;

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

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product.id);
    push({
      title: comparing ? 'Removed from compare' : 'Added to compare',
      description: product.name,
      variant: 'info',
      action: !comparing ? { label: 'Compare', href: '/compare' } : undefined,
    });
  };

  return (
    <article
      className={cn(
        'product-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-card-hover',
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
              'absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-soft transition',
              saved ? 'text-sale' : 'text-muted hover:text-sale'
            )}
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
          </button>

          <button
            type="button"
            onClick={handleCompare}
            aria-label={comparing ? `Remove ${product.name} from compare` : `Compare ${product.name}`}
            aria-pressed={comparing}
            title="Compare"
            className={cn(
              'absolute right-2.5 top-[46px] grid h-8 w-8 place-items-center rounded-full bg-white/95 shadow-soft transition',
              comparing ? 'text-forest' : 'text-muted hover:text-forest'
            )}
          >
            <GitCompare className={cn('h-4 w-4', comparing && 'fill-current')} />
          </button>

          <div className="card-actions absolute inset-x-2.5 bottom-2.5 flex gap-1.5">
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-forest text-[12px] font-semibold text-white shadow-soft transition hover:bg-forest-600"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to bag
            </button>
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                aria-label={`Quick view ${product.name}`}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-forest shadow-soft transition hover:bg-cream"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>

          {lowStock && (
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-sale shadow-soft">
              Only {product.stock} left
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{product.brand}</p>
          <h3 className="clamp-2 text-[13.5px] font-semibold leading-snug text-ink transition-colors group-hover:text-forest sm:text-sm">
            {product.name}
          </h3>
          <Rating value={product.rating} count={product.reviewCount} size="xs" />
          <div className="mt-auto space-y-1 pt-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-[15px] font-bold tabular-nums text-ink sm:text-base">
                {formatMoney(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs tabular-nums text-muted line-through">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
            </div>
            {!compact && (
              <p className="text-[11px] text-muted">
                {compactNumber(product.soldCount)} sold · Free returns
              </p>
            )}
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