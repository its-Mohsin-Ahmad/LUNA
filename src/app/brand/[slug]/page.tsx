import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductGridSkeleton } from '@/components/ui/feedback';
import { BRANDS, getBrand } from '@/lib/data/products/brands';
import { getProductsByBrand } from '@/lib/data/products';
import { getCategory } from '@/lib/data/categories';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: 'Brand not found' };
  return {
    title: `${brand.name} — shop the range`,
    description: `${brand.description} Browse ${getProductsByBrand(slug).length} ${brand.name} products on LUNA with free returns over $99.`,
    alternates: { canonical: `/brand/${slug}` },
    openGraph: { title: `${brand.name} | LUNA`, description: brand.description },
  };
}

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const products = getProductsByBrand(slug);
  const category = getCategory(brand.category);

  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Brands', href: '/brands' },
            { label: brand.name },
          ]}
        />

        {/* Brand hero */}
        <header className="mb-8 grid gap-5 rounded-2xl border border-line bg-white p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-8">
          <span className="grid h-20 w-20 place-items-center rounded-2xl bg-forest text-2xl font-bold text-cream sm:h-24 sm:w-24 sm:text-3xl">
            {brand.initials}
          </span>
          <div className="space-y-2.5">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
              <span>{products.length} products</span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" aria-hidden />
                {brand.country}
              </span>
              {category && <span>{category.name}</span>}
            </p>
            <h1 className="display text-[30px] leading-tight text-forest sm:text-[36px]">
              {brand.name}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted">{brand.description}</p>
            <Link
              href={`/shop?brand=${brand.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:underline"
            >
              Filter the whole shop by {brand.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ShopBrowser products={products} />
        </Suspense>
      </div>
    </Storefront>
  );
}