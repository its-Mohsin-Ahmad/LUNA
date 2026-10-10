'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { usePrefs, useCart } from '@/lib/store';
import { formatMoney } from '@/lib/utils';
import { getProductsByIds } from '@/lib/data/products';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button, EmptyState } from '@/components/ui';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { getTopRated } from '@/lib/data/products';

export function WishlistPage() {
  const { wishlist, toggleWishlist } = usePrefs();
  const { add } = useCart();
  const products = getProductsByIds(wishlist);

  if (products.length === 0) {
    return (
      <div className="space-y-10">
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later. Saved items stay on this device."
          action={{ label: 'Browse products', href: '/shop' }}
        />
        <ProductCarousel
          eyebrow="Highly rated"
          title="Top rated right now"
          products={getTopRated(10)}
          href="/shop?sort=rating"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {products.length} saved item{products.length === 1 ? '' : 's'}
        </p>
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              products.forEach((p) => {
                if (p.stock > 0) add(p.id, 1);
              })
            }
            icon={<ShoppingBag className="h-3.5 w-3.5" />}
          >
            Add all in-stock items to bag
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => products.forEach((p) => toggleWishlist(p.id))}
          >
            Clear list
          </Button>
        </div>
      </div>

      <ul className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <li key={product.id} className="relative">
            <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white">
              <Link href={`/product/${product.slug}`}>
                <SmartImage
                  src={product.images[0]}
                  alt={product.name}
                  seed={product.sku}
                  aspect="4/5"
                  wrapperClassName="overflow-hidden"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {product.brand}
                </p>
                <Link
                  href={`/product/${product.slug}`}
                  className="clamp-2 text-sm font-semibold leading-snug text-ink hover:text-forest"
                >
                  {product.name}
                </Link>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className="text-[15px] font-bold tabular-nums text-ink">
                    {formatMoney(product.price)}
                  </span>
                  <Button
                    size="sm"
                    disabled={product.stock === 0}
                    onClick={() => add(product.id, 1)}
                  >
                    {product.stock === 0 ? 'Sold out' : 'Add to bag'}
                  </Button>
                </div>
              </div>
            </article>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={`Remove ${product.name} from wishlist`}
              className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-muted shadow-soft transition hover:text-sale"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}