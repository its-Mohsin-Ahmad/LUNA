import type { Brand, Review } from '../../types';
import { avatar } from '../../images';
import { PRODUCTS } from './index';

const brandCountry: Record<string, string> = {
  sony: 'Japan', samsung: 'South Korea', apple: 'United States', bose: 'United States',
  jbl: 'United States', dell: 'United States', lenovo: 'China', canon: 'Japan',
  gopro: 'United States', razer: 'Singapore', lg: 'South Korea', philips: 'Netherlands',
  ring: 'United States', uniqlo: 'Japan', zara: 'Spain', nike: 'United States',
  dockers: 'United States', salomon: 'France', levis: 'United States', barbour: 'United Kingdom',
  pajama: 'United Kingdom', 'west-elm': 'United States', ikea: 'Sweden',
  'herman-miller': 'United States', coyuchi: 'United States', tempur: 'United States',
  caraway: 'United States', fellowship: 'United States', article: 'Canada', 'hm-home': 'Sweden',
  umbra: 'Canada', schoolhouse: 'United States', brooklinen: 'United States', cerave: 'United States',
  neutrogena: 'United States', 'la-roche-posay': 'France', lancome: 'France', mac: 'United States',
  'kiko-milano': 'Italy', fenty: 'United States', 'the-body-shop': 'United Kingdom',
  'tom-ford': 'United States', 'acqua-di-parma': 'Italy', 'moroccan-oil': 'United States',
  batiste: 'United States', harrys: 'United States', foreo: 'Sweden', bowflex: 'United States',
  manduka: 'United States', gaiam: 'United States', spalding: 'United States',
  specialized: 'United States', 'the-north-face': 'United States', osprey: 'United States',
  speedo: 'United Kingdom', everlast: 'United States', lego: 'Denmark',
  'ceaseless-games': 'United States', ravensburger: 'Germany', hasbro: 'United States',
  'spin-master': 'Canada', barbie: 'United States', strider: 'United States', hape: 'Germany',
  'snap-circuits': 'United States', 'national-geographic': 'United States',
  'little-sleep-co': 'United States', ergobaby: 'United States', penguin: 'United Kingdom',
  bloomsbury: 'United Kingdom', 'grand-central': 'United States', doubleday: 'United States',
  oreilly: 'United States', pearson: 'United Kingdom', 'image-comics': 'United States',
  'ten-speed': 'United States', 'chelsea-green': 'United States', knopf: 'United States',
  faber: 'United Kingdom', parker: 'United States', orvis: 'United States',
  hurtownia: 'Poland', 'wild-earth': 'United States', catit: 'Canada', nylabone: 'United States',
  kong: 'United States', prevue: 'United States', furminator: 'United States',
  petsafe: 'United States', 'noble-pet': 'United States', pinecle: 'United States',
  ezyDog: 'United States', away: 'United States', rimowa: 'Germany', monos: 'United States',
  'peak-design': 'United States', 'eagle-creek': 'United States', travelrest: 'United States',
  anker: 'China', kikkerland: 'United States', jisulife: 'China', msr: 'United States',
  'mountain-hardwear': 'United States', soto: 'Japan', 'black-diamond': 'United States',
  pelican: 'United States', timex: 'United States', seiko: 'Japan', mvmt: 'United States',
  'ray-ban': 'United States', 'warby-parker': 'United States', bellroy: 'Australia',
  ekobo: 'Finland', madewell: 'United States', coach: 'United States', 'new-era': 'United States',
  pandora: 'Denmark', vnox: 'United States', knirps: 'United States', 'blue-bottle': 'United States',
  'rishi-tea': 'United States', stumptown: 'United States', 'jade-leaf': 'Japan',
  'kettle-brand': 'United States', 'clif-builders': 'United States', justins: 'United States',
  daawat: 'India', graza: 'Greece', tropicana: 'United States', 'san-pellegrino': 'Italy',
  lindt: 'Switzerland', ferrero: 'Italy', ortiz: 'Spain', flexispot: 'China',
  ergotron: 'United States', branch: 'United States', secretlab: 'Singapore',
  'leuchtturm1917': 'Germany', ugmonk: 'United States', epson: 'Japan', asus: 'Taiwan',
  jabra: 'Denmark', caldigit: 'United States', fellowes: 'United States', wera: 'Germany',
  pioneer: 'Japan', focal: 'France', 'chemical-guys': 'United States', gyeon: 'South Korea',
  thinkware: 'South Korea', govee: 'China', drego: 'China', weathertech: 'United States',
  alpinestars: 'Italy', shoei: 'Japan', autel: 'United States', tekton: 'United States',
  thorne: 'United States', 'nordic-naturals': 'United States', omron: 'Japan', concec: 'China',
  higherdose: 'United States', yaeyard: 'United States', neom: 'United States',
  mzzzz: 'United States', 'adventure-medical': 'United States',
  'north-american-rescue': 'United States', 'oral-b': 'United States', daisycup: 'United States',
  betteryou: 'United States',
};

export const BRANDS: Brand[] = Array.from(new Set(PRODUCTS.map((p) => p.brandSlug))).map(
  (slug, i) => {
    const sample = PRODUCTS.find((p) => p.brandSlug === slug)!;
    const name = sample.brand;
    const country = brandCountry[slug] ?? 'International';
    return {
      id: `brand_${i + 1}`,
      slug,
      name,
      initials: name
        .split(/[\s-]/)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      country,
      category: sample.categorySlug,
      description: `${name} is a ${country}-based label stocked by LUNA for build quality, repairability and honest pricing across our ${sample.category} range.`,
    };
  }
);

export const getBrand = (slug: string): Brand | undefined => BRANDS.find((b) => b.slug === slug);

export const getBrandsByCategory = (categorySlug: string): Brand[] =>
  BRANDS.filter((b) => b.category === categorySlug);

/* ------------------------------ Reviews ------------------------------ */

const REVIEW_AUTHORS = [
  'Amelia Hart', 'Daniel Okafor', 'Sofia Marchetti', 'Ravi Menon', 'Hannah Lindqvist',
  'Marcus Bell', 'Yuki Tanaka', 'Nadia Haddad', 'Peter Novak', 'Grace Oyelaran',
  'Lucas Ferreira', 'Emma Novak', 'Aisha Rahman', 'Tomas Eriksen', 'Chloe Dubois',
  'Isabel Moreno',
];

const REVIEW_TITLES = [
  'Exactly what I hoped for', 'Worth every penny', 'Solid build, arrived fast',
  'Better than the one it replaced', 'Good, with one small caveat',
  'Impressive for the price', 'Would buy again', 'Handles a lot of use',
  'Looks great and works well', 'Packaging and product both feel premium',
  'Great everyday choice', 'Nearly perfect',
];

const REVIEW_BODIES = [
  'Ordered on Tuesday and it arrived Thursday with tracking updates the whole way. The finish is even better in person than on the product page.',
  'I compared three options before settling on this and it has held up to daily use without a single complaint so far.',
  'The product photos are accurate. It is slightly heavier than I expected, which for me is a plus, but worth knowing if you travel with it.',
  'Support answered my question about sizing within a couple of hours, which made the whole process painless.',
  'Second one I have bought from this category and the quality is consistent across the range, which is rare.',
  'Works exactly as described. I have recommended it to two colleagues who both ordered within a week.',
  'The materials feel substantial and the finish is even. Six months of near-daily use and it still looks new.',
  'Delivery was a day ahead of the estimate. Packaging was minimal and recyclable, which I appreciate.',
  'It does one job extremely well. Nothing flashy, just a well-made product at a fair price.',
  'Took a star off only because the manual is thin, but the product itself needs no explaining.',
];

export function getReviews(productId: string, limit?: number): Review[] {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return [];
  const seedNum = productId.split('').reduce((n, c) => n + c.charCodeAt(0), 0);
  const count = Math.min(limit ?? 5, 8);
  return Array.from({ length: count }, (_, i) => {
    const rating = i === 0 ? Math.max(4, Math.round(product.rating)) : 3 + ((seedNum + i * 3) % 3);
    return {
      id: `${productId}-rev-${i + 1}`,
      productId,
      author: REVIEW_AUTHORS[(seedNum + i) % REVIEW_AUTHORS.length],
      avatar: avatar(seedNum + i * 5, i % 3 === 0 ? 'men' : 'women'),
      rating,
      title: REVIEW_TITLES[(seedNum + i * 2) % REVIEW_TITLES.length],
      body: REVIEW_BODIES[(seedNum + i * 4) % REVIEW_BODIES.length],
      date: new Date(Date.now() - (3 + ((seedNum + i * 11) % 120)) * 86400000).toISOString(),
      verified: (seedNum + i) % 4 !== 0,
      helpful: 3 + ((seedNum + i * 7) % 90),
    };
  });
}

export function getReviewSummary(productId: string): {
  average: number;
  total: number;
  buckets: number[];
} {
  const product = PRODUCTS.find((p) => p.id === productId);
  const total = product?.reviewCount ?? 0;
  const average = product?.rating ?? 0;
  const weights = [0.62, 0.24, 0.08, 0.04, 0.02];
  const buckets = weights.map((w, i) => Math.round(w * total * (i === 0 ? 1.02 : 0.97)));
  return { average, total, buckets };
}