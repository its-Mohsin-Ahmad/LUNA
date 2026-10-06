import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/ui/feedback';
import { getNewArrivals } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'New arrivals',
  description:
    'The newest additions to LUNA — fresh drops across electronics, fashion, home and beauty, sorted newest first.',
  alternates: { canonical: '/new-arrivals' },
};

export default function NewArrivalsPage() {
  const fresh = getNewArrivals(48);

  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'New arrivals' }]} />

        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Just landed · {fresh.length} pieces
            </p>
            <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
              New arrivals
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              Fresh from our partner ateliers and warehouses this week, sorted newest first. Move
              fast — the interesting ones rarely stay long.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline"
          >
            Browse everything
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopBrowser products={fresh} defaultSort="newest" />
        </Suspense>
      </div>
    </Storefront>
  );
}