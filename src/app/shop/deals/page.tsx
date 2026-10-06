import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/ui/feedback';
import { FlashSale } from '@/components/home/FlashSale';
import { getOnSale } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Deals and discounts',
  description:
    'Live flash sale plus every markdown across LUNA — up to 60% off electronics, fashion, home, beauty and grocery, while stock lasts.',
  alternates: { canonical: '/shop/deals' },
};

export default function DealsPage() {
  const deals = getOnSale(24);

  return (
    <Storefront>
      <FlashSale products={getOnSale(8)} />

      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Deals' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sale">
            {deals.length} marked down
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Deals &amp; discounts
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Every markdown in one place, from end-of-season lines to bundle pricing. Prices are
            honest and include free returns within the standard window.
          </p>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ShopBrowser products={deals} />
        </Suspense>
      </div>
    </Storefront>
  );
}