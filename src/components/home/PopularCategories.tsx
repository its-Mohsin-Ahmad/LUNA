import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { getProductsByCategory } from '@/lib/data/products';
import { getSubcategoryName } from '@/lib/data/categories';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionHeading } from '@/components/ui/feedback';

/** Four editorial tiles for the highest-volume categories. */
export function PopularCategories() {
  const featured = CATEGORIES.slice(0, 4);

  return (
    <section className="shell py-10 sm:py-14" aria-labelledby="popular-categories-heading">
      <SectionHeading
        eyebrow="Most browsed"
        title="Popular categories"
        description="Where most LUNA customers start — and end up buying again."
        action={
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
          >
            Explore everything
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((cat) => {
          const count = getProductsByCategory(cat.slug).length;
          const subs = cat.subcategories.slice(0, 3);
          return (
            <li key={cat.slug}>
              <div className="group h-full overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-card-hover">
                <Link href={`/shop/${cat.slug}`} className="block">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    seed={`pop-${cat.slug}`}
                    aspect="4/3"
                    wrapperClassName="overflow-hidden"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="display text-lg text-forest">{cat.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{cat.tagline}</p>
                  </div>
                </Link>
                <ul className="space-y-1 border-t border-line px-4 py-3">
                  {subs.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/shop/${cat.slug}?sub=${sub.slug}`}
                        className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-ink transition hover:bg-cream hover:text-forest"
                      >
                        {getSubcategoryName(cat.slug, sub.slug)}
                        <ArrowRight className="h-3 w-3 text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="border-t border-line px-4 py-2.5 text-[11px] text-muted">
                  {count} products in stock
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}