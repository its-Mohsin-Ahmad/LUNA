import type { Product, ProductSeed, ProductVariant, Spec } from '../../types';
import { pickImages } from '../../images';
import { slugify } from '../../utils';
import { getCategory, getSubcategoryName } from '../categories';

export type { ProductSeed } from '../../types';

/* ------------------------------------------------------------------ */
/* Product factory: turns compact seeds into full product records      */
/* ------------------------------------------------------------------ */

export const SWATCHES: Record<string, string> = {
  'Midnight Black': '#14181C',
  'Cloud White': '#F4F3EE',
  'Sage Green': '#9EC8BC',
  'Forest Green': '#003D32',
  'Sand Beige': '#DCC9A6',
  Terracotta: '#C4714F',
  'Ocean Blue': '#2E5E6E',
  'Rose Gold': '#C9A27E',
  'Midnight Navy': '#1B2A4A',
  Olive: '#6B7A4B',
  Plum: '#5B3A57',
  Lavender: '#B9A7D6',
  'Slate Grey': '#6B7280',
  'Warm Cream': '#EFE7D6',
  Cognac: '#8A5A2B',
  Burgundy: '#6D2233',
  Emerald: '#0F6B4F',
  'Antique Gold': '#C9A227',
  'Heather Grey': '#A9A9A9',
  'Brushed Steel': '#C0C6CC',
  Chocolate: '#4A342A',
  'Dusty Rose': '#C98B8B',
  Ivory: '#F3EEE1',
  Charcoal: '#33383D',
  Sky: '#A8CBE0',
  Mustard: '#D4A017',
  Teal: '#1F6F6B',
};

interface CategoryMeta {
  code: string;
  returnDays: number;
  deliveryDays: number;
  lowStockAt: number;
  specs: string[];
  highlights: string[];
}

const M: Record<string, CategoryMeta> = {
  electronics: {
    code: 'ELE',
    returnDays: 14,
    deliveryDays: 2,
    lowStockAt: 12,
    specs: [
      'Brand|{brand}',
      'Model|{sku}',
      'Warranty|{warranty} months manufacturer cover',
      'Weight|{weight} kg',
      'Connectivity|USB-C, Bluetooth 5.3, 3.5 mm',
      'In the box|{name}, braided cable, quick-start guide',
      'Power source|Rechargeable lithium battery',
      'Origin|Assembled and quality-checked in {origin}',
    ],
    highlights: [
      '{brand} acoustic tuning with adaptive hybrid noise cancelling',
      'Up to 38 hours of playback with the included charging case',
      'IPX5 splash resistance for commutes, workouts and travel',
      'Low-latency mode for calls, gaming and video conferencing',
      'Firmware updates over the air for a longer supported life',
    ],
  },
  fashion: {
    code: 'FAS',
    returnDays: 30,
    deliveryDays: 4,
    lowStockAt: 15,
    specs: [
      'Brand|{brand}',
      'Style code|{sku}',
      'Fabric|{fabric}',
      'Fit|{fit}',
      'Care|Machine wash cold, do not bleach',
      'Country of origin|{origin}',
      'Model|Model is 183 cm and wears size M',
      'Return window|{returnDays} days, free within 30 days',
    ],
    highlights: [
      'Mid-weight {fabric} that keeps its shape after every wash',
      'Reinforced seams and bar-tacked stress points for daily wear',
      'Breathable weave that stays comfortable through long days',
      'Small-batch production from audited partner ateliers',
      'Water-repellent finish that shrugs off light rain',
    ],
  },
  'home-living': {
    code: 'HOM',
    returnDays: 30,
    deliveryDays: 6,
    lowStockAt: 8,
    specs: [
      'Brand|{brand}',
      'Collection|{sku}',
      'Material|{fabric}',
      'Dimensions|{dims}',
      'Assembly|Semi-assembled, tool-free fitting',
      'Care|Dust with a dry cloth, spot clean only',
      'Load rating|Up to 120 kg evenly distributed',
      'Origin|Designed in {origin}',
    ],
    highlights: [
      'Solid materials selected for a long, quiet service life',
      'Soft-touch finish that resists fingerprints and scuffs',
      'Neutral tones that sit easily in any room palette',
      'Flat-pack design that keeps shipping light and packaging low',
      'Replaceable parts so a single piece never ends the product’s life',
    ],
  },
  beauty: {
    code: 'BEA',
    returnDays: 14,
    deliveryDays: 3,
    lowStockAt: 20,
    specs: [
      'Brand|{brand}',
      'SKU|{sku}',
      'Volume|{volume}',
      'Skin type|All, including sensitive',
      'Key ingredients|Dermatologist-tested actives',
      'Free from|Parabens, sulphates, animal testing',
      'Shelf life|24 months unopened',
      'Origin|Manufactured in {origin}',
    ],
    highlights: [
      'Formulated with clinically studied actives at effective doses',
      'Dermatologist tested and suitable for daily use',
      'Lightweight, non-greasy texture that layers under makeup',
      'No parabens, sulphates or animal testing',
      'Refillable packaging to cut down on single-use plastic',
    ],
  },
};
M.sports = {
  code: 'SPT',
  returnDays: 30,
  deliveryDays: 5,
  lowStockAt: 10,
  specs: [
    'Brand|{brand}',
    'Model|{sku}',
    'Material|{fabric}',
    'Weight|{weight} kg',
    'Suitable for|Indoor and outdoor training',
    'Certification|CE and RoHS compliant',
    'Warranty|{warranty} years limited',
    'Origin|Manufactured in {origin}',
  ],
  highlights: [
    'Performance-grade materials tested by athletes and coaches',
    'Progressive resistance that scales from beginner to advanced',
    'Compact fold-down design for small apartments and travel',
    'Textured grip surfaces keep training steady and safe',
    'Backed by a multi-year replacement guarantee',
  ],
};

M['toys-kids'] = {
  code: 'TOY',
  returnDays: 30,
  deliveryDays: 5,
  lowStockAt: 12,
  specs: [
    'Brand|{brand}',
    'Set code|{sku}',
    'Material|{fabric}',
    'Age range|3 years and up',
    'Pieces|Shown in the listing imagery',
    'Safety|EN71-3 and ASTM F963 tested',
    'Packaging|Recycled cardboard, plastic-free',
    'Warranty|{warranty} months against defects',
  ],
  highlights: [
    'Encourages open-ended, screen-free imaginative play',
    'Non-toxic paints and materials, safety tested to EN71-3',
    'Durable construction designed for heavy everyday play',
    'Plastic-free recycled cardboard packaging',
    'Great as a birthday or holiday gift for ages three and up',
  ],
};

M.books = {
  code: 'BOK',
  returnDays: 30,
  deliveryDays: 4,
  lowStockAt: 18,
  specs: [
    'Title|{name}',
    'Publisher|{brand}',
    'Edition|{sku}',
    'Format|Hardback / Paperback',
    'Pages|{pages} pages',
    'Language|English',
    'ISBN|{sku}',
    'Released|{released}',
  ],
  highlights: [
    'Printed on FSC-certified uncoated paper for an easy read',
    'Thoughtfully typeset with generous margins and clear headings',
    'Includes further reading notes and a discussion guide',
    'Gift-ready with a durable cloth-bound finish',
    'From an independent publisher with global distribution',
  ],
};

M['pet-supplies'] = {
  code: 'PET',
  returnDays: 30,
  deliveryDays: 5,
  lowStockAt: 14,
  specs: [
    'Brand|{brand}',
    'Model|{sku}',
    'Material|{fabric}',
    'Weight|{weight} kg',
    'Suitable for|Dogs and cats, all sizes',
    'Safety|Non-toxic materials, bite-resistant seams',
    'Care|Wipe clean, machine washable at 30°C',
    'Origin|Designed in {origin}',
  ],
  highlights: [
    'Built for chewing, scratching and everyday enthusiasm',
    'Non-toxic materials with reinforced stitching throughout',
    'Machine washable so it stays hygienic with minimal effort',
    'Designed with veterinary behaviourists',
    'Recycled filling and OEKO-TEX certified fabrics',
  ],
};

M.travel = {
  code: 'TRV',
  returnDays: 30,
  deliveryDays: 6,
  lowStockAt: 10,
  specs: [
    'Brand|{brand}',
    'Model|{sku}',
    'Material|{fabric}',
    'Capacity|{volume}',
    'Weight|{weight} kg (empty)',
    'Warranty|{warranty} years limited',
    'Features|TSA lock, silent wheels, compression straps',
    'Origin|Designed in {origin}',
  ],
  highlights: [
    'Impact-resistant shell tested through 40+ luggage mishandling cycles',
    'Spinner wheels that roll silently on airport tile and cobbles',
    'Built-in TSA combination lock for airport peace of mind',
    'Compression panel keeps contents from shifting in transit',
    'Repairable hardware and a lifetime warranty on the shell',
  ],
};

M.accessories = {
  code: 'ACC',
  returnDays: 30,
  deliveryDays: 4,
  lowStockAt: 16,
  specs: [
    'Brand|{brand}',
    'Model|{sku}',
    'Material|{fabric}',
    'Dimensions|{dims}',
    'Lining|Suede or recycled polyester',
    'Warranty|{warranty} months',
    'Care|Wipe with a soft dry cloth',
    'Origin|Made in {origin}',
  ],
  highlights: [
    'Full-grain leather that develops a patina over years of use',
    'Hand-finished edges and reinforced stress stitching',
    'Slim profile that fits a pocket without bulk',
    'Recycled brass hardware with a brushed finish',
    'Presented in a reusable dust bag and gift box',
  ],
};

M.grocery = {
  code: 'GRO',
  returnDays: 14,
  deliveryDays: 3,
  lowStockAt: 25,
  specs: [
    'Brand|{brand}',
    'Pack code|{sku}',
    'Net weight|{volume}',
    'Storage|Cool, dry place away from direct sunlight',
    'Shelf life|{months} months unopened',
    'Ingredients|Sourced from certified suppliers',
    'Packaging|Recyclable, resealable pouch',
    'Origin|Produced in {origin}',
  ],
  highlights: [
    'Sourced from smallholder farms with traceable lots',
    'Roasted or blended in small batches for peak freshness',
    'No artificial colours or preservatives added',
    'Resealable packaging keeps it airtight after opening',
    'Every batch is lab tested before it ships',
  ],
};

M.office = {
  code: 'OFF',
  returnDays: 30,
  deliveryDays: 5,
  lowStockAt: 10,
  specs: [
    'Brand|{brand}',
    'Model|{sku}',
    'Material|{fabric}',
    'Dimensions|{dims}',
    'Compatibility|Windows, macOS, iPadOS and Android',
    'Power|USB-C, 12V low-voltage adapter included',
    'Warranty|{warranty} years limited',
    'Origin|Assembled in {origin}',
  ],
  highlights: [
    'Ergonomic design that reduces wrist and shoulder strain',
    'Whisper-quiet operation suited to shared offices',
    'Stacks and stores flat when not in use',
    'Built from recycled aluminium and ABS',
    'Two-year limited warranty with free firmware updates',
  ],
};

M.automotive = {
  code: 'AUT',
  returnDays: 30,
  deliveryDays: 5,
  lowStockAt: 12,
  specs: [
    'Brand|{brand}',
    'Part number|{sku}',
    'Compatibility|Universal fit for standard 12V systems',
    'Material|{fabric}',
    'Power|12V DC, low draw',
    'Installation|Plug and play, no rewiring',
    'Certification|CE, RoHS, E-mark',
    'Warranty|{warranty} years limited',
  ],
  highlights: [
    'Plug-and-play installation with no cutting or rewiring',
    'IP67 sealed against dust, rain and winter road salt',
    'Low draw on the vehicle electrical system',
    'Brushed finish that matches modern cabin trim',
    'Tested for vibration, heat and UV exposure',
  ],
};

M['health-wellness'] = {
  code: 'HLT',
  returnDays: 30,
  deliveryDays: 4,
  lowStockAt: 18,
  specs: [
    'Brand|{brand}',
    'Model|{sku}',
    'Net weight|{volume}',
    'Ingredients|Third-party tested for purity',
    'Dosage|As directed on the label',
    'Certification|GMP, ISO 22716 and vegan',
    'Shelf life|{months} months unopened',
    'Origin|Manufactured in {origin}',
  ],
  highlights: [
    'Third-party tested for purity and accurate labelling',
    'GMP-certified facility with documented batch traceability',
    'Free from fillers, artificial colours and common allergens',
    'Vegan, gluten-free and produced without animal testing',
    'Child-resistant packaging for safe storage',
  ],
};

function fillTemplate(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined && vars[key] !== '' ? String(vars[key]) : '—'
  );
}

function buildSpecs(
  meta: CategoryMeta,
  vars: Record<string, string | number>,
  subName: string,
  index: number
): Spec[] {
  const base = meta.specs.map((s) => {
    const [label, tpl] = s.split('|');
    return { label: fillTemplate(label, vars), value: fillTemplate(tpl, vars) };
  });
  base.push({ label: 'Category', value: subName });
  base.push({ label: 'Reference', value: `LUN-${vars.code}-${1000 + index}` });
  return base;
}

function buildVariants(seed: ProductSeed, index: number): ProductVariant[] {
  const variants: ProductVariant[] = [];
  const colors = seed.colors ?? [];
  const sizes = seed.sizes ?? [];
  colors.forEach((color, ci) => {
    variants.push({
      id: `v${index}-c${ci}`,
      type: 'color',
      label: 'Colour',
      value: color,
      swatch: SWATCHES[color] ?? '#C9CDC6',
      stock: Math.max(2, Math.round(seed.s / colors.length) + ((ci * 7) % 5)),
    });
  });
  sizes.forEach((size, si) => {
    variants.push({
      id: `v${index}-s${si}`,
      type: 'size',
      label: 'Size',
      value: size,
      stock: Math.max(1, Math.round(seed.s / sizes.length) + ((si * 3) % 4)),
    });
  });
  return variants;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function buildProduct(
  categorySlug: string,
  seed: ProductSeed,
  index: number,
  seenSlugs: Map<string, number>
): Product {
  const meta = M[categorySlug];
  const cat = getCategory(categorySlug)!;
  const subName = getSubcategoryName(categorySlug, seed.sub);
  const sku = `LUN-${meta.code}-${1000 + index}`;
  const baseSlug = slugify(seed.n);
  const count = (seenSlugs.get(baseSlug) ?? 0) + 1;
  seenSlugs.set(baseSlug, count);
  const slug = count > 1 ? `${baseSlug}-${count}` : baseSlug;

  const fabricPool = [
    '100% organic cotton',
    'Brushed Turkish cotton',
    'Recycled polyester blend',
    'Solid oak with linen upholstery',
    'Anodised aluminium',
    'Full-grain leather',
    'Stainless steel',
    'Borosilicate glass',
  ];
  const fitPool = ['Regular fit', 'Relaxed fit', 'Tailored slim', 'Oversized', 'Athletic'];
  const originPool = ['Vietnam', 'Portugal', 'Turkey', 'Italy', 'Japan', 'Mexico'];
  const pick = (pool: string[], salt: number) => pool[(index * 7 + salt * 13) % pool.length];

  const weight = seed.w ?? Number((0.2 + ((index * 3) % 18) / 10).toFixed(1));

  const vars: Record<string, string | number> = {
    brand: seed.b,
    name: seed.n,
    sku,
    code: meta.code,
    weight,
    warranty: seed.war ?? 12,
    fabric: pick(fabricPool, 1),
    fit: pick(fitPool, 2),
    origin: pick(originPool, 3),
    dims: `${60 + ((index * 7) % 40)} × ${40 + ((index * 11) % 30)} × ${20 + ((index * 5) % 25)} cm`,
    volume: `${50 + ((index * 13) % 400)} ml`,
    pages: 180 + ((index * 17) % 400),
    released: ['January', 'March', 'May', 'July', 'September', 'November'][(index + 3) % 6],
    months: 12 + ((index * 5) % 18),
    returnDays: meta.returnDays,
  };

  const highlights = [
    meta.highlights[index % meta.highlights.length],
    meta.highlights[(index + 2) % meta.highlights.length],
    meta.highlights[(index + 4) % meta.highlights.length],
  ];

  const isNew = seed.tags?.includes('new');
  const createdAt = daysAgo(isNew ? (index % 14) + 1 : 30 + ((index * 3) % 300));

  return {
    id: `p_${categorySlug}_${String(index + 1).padStart(2, '0')}`,
    sku,
    slug,
    name: seed.n,
    brand: seed.b,
    brandSlug: slugify(seed.b),
    category: cat.name,
    categorySlug,
    subcategory: subName,
    subcategorySlug: seed.sub,
    price: seed.p,
    originalPrice: seed.op,
    discountPct: seed.op ? Math.round(((seed.op - seed.p) / seed.op) * 100) : undefined,
    rating: seed.r,
    reviewCount: seed.rc,
    soldCount: seed.sold,
    stock: seed.s,
    lowStockAt: meta.lowStockAt,
    description: seed.d,
    highlights,
    specs: buildSpecs(meta, vars, subName, index),
    images: pickImages(categorySlug, index, 4),
    variants: buildVariants(seed, index),
    tags: seed.tags ?? ['featured'],
    weightKg: weight,
    warrantyMonths: seed.war ?? 12,
    returnDays: meta.returnDays,
    deliveryDays: meta.deliveryDays,
    createdAt,
  };
}

export function buildProducts(categorySlug: string, seeds: ProductSeed[]): Product[] {
  const seen = new Map<string, number>();
  return seeds.map((s, i) => buildProduct(categorySlug, s, i, seen));
}