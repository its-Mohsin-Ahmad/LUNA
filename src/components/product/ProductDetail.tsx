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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="space-y-6">
          <ProductGallery product={product} />
          <ProductTabs product={product} />
        </div>
        <ProductBuyBox product={product} />
      </div>
    </div>
  );
}