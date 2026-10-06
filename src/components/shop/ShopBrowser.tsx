'use client';

/* ------------------------------------------------------------------ */
/* Shop browser: filter rail + product grid + pagination               */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/lib/types';
import { SORT_OPTIONS } from '@/lib/constants';
import {
  applyFilters,
  countActiveFilters,
  EMPTY_FILTERS,
  filtersToParams,
  paginate,
  toggleInArray,
  type FilterState,
} from '@/lib/filters';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';
import { Button, EmptyState } from '@/components/ui';
import { Drawer } from '@/components/ui/overlays';
import { FilterPanel } from './FilterPanel';
import { ActiveChips, Pagination } from './ShopPieces';
import { ShopGrid } from './ShopGrid';

export function ShopBrowser({
  products,
  defaultSort = 'relevance',
}: {
  products: Product[];
  defaultSort?: FilterState['sort'];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Read initial state from the URL after hydration to avoid an SSR mismatch.
  useEffect(() => {
    const next: FilterState = { ...EMPTY_FILTERS };
    next.q = params.get('q') ?? '';
    next.categories = (params.get('category') ?? '').split(',').filter(Boolean);
    next.subcategories = (params.get('sub') ?? '').split(',').filter(Boolean);
    next.brands = (params.get('brand') ?? '').split(',').filter(Boolean);
    next.tags = (params.get('tag') ?? '').split(',').filter(Boolean);
    next.minPrice = Number(params.get('min') ?? 0) || 0;
    next.maxPrice = Number(params.get('max') ?? 2000) || 2000;
    next.minRating = Number(params.get('rating') ?? 0) || 0;
    next.onSale = params.get('sale') === '1';
    next.inStock = params.get('stock') === '1';
    next.sort = (params.get('sort') as FilterState['sort']) ?? defaultSort;
    next.page = Number(params.get('page') ?? 1) || 1;
    setFilters(next);
    setHydrated(true);
  }, [params, defaultSort]);

  const syncUrl = (next: FilterState) => {
    setFilters(next);
    router.replace(`?${filtersToParams(next).toString()}`, { scroll: false });
  };

  const results = useMemo(() => applyFilters(products, filters), [products, filters]);
  const page = useMemo(
    () => paginate(results, filters.page, filters.perPage),
    [results, filters.page, filters.perPage]
  );
  const activeCount = countActiveFilters(filters);

  const toggle = (key: 'categories' | 'subcategories' | 'brands' | 'tags', value: string) => {
    syncUrl({ ...filters, [key]: toggleInArray(filters[key], value), page: 1 });
  };

  const panel = (
    <FilterPanel
      filters={filters}
      onToggle={toggle}
      onChange={(patch) => syncUrl({ ...filters, ...patch, page: 1 })}
      onClear={() => syncUrl({ ...EMPTY_FILTERS })}
    />
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[268px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="thin-scrollbar sticky top-[152px] max-h-[calc(100vh-172px)] overflow-y-auto pr-1">
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {hydrated ? (
              <>
                <strong className="font-semibold text-ink">{page.total}</strong> products
                {filters.q && ` for “${filters.q}”`}
                {page.totalPages > 1 && ` · page ${page.safePage} of ${page.totalPages}`}
              </>
            ) : (
              'Loading products…'
            )}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden"
              icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
            >
              Filters{activeCount ? ` (${activeCount})` : ''}
            </Button>
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) =>
                syncUrl({ ...filters, sort: e.target.value as FilterState['sort'], page: 1 })
              }
              className="luna-select h-9 border-line pr-8 text-[13px] font-medium"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ActiveChips filters={filters} onSync={syncUrl} onToggle={toggle} />
        <ShopGrid
          items={page.items}
          page={page}
          filters={filters}
          onQuickView={setQuickView}
          onSync={syncUrl}
        />
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
        <div className="px-5 pb-6">{panel}</div>
      </Drawer>

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}