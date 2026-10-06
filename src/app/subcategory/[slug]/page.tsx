import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/ui/feedback';
import { CATEGORIES } from '@/lib/data/categories';
import { PRODUCTS } from '@/lib/data/products';

type Params = { params: Promise<{ slug: string }> };

/** Every subcategory slug across every category (deduplicated). */
function allSubSlugs(): string[] {
  return [...new Set(CATEGORIES.flatMap((c) => c.subcategories.map((s) => s.slug)))];
}

/** Subcategory slugs are unique per category; resolve globally by slug. */
function resolveSub(slug: string) {
  for (const category of CATEGORIES) {
    const sub = category.subcategories.find((s) => s.slug === slug);
    if (sub) return { category, sub };
  }
  return null;
}

export function generateStaticParams() {
  return allSubSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const hit = resolveSub(slug);
  if (!hit) return { title: 'Section not found' };
  const count = PRODUCTS.filter((p) => p.subcategorySlug === slug).length;
  return {
    title: `${hit.sub.name} — ${hit.category.name}`,
    description: `Shop ${hit.sub.name.toLowerCase()} within ${hit.category.name} — ${count} products with free returns over $99.`,
    alternates: { canonical: `/subcategory/${slug}` },
  };
}

export default async function SubcategoryPage({ params }: Params) {
  const { slug } = await params;
  const hit = resolveSub(slug);
  if (!hit) notFound();

  const products = PRODUCTS.filter((p) => p.subcategorySlug === slug);

  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: hit.category.name, href: `/shop/${hit.category.slug}` },
            { label: hit.sub.name },
          ]}
        />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            {products.length} products · {hit.category.name}
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[36px]">
            {hit.sub.name}
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            {`Everything in ${hit.sub.name.toLowerCase()} — filtered to this section of the ${hit.category.name.toLowerCase()} department.`}
          </p>
          <Link
            href={`/shop/${hit.category.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline"
          >
            See all {hit.category.name}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopBrowser products={products} />
        </Suspense>
      </div>
    </Storefront>
  );
}