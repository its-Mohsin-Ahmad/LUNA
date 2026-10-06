import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/ui/feedback';
import { CATEGORIES } from '@/lib/data/categories';
import { PRODUCTS } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Shop all products',
  description:
    'Browse every LUNA department — 190+ curated products across electronics, fashion, home, beauty, sports, grocery and more.',
  alternates: { canonical: '/shop' },
};

export default function ShopPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            {PRODUCTS.length} products · {CATEGORIES.length} categories
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Shop everything
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Every product on LUNA in one place. Filter by category, brand, price or rating to
            narrow things down quickly.
          </p>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopBrowser products={PRODUCTS} />
        </Suspense>
      </div>
    </Storefront>
  );
}