/* ------------------------------------------------------------------ */
/* Product filtering, sorting and search                               */
/* ------------------------------------------------------------------ */

import type { Product } from './types';
import type { SortValue } from './constants';
import { PRICE_BANDS } from './constants';
import { slugify } from './utils';

export interface FilterState {
  q: string;
  categories: string[];
  subcategories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  onSale: boolean;
  inStock: boolean;
  tags: string[];
  sort: SortValue;
  page: number;
  perPage: number;
}

export const EMPTY_FILTERS: FilterState = {
  q: '',
  categories: [],
  subcategories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  onSale: false,
  inStock: false,
  tags: [],
  sort: 'relevance',
  page: 1,
  perPage: 24,
};

function matchesQuery(product: Product, query: string): boolean {
  if (!query.trim()) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    product.name,
    product.brand,
    product.category,
    product.subcategory,
    product.description,
    ...product.highlights,
  ]
    .join(' ')
    .toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  const filtered = products.filter((p) => {
    if (filters.categories.length && !filters.categories.includes(p.categorySlug)) return false;
    if (filters.subcategories.length && !filters.subcategories.includes(p.subcategorySlug)) return false;
    if (filters.brands.length && !filters.brands.includes(p.brandSlug)) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (filters.minRating && p.rating < filters.minRating) return false;
    if (filters.onSale && !p.discountPct) return false;
    if (filters.inStock && p.stock === 0) return false;
    if (filters.tags.length && !filters.tags.some((t) => p.tags.includes(t as never))) return false;
    if (!matchesQuery(p, filters.q)) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'popular':
      sorted.sort((a, b) => b.soldCount - a.soldCount);
      break;
    case 'discount':
      sorted.sort((a, b) => (b.discountPct ?? 0) - (a.discountPct ?? 0));
      break;
    case 'newest':
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    default: {
      // Relevance blends rating, popularity and discount when no query is given.
      const score = (p: Product) =>
        p.rating * 10 + Math.log10(p.soldCount + 10) * 4 + (p.discountPct ?? 0) * 0.4;
      sorted.sort((a, b) => score(b) - score(a));
    }
  }
  return sorted;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    items: items.slice((safePage - 1) * perPage, safePage * perPage),
    totalPages,
    safePage,
    total: items.length,
    from: items.length === 0 ? 0 : (safePage - 1) * perPage + 1,
    to: Math.min(safePage * perPage, items.length),
  };
}

/** Build the URL search string for the current filter state. */
export function filtersToParams(filters: Partial<FilterState>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.categories?.length) params.set('category', filters.categories.join(','));
  if (filters.subcategories?.length) params.set('sub', filters.subcategories.join(','));
  if (filters.brands?.length) params.set('brand', filters.brands.join(','));
  if (filters.minPrice) params.set('min', String(filters.minPrice));
  if (filters.maxPrice && filters.maxPrice < 2000) params.set('max', String(filters.maxPrice));
  if (filters.minRating) params.set('rating', String(filters.minRating));
  if (filters.onSale) params.set('sale', '1');
  if (filters.inStock) params.set('stock', '1');
  if (filters.tags?.length) params.set('tag', filters.tags.join(','));
  if (filters.sort && filters.sort !== 'relevance') params.set('sort', filters.sort);
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  return params;
}

export function countActiveFilters(filters: FilterState): number {
  return (
    (filters.q ? 1 : 0) +
    filters.categories.length +
    filters.subcategories.length +
    filters.brands.length +
    (filters.minPrice > 0 || filters.maxPrice < 2000 ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    filters.tags.length
  );
}

export function priceBandLabel(band: (typeof PRICE_BANDS)[number]): string {
  return band.label;
}

export function brandLabel(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function toggleInArray(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export { slugify };