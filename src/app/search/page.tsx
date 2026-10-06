import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/ui/feedback';
import { PRODUCTS } from '@/lib/data/products';
import { CATEGORIES } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search the full LUNA catalogue — products, brands, categories and descriptions, with filters for price, rating and stock.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
};

const POPULAR = [
  'Headphones',
  'Running shoes',
  'Coffee beans',
  'Skincare',
  'Desk lamp',
  'Backpack',
];

export default function SearchPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />

        <header className="mb-6 max-w-2xl space-y-3">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            <Search className="h-3.5 w-3.5" aria-hidden />
            Catalogue search
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Find it in seconds
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Results update as you type in the header search. Narrow them down with the filters, or
            jump back to a recent term from your account activity.
          </p>
        </header>

        <div className="mb-7 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Popular:
          </span>
          {POPULAR.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink transition hover:border-forest hover:bg-cream hover:text-forest"
            >
              {term}
            </Link>
          ))}
          <span className="text-[12.5px] text-muted">· or browse</span>
          {CATEGORIES.slice(0, 3).map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="rounded-full border border-forest/25 bg-cream px-3 py-1.5 text-[12.5px] font-semibold text-forest transition hover:bg-forest hover:text-cream"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopBrowser products={PRODUCTS} />
        </Suspense>
      </div>
    </Storefront>
  );
}