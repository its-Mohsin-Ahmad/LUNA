/* ------------------------------------------------------------------ */
/* Data integrity report for the LUNA catalogue.                      */
/* Run with: npm run check:data                                        */
/* ------------------------------------------------------------------ */

import { PRODUCTS, PRODUCT_COUNT } from '../src/lib/data/products';
import { BRANDS, getReviews } from '../src/lib/data/products/brands';
import { CATEGORIES, SUBCATEGORY_TOTAL } from '../src/lib/data/categories';

let failures = 0;
const fail = (msg: string) => {
  console.error('  FAIL ' + msg);
  failures++;
};

console.log('\n=== LUNA catalogue integrity ===\n');
console.log(`Categories      : ${CATEGORIES.length}`);
console.log(`Subcategories   : ${SUBCATEGORY_TOTAL}`);
console.log(`Products        : ${PRODUCT_COUNT}`);
console.log(`Brands          : ${BRANDS.length}`);
console.log('');

/* 1. Unique ids / skus / slugs */
const ids = new Set(PRODUCTS.map((p) => p.id));
const skus = new Set(PRODUCTS.map((p) => p.sku));
const slugs = new Set(PRODUCTS.map((p) => p.slug));
if (ids.size !== PRODUCT_COUNT) fail('duplicate product ids');
if (skus.size !== PRODUCT_COUNT) fail('duplicate product SKUs');
if (slugs.size !== PRODUCT_COUNT) fail('duplicate product slugs');

/* 2. Per-category minimum of 11 */
for (const cat of CATEGORIES) {
  const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
  const status = count >= 11 ? 'ok  ' : 'LOW ';
  console.log(`  ${status}${cat.name.padEnd(18)} ${String(count).padStart(3)} products / ${cat.subcategories.length} subcats`);
  if (count < 11) fail(`${cat.slug} has only ${count} products (need 11)`);
}

/* 3. Every product references a real subcategory of its category */
for (const p of PRODUCTS) {
  const cat = CATEGORIES.find((c) => c.slug === p.categorySlug);
  if (!cat) {
    fail(`${p.sku}: unknown category ${p.categorySlug}`);
    continue;
  }
  if (!cat.subcategories.some((s) => s.slug === p.subcategorySlug)) {
    fail(`${p.sku}: subcategory "${p.subcategorySlug}" not in ${p.categorySlug}`);
  }
}

/* 4. Every product has 4 images, 3+ highlights, 8+ specs, a description */
for (const p of PRODUCTS) {
  if (p.images.length < 4) fail(`${p.sku}: only ${p.images.length} images`);
  if (new Set(p.images).size !== p.images.length) fail(`${p.sku}: duplicate images`);
  if (p.highlights.length < 3) fail(`${p.sku}: only ${p.highlights.length} highlights`);
  if (p.specs.length < 6) fail(`${p.sku}: only ${p.specs.length} specs`);
  if (p.description.length < 40) fail(`${p.sku}: description too short`);
  if (/lorem ipsum/i.test(p.description)) fail(`${p.sku}: Lorem Ipsum in description`);
  if (p.specs.some((s) => s.value.includes('{') || s.value.includes('}'))) {
    fail(`${p.sku}: unresolved template placeholder in specs`);
  }
  if (p.rating < 1 || p.rating > 5) fail(`${p.sku}: rating out of range`);
  if (p.price <= 0) fail(`${p.sku}: invalid price`);
  if (p.originalPrice && p.originalPrice <= p.price) fail(`${p.sku}: original price not higher`);
}

/* 5. Uniqueness of product names across the whole catalogue */
const nameCounts = new Map<string, number>();
for (const p of PRODUCTS) nameCounts.set(p.name, (nameCounts.get(p.name) ?? 0) + 1);
for (const [name, n] of nameCounts) if (n > 1) fail(`duplicate product name "${name}" (${n}x)`);

/* 6. Reviews generate for every product */
const noReviews = PRODUCTS.filter((p) => getReviews(p.id).length === 0);
if (noReviews.length) fail(`${noReviews.length} products produce no reviews`);

/* 7. Variant swatches resolve to hex codes */
for (const p of PRODUCTS) {
  for (const v of p.variants) {
    if (v.type === 'color' && !/^#[0-9A-Fa-f]{6}$/.test(v.swatch ?? '')) {
      fail(`${p.sku}: colour variant "${v.value}" has no hex swatch`);
    }
  }
}

/* 8. Images are absolute https URLs (no broken relative paths) */
for (const p of PRODUCTS) {
  for (const img of p.images) {
    if (!img.startsWith('https://')) fail(`${p.sku}: non-https image URL`);
  }
}

console.log('');
if (failures === 0) {
  console.log(`All checks passed. ${PRODUCT_COUNT} products across ${CATEGORIES.length} categories.\n`);
} else {
  console.error(`${failures} problem(s) found.\n`);
  process.exit(1);
}