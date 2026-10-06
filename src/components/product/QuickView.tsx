'use client';

/* ------------------------------------------------------------------ */
/* Quick view modal                                                    */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, ShieldCheck, Minus, Plus, Heart, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart, usePrefs, useToast } from '@/lib/store';
import { formatMoney } from '@/lib/utils';
import { Modal } from '@/components/ui/overlays';
import { Badge, Button, Rating } from '@/components/ui/primitives';
import { SmartImage } from '@/components/ui/SmartImage';

export function QuickView({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { add } = useCart();
  const { isWishlisted, toggleWishlist, currency } = usePrefs();
  const { success } = useToast();
  const [qty, setQty] = useState(1);
  const saved = isWishlisted(product.id);

  const handleAdd = () => {
    add(product.id, qty);
    success('Added to your bag', `${product.name} × ${qty}`);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Quick view" size="lg">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            seed={product.sku}
            aspect="4/5"
            wrapperClassName="overflow-hidden rounded-xl"
            priority
          />
          <ul className="grid grid-cols-3 gap-2">
            {product.images.slice(1, 4).map((img, i) => (
              <li key={img}>
                <SmartImage
                  src={img}
                  alt={`${product.name} view ${i + 2}`}
                  seed={`${product.sku}-${i}`}
                  aspect="square"
                  wrapperClassName="overflow-hidden rounded-lg"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            {product.brand}
          </p>
          <h2 className="mt-1 text-lg font-bold leading-snug text-ink">{product.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Rating value={product.rating} count={product.reviewCount} />
            {product.discountPct && <Badge tone="sale">Save {product.discountPct}%</Badge>}
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
            <span className="text-2xl font-bold tabular-nums text-ink">
              {formatMoney(product.price, currency)}
            </span>
            {product.originalPrice && (
              <span className="text-sm tabular-nums text-muted line-through">
                {formatMoney(product.originalPrice, currency)}
              </span>
            )}
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
            {product.description}
          </p>

          <ul className="mt-4 space-y-1.5 text-xs text-muted">
            <li className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 shrink-0 text-forest" />
              Delivery in {product.deliveryDays}–{product.deliveryDays + 3} business days
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5 shrink-0 text-forest" />
              {product.returnDays}-day free returns
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-forest" />
              {product.warrantyMonths ?? 12}-month warranty included
            </li>
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
            <div className="inline-flex h-11 items-center rounded-md border border-line">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-11 w-10 place-items-center text-forest transition hover:bg-cream"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
                className="grid h-11 w-10 place-items-center text-forest transition hover:bg-cream"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button size="lg" onClick={handleAdd} disabled={product.stock === 0} className="flex-1">
              {product.stock === 0 ? 'Out of stock' : 'Add to bag'}
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={saved}
              className={`grid h-11 w-11 place-items-center rounded-md border transition ${
                saved ? 'border-sale text-sale' : 'border-line text-muted hover:text-sale'
              }`}
            >
              <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <Link
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
          >
            <Check className="h-3.5 w-3.5" />
            See full details and specifications
          </Link>
        </div>
      </div>
    </Modal>
  );
}