'use client';

import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/lib/types';
import type { FilterState } from '@/lib/filters';
import { EMPTY_FILTERS } from '@/lib/filters';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui';
import { Pagination } from './ShopPieces';

interface PageInfo {
  items: Product[];
  totalPages: number;
  safePage: number;
  total: number;
}

/** Product grid with empty state and pagination. */
export function ShopGrid({
  items,
  page,
  filters,
  onQuickView,
  onSync,
}: {
  items: Product[];
  page: PageInfo;
  filters: FilterState;
  onQuickView: (product: Product) => void;
  onSync: (next: FilterState) => void;
}) {
  if (page.total === 0) {
    return (
      <EmptyState
        icon={<SlidersHorizontal className="h-6 w-6" />}
        title="No products match those filters"
        description="Try widening the price range, clearing a filter, or searching for something broader."
        action={{ label: 'Clear all filters', onClick: () => onSync({ ...EMPTY_FILTERS }) }}
      />
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product, i) => (
          <li key={product.id}>
            <ProductCard product={product} priority={i < 4} onQuickView={onQuickView} className="h-full" />
          </li>
        ))}
      </ul>

      {page.totalPages > 1 && (
        <Pagination
          current={page.safePage}
          total={page.totalPages}
          onChange={(n) => {
            onSync({ ...filters, page: n });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </>
  );
}