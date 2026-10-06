import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/ui/feedback';
import { SmartImage } from '@/components/ui/SmartImage';
import { CATEGORIES, getCategory } from '@/lib/data/categories';
import { getProductsByCategory } from '@/lib/data/products';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: 'Category not found' };
  return {
    title: `Shop ${category.name}`,
    description: `${category.tagline}. Browse ${getProductsByCategory(slug).length} curated ${category.name.toLowerCase()} products with free returns over $99.`,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: { title: `Shop ${category.name} | LUNA`, description: category.tagline },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = getProductsByCategory(slug);

  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: category.name },
          ]}
        />

        {/* Category hero */}
        <header className="mb-8 grid gap-5 overflow-hidden rounded-2xl border border-line bg-white sm:grid-cols-[minmax(0,1fr)_240px]">
          <div className="space-y-2.5 p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
              {products.length} products · {category.subcategories.length} sections
            </p>
            <h1 className="display text-[30px] leading-tight text-forest sm:text-[36px]">
              {category.name}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted">{category.tagline}</p>

            <ul className="flex flex-wrap gap-1.5 pt-1.5">
              {category.subcategories.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={`/shop/${category.slug}?sub=${sub.slug}`}
                    className="inline-block rounded-full border border-line bg-warm px-3 py-1.5 text-[12.5px] font-medium text-ink transition hover:border-forest hover:bg-cream hover:text-forest"
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <SmartImage
            src={category.image}
            alt={category.name}
            seed={`hero-${category.slug}`}
            aspect="4/3"
            wrapperClassName="hidden sm:block"
          />
        </header>

        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopBrowser products={products} />
        </Suspense>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-cream/60 px-6 py-6">
          <p className="text-sm text-muted">
            Looking for something specific? Search the whole catalogue.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline"
          >
            Browse all products
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Storefront>
  );
}