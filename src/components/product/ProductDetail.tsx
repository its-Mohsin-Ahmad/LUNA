'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/types';
import { usePrefs } from '@/lib/store';
import { ProductGallery } from './ProductGallery';
import { ProductBuyBox } from './ProductBuyBox';
import { ProductTabs } from './ProductTabs';

export function ProductDetail({ product }: { product: Product }) {
  const { pushRecent } = usePrefs();

  // Track recently viewed so the account area can list them.
  useEffect(() => {
    pushRecent(product.id);
  }, [product.id, pushRecent]);

  return (
    <div className="space-y-10">
      {/* `grid-cols-1` = `minmax(0,1fr)` so items can shrink below their
          min-content on phones (the tab buttons are `whitespace-nowrap`
          and would otherwise force a 569px track and a sideways page). */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="min-w-0 space-y-6">
          <ProductGallery product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="min-w-0">
          <ProductBuyBox product={product} />
        </div>
      </div>
    </div>
  );
}