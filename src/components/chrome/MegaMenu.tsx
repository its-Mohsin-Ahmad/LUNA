'use client';

/* ------------------------------------------------------------------ */
/* Mega menu panel: category hero, subcategories and popular picks     */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { CATEGORIES } from '@/lib/data/categories';
import { getProductsByCategory, getProductsByIds } from '@/lib/data/products';
import { SmartImage } from '@/components/ui/SmartImage';
import { Price } from '@/components/ui/primitives';

export function MegaMenu({ slug }: { slug: string }) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return null;

  const picks = getProductsByIds(
    getProductsByCategory(slug)
      .slice(0, 4)
      .map((p) => p.id)
  );

  return (
    <div className="absolute inset-x-0 top-full z-40 border-y border-line bg-white shadow-card-hover animate-fadeUp">
      <div className="shell grid grid-cols-12 gap-8 py-7">
        <div className="col-span-3">
          <Link href={`/shop/${cat.slug}`} className="group block">
            <SmartImage
              src={cat.image}
              alt={cat.name}
              seed={cat.slug}
              aspect="4/3"
              wrapperClassName="overflow-hidden rounded-xl"
              className="transition-transform duration-500 group-hover:scale-105"
            />
            <p className="mt-3 text-sm font-semibold text-forest group-hover:underline">
              Shop all {cat.name}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{cat.tagline}</p>
          </Link>
        </div>

        <div className="col-span-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Subcategories
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {cat.subcategories.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={`/shop/${cat.slug}?sub=${sub.slug}`}
                  className="block rounded-md py-1 text-sm text-ink transition-colors hover:text-forest"
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-1.5">
            <Link
              href={`/shop/${cat.slug}?sort=popular`}
              className="text-sm font-semibold text-forest hover:underline"
            >
              Best sellers
            </Link>
            <Link
              href={`/shop/${cat.slug}?sort=discount`}
              className="text-sm font-semibold text-sale hover:underline"
            >
              On sale now
            </Link>
          </div>
        </div>

        <div className="col-span-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Popular right now
          </p>
          <ul className="grid grid-cols-2 gap-3">
            {picks.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/product/${p.slug}`}
                  className="group flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-cream/60"
                >
                  <SmartImage
                    src={p.images[0]}
                    alt={p.name}
                    seed={p.sku}
                    aspect="square"
                    wrapperClassName="h-12 w-12 shrink-0 rounded-lg"
                  />
                  <span className="min-w-0">
                    <span className="clamp-2 block text-[13px] font-medium leading-snug text-ink group-hover:text-forest">
                      {p.name}
                    </span>
                    <Price amount={p.price} size="sm" className="mt-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}