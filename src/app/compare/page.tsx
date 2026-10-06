import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ComparePage } from '@/components/product/ComparePage';

export const metadata: Metadata = {
  title: 'Compare products',
  description:
    'Compare up to four LUNA products side by side — price, rating, stock, delivery, returns and warranty in one table.',
  alternates: { canonical: '/compare' },
  robots: { index: false, follow: true },
};

export default function CompareRoute() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Compare' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            Up to 4 products
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Compare products
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            The details that matter, lined up — price, availability, delivery, returns and warranty,
            without flicking between tabs.
          </p>
        </header>

        <ComparePage />
      </div>
    </Storefront>
  );
}