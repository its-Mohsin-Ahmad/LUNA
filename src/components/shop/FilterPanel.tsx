'use client';

import { useState } from 'react';
import { Star, PackageCheck, Tag, RotateCcw, Check } from 'lucide-react';
import { PRICE_BANDS, RATING_FILTERS } from '@/lib/constants';
import { CATEGORIES } from '@/lib/data/categories';
import { BRANDS } from '@/lib/data/products/brands';
import type { FilterState } from '@/lib/filters';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/forms';

export type MultiKey = 'categories' | 'subcategories' | 'brands' | 'tags';

interface Props {
  filters: FilterState;
  onToggle: (key: MultiKey, value: string) => void;
  onChange: (patch: Partial<FilterState>) => void;
  onClear: () => void;
  /** When set, only this category is offered and its sections show instead. */
  scopedCategory?: string;
}

export function Group({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line pb-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mb-2.5 flex w-full items-center justify-between text-left"
      >
        <span className="text-[13px] font-bold uppercase tracking-wide text-ink">{title}</span>
        <span
          aria-hidden
          className={cn('text-lg leading-none text-muted transition-transform', open && 'rotate-45')}
        >
          +
        </span>
      </button>
      {open && children}
    </div>
  );
}

export function FilterPanel({ filters, onToggle, onChange, onClear, scopedCategory }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const scoped = scopedCategory ? CATEGORIES.filter((c) => c.slug === scopedCategory) : CATEGORIES;

  const anyActive =
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.brands.length > 0 ||
    filters.onSale ||
    filters.inStock ||
    filters.minRating > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="display text-base text-forest">Filters</h2>
        {anyActive && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-[12px] font-semibold text-forest hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-2.5 border-b border-line pb-5">
        <Checkbox
          checked={filters.onSale}
          onChange={(v) => onChange({ onSale: v })}
          label={
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-sale" />
              On sale only
            </span>
          }
        />
        <Checkbox
          checked={filters.inStock}
          onChange={(v) => onChange({ inStock: v })}
          label={
            <span className="flex items-center gap-1.5">
              <PackageCheck className="h-3.5 w-3.5 text-forest" />
              In stock only
            </span>
          }
        />
      </div>

      {!scopedCategory && (
        <Group title="Category">
          <ul className="space-y-1.5">
            {scoped.map((cat) => (
              <li key={cat.slug}>
                <div className="flex items-center justify-between gap-2">
                  <Checkbox
                    checked={filters.categories.includes(cat.slug)}
                    onChange={() => onToggle('categories', cat.slug)}
                    label={cat.name}
                  />
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => ({ ...e, [cat.slug]: !e[cat.slug] }))}
                    aria-expanded={expanded[cat.slug]}
                    aria-label={`Toggle ${cat.name} sections`}
                    className="text-[11px] font-semibold text-muted hover:text-forest"
                  >
                    {expanded[cat.slug] ? '−' : '+'}
                  </button>
                </div>
                {expanded[cat.slug] && (
                  <ul className="ml-6 mt-1 space-y-1 border-l border-line pl-3">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Checkbox
                          checked={filters.subcategories.includes(sub.slug)}
                          onChange={() => onToggle('subcategories', sub.slug)}
                          label={<span className="text-[13px]">{sub.name}</span>}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Group>
      )}

      {scopedCategory && (
        <Group title="Section">
          <ul className="space-y-1.5">
            {scoped[0]?.subcategories.map((sub) => (
              <li key={sub.slug}>
                <Checkbox
                  checked={filters.subcategories.includes(sub.slug)}
                  onChange={() => onToggle('subcategories', sub.slug)}
                  label={sub.name}
                />
              </li>
            ))}
          </ul>
        </Group>
      )}

      <PriceGroup filters={filters} onChange={onChange} />
      <RatingGroup filters={filters} onChange={onChange} />
      <BrandGroup filters={filters} onToggle={onToggle} />
      <TagGroup filters={filters} onToggle={onToggle} />
    </div>
  );
/* ----------------------------- Sub groups ----------------------------- */

type ChangeFn = (patch: Partial<FilterState>) => void;

function PriceGroup({ filters, onChange }: { filters: FilterState; onChange: ChangeFn }) {
  return (
    <Group title="Price">
      <ul className="space-y-1.5">
        {PRICE_BANDS.map((band) => {
          const active = filters.minPrice === band.min && filters.maxPrice === band.max;
          return (
            <li key={band.id}>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    active
                      ? { minPrice: 0, maxPrice: 2000 }
                      : { minPrice: band.min, maxPrice: Math.min(band.max, 2000) }
                  )
                }
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] transition',
                  active ? 'bg-cream font-semibold text-forest' : 'text-ink hover:bg-cream/60'
                )}
              >
                {band.label}
                {active && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={filters.minPrice}
          onChange={(e) => onChange({ minPrice: Math.max(0, Number(e.target.value) || 0) })}
          placeholder="Min"
          aria-label="Minimum price"
          className="h-9 w-full rounded-md border border-line px-2.5 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
        />
        <span className="text-muted">–</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={filters.maxPrice >= 2000 ? '' : filters.maxPrice}
          placeholder="Max"
          aria-label="Maximum price"
          onChange={(e) => onChange({ maxPrice: Math.min(2000, Number(e.target.value) || 2000) })}
          className="h-9 w-full rounded-md border border-line px-2.5 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
        />
      </div>
    </Group>
  );
}

function RatingGroup({ filters, onChange }: { filters: FilterState; onChange: ChangeFn }) {
  return (
    <Group title="Customer rating">
      <ul className="space-y-1">
        {RATING_FILTERS.map((r) => (
          <li key={r}>
            <button
              type="button"
              onClick={() => onChange({ minRating: filters.minRating === r ? 0 : r })}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition',
                filters.minRating === r ? 'bg-cream font-semibold text-forest' : 'hover:bg-cream/60'
              )}
            >
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn('h-3.5 w-3.5', i < r ? 'fill-gold text-gold' : 'text-line')}
                  />
                ))}
              </span>
              <span className="text-muted">&amp; up</span>
            </button>
          </li>
        ))}
      </ul>
    </Group>
  );
}

function BrandGroup({
  filters,
  onToggle,
}: {
  filters: FilterState;
  onToggle: (key: MultiKey, value: string) => void;
}) {
  return (
    <Group title="Brand">
      <ul className="thin-scrollbar max-h-56 space-y-1.5 overflow-y-auto pr-1">
        {BRANDS.slice(0, 24).map((brand) => (
          <li key={brand.slug}>
            <Checkbox
              checked={filters.brands.includes(brand.slug)}
              onChange={() => onToggle('brands', brand.slug)}
              label={<span className="text-[13px]">{brand.name}</span>}
            />
          </li>
        ))}
      </ul>
    </Group>
  );
}

function TagGroup({
  filters,
  onToggle,
}: {
  filters: FilterState;
  onToggle: (key: MultiKey, value: string) => void;
}) {
  return (
    <Group title="Highlights">
      <ul className="space-y-1.5">
        {['new', 'bestseller', 'exclusive', 'eco', 'limited'].map((tag) => (
          <li key={tag}>
            <Checkbox
              checked={filters.tags.includes(tag)}
              onChange={() => onToggle('tags', tag)}
              label={<span className="text-[13px] capitalize">{tag}</span>}
            />
          </li>
        ))}
      </ul>
    </Group>
  );
}
}