'use client';

import { X } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { EMPTY_FILTERS, type FilterState } from '@/lib/filters';
import { cn } from '@/lib/utils';

type MultiKey = 'categories' | 'subcategories' | 'brands' | 'tags';

interface Props {
  filters: FilterState;
  onSync: (next: FilterState) => void;
  onToggle: (key: MultiKey, value: string) => void;
}

export function ActiveChips({ filters, onSync, onToggle }: Props) {
  const hasAny =
    filters.q ||
    filters.categories.length ||
    filters.subcategories.length ||
    filters.brands.length ||
    filters.tags.length ||
    filters.onSale ||
    filters.inStock ||
    filters.minRating > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000;

  if (!hasAny) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {filters.q && <Chip label={filters.q} onClear={() => onSync({ ...filters, q: '' })} />}
      {filters.categories.map((c) => (
        <Chip
          key={c}
          label={CATEGORIES.find((x) => x.slug === c)?.name ?? c}
          onClear={() => onToggle('categories', c)}
        />
      ))}
      {filters.subcategories.map((s) => (
        <Chip key={s} label={s.replace(/-/g, ' ')} onClear={() => onToggle('subcategories', s)} />
      ))}
      {filters.brands.map((b) => (
        <Chip key={b} label={b.replace(/-/g, ' ')} onClear={() => onToggle('brands', b)} />
      ))}
      {filters.tags.map((t) => (
        <Chip key={t} label={t} onClear={() => onToggle('tags', t)} />
      ))}
      {filters.onSale && <Chip label="On sale" onClear={() => onSync({ ...filters, onSale: false })} />}
      {filters.inStock && (
        <Chip label="In stock" onClear={() => onSync({ ...filters, inStock: false })} />
      )}
      {filters.minRating > 0 && (
        <Chip label={`${filters.minRating} stars & up`} onClear={() => onSync({ ...filters, minRating: 0 })} />
      )}
      {(filters.minPrice > 0 || filters.maxPrice < 2000) && (
        <Chip
          label={`$${filters.minPrice} – $${filters.maxPrice}`}
          onClear={() => onSync({ ...filters, minPrice: 0, maxPrice: 2000 })}
        />
      )}
      <button
        type="button"
        onClick={() => onSync({ ...EMPTY_FILTERS })}
        className="text-[13px] font-semibold text-forest underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}

export function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white py-1 pl-3 pr-1.5 text-[12px] font-medium text-ink">
      <span className="capitalize">{label}</span>
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remove filter ${label}`}
        className="grid h-5 w-5 place-items-center rounded-full text-muted transition hover:bg-cream hover:text-sale"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

/* ----------------------------- Pagination ----------------------------- */

export function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 1
  );

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="h-9 rounded-md border border-line bg-white px-3.5 text-[13px] font-semibold text-ink transition hover:bg-cream disabled:opacity-40 disabled:hover:bg-white"
      >
        Previous
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          <button
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === current ? 'page' : undefined}
            className={cn(
              'h-9 min-w-9 rounded-md border px-2.5 text-sm font-semibold transition',
              p === current
                ? 'border-forest bg-forest text-white'
                : 'border-line bg-white text-ink hover:bg-cream'
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="h-9 rounded-md border border-line bg-white px-3.5 text-[13px] font-semibold text-ink transition hover:bg-cream disabled:opacity-40 disabled:hover:bg-white"
      >
        Next
      </button>
    </nav>
  );
}