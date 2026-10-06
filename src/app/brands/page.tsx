import type { Metadata } from 'next';
import Link from 'next/link';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { BRANDS } from '@/lib/data/products/brands';
import { getProductsByBrand as byBrand } from '@/lib/data/products';
import { getCategory } from '@/lib/data/categories';
import { compactNumber } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'All brands',
  description:
    'Every label stocked by LUNA, from Sony and Nike to West Elm and Cerave — browse by brand with live product counts.',
  alternates: { canonical: '/brands' },
};

export default function BrandsPage() {
  const brands = [...BRANDS].sort((a, b) => byBrand(b.slug).length - byBrand(a.slug).length);

  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Brands' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            {brands.length} labels
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Brands A to Z
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Every brand we stock, vetted for build quality, repairability and honest pricing. Pick
            one to see its full range on LUNA.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => {
            const count = byBrand(brand.slug).length;
            const category = getCategory(brand.category);
            return (
              <li key={brand.id}>
                <Link
                  href={`/brand/${brand.slug}`}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-forest/40 hover:shadow-card-hover sm:p-5"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-cream text-sm font-bold text-forest transition group-hover:bg-forest group-hover:text-cream">
                    {brand.initials}
                  </span>
                  <span className="flex-1">
                    <span className="clamp-1 block text-sm font-bold text-ink group-hover:text-forest">
                      {brand.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {brand.country}
                      {category ? ` · ${category.name}` : ''}
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-forest-400">
                    {compactNumber(count)} product{count === 1 ? '' : 's'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Storefront>
  );
}