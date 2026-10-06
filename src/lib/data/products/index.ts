import type { Product, ProductSeed } from '../../types';
import { buildProducts } from './build';
import { ELECTRONICS_SEEDS } from './electronics';
import { FASHION_SEEDS } from './fashion';
import { HOME_SEEDS } from './home';
import { BEAUTY_SEEDS } from './beauty';
import { SPORTS_SEEDS } from './sports';
import { TOYS_SEEDS } from './toys';
import { BOOKS_SEEDS } from './books';
import { PETS_SEEDS } from './pets';
import { TRAVEL_SEEDS } from './travel';
import { ACCESSORIES_SEEDS } from './accessories';
import { GROCERY_SEEDS } from './grocery';
import { OFFICE_SEEDS } from './office';
import { AUTOMOTIVE_SEEDS } from './automotive';
import { HEALTH_SEEDS } from './health';

const SEED_MAP: Record<string, ProductSeed[]> = {
  electronics: ELECTRONICS_SEEDS,
  fashion: FASHION_SEEDS,
  'home-living': HOME_SEEDS,
  beauty: BEAUTY_SEEDS,
  sports: SPORTS_SEEDS,
  'toys-kids': TOYS_SEEDS,
  books: BOOKS_SEEDS,
  'pet-supplies': PETS_SEEDS,
  travel: TRAVEL_SEEDS,
  accessories: ACCESSORIES_SEEDS,
  grocery: GROCERY_SEEDS,
  office: OFFICE_SEEDS,
  automotive: AUTOMOTIVE_SEEDS,
  'health-wellness': HEALTH_SEEDS,
};

/** Every product in the catalogue. */
export const PRODUCTS: Product[] = Object.entries(SEED_MAP).flatMap(([slug, seeds]) =>
  buildProducts(slug, seeds)
);

export const PRODUCT_COUNT = PRODUCTS.length;

/* ------------------------------ Indexes ------------------------------ */

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));
const bySku = new Map(PRODUCTS.map((p) => [p.sku, p]));
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

export const getProductBySlug = (slug: string): Product | undefined => bySlug.get(slug);
export const getProductBySku = (sku: string): Product | undefined => bySku.get(sku);
export const getProductById = (id: string): Product | undefined => byId.get(id);

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsBySubcategory(categorySlug: string, subSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug && p.subcategorySlug === subSlug);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return PRODUCTS.filter((p) => p.brandSlug === brandSlug);
}

export function getProductsByIds(ids: string[]): Product[] {
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

export const getFeatured = (limit = 12): Product[] =>
  PRODUCTS.filter((p) => p.tags.includes('featured')).slice(0, limit);

export const getOnSale = (limit = 12): Product[] =>
  PRODUCTS.filter((p) => p.discountPct)
    .sort((a, b) => (b.discountPct ?? 0) - (a.discountPct ?? 0))
    .slice(0, limit);

export const getNewArrivals = (limit = 12): Product[] =>
  [...PRODUCTS].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, limit);

export const getBestSellers = (limit = 12): Product[] =>
  [...PRODUCTS].sort((a, b) => b.soldCount - a.soldCount).slice(0, limit);

export const getTopRated = (limit = 12): Product[] =>
  [...PRODUCTS]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);

export const getLowStock = (limit = 20): Product[] =>
  [...PRODUCTS]
    .filter((p) => p.stock <= p.lowStockAt)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, limit);

export const getPriceRange = (): [number, number] => [
  Math.floor(Math.min(...PRODUCTS.map((p) => p.price))),
  Math.ceil(Math.max(...PRODUCTS.map((p) => p.price))),
];

export function searchProducts(query: string, limit = 8): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return PRODUCTS.map((p) => {
    const haystack = `${p.name} ${p.brand} ${p.category} ${p.subcategory}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (!haystack.includes(t)) score -= 100;
      if (p.name.toLowerCase().includes(t)) score += 6;
      if (p.brand.toLowerCase().includes(t)) score += 4;
      if (p.categorySlug.includes(t) || p.subcategorySlug.includes(t)) score += 3;
    }
    score += p.rating;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

/** Similar products used on the product detail page. */
export function getRelatedProducts(product: Product, limit = 8): Product[] {
  const sameSub = PRODUCTS.filter(
    (p) => p.id !== product.id && p.subcategorySlug === product.subcategorySlug
  );
  const sameCat = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      p.categorySlug === product.categorySlug &&
      p.subcategorySlug !== product.subcategorySlug
  );
  return [...sameSub, ...sameCat].slice(0, limit);
}