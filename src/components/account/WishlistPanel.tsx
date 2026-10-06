'use client';

/* ------------------------------------------------------------------ */
/* Wishlist: wishlisted products in a tidy grid                        */
/* ------------------------------------------------------------------ */

import { Heart } from 'lucide-react';
import { usePrefs } from '@/lib/store';
import { getProductsByIds } from '@/lib/data/products';
import { EmptyState, Button } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';

export function WishlistPanel() {
  const { wishlist, clearWishlist } = usePrefs();
  const products = getProductsByIds(wishlist);

  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here — we will tell you when it goes on sale."
          action={{ label: 'Discover products', href: '/shop' }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {products.length} saved item{products.length === 1 ? '' : 's'}
        </p>
        <Button variant="ghost" size="sm" onClick={clearWishlist}>
          Clear wishlist
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </div>
  );
}
