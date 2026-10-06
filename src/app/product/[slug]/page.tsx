import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { PRODUCTS, getProductBySlug, getRelatedProducts } from '@/lib/data/products';
import { getBrand } from '@/lib/data/products/brands';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product not found' };

  const title = `${product.name} — ${product.brand} | LUNA`;
  const description = `${product.description.slice(0, 155)}…`;

  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: 'website',
      title,
      description,
      images: [{ url: product.images[0], width: 900, height: 900, alt: product.name }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 10);
  const brand = getBrand(product.brandSlug);
  const alsoByBrand = brand
    ? PRODUCTS.filter(
        (p) => p.brandSlug === brand.slug && p.id !== product.id
      ).slice(0, 10)
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    image: product.images,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <Storefront>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: product.category, href: `/shop/${product.categorySlug}` },
            { label: product.name },
          ]}
        />
        <div className="mt-6">
          <ProductDetail product={product} />
        </div>
      </div>

      {alsoByBrand.length >= 4 && (
        <ProductCarousel
          eyebrow="More from this brand"
          title={`Other ${brand?.name} picks`}
          products={alsoByBrand}
          href={brand ? `/brand/${brand.slug}` : '/shop'}
          tone="cream"
        />
      )}

      {related.length > 0 && (
        <ProductCarousel
          eyebrow="You may also like"
          title="Similar products"
          description={`Other customers also looked at these ${product.subcategory.toLowerCase()} picks.`}
          products={related}
          href={`/shop/${product.categorySlug}?sub=${product.subcategorySlug}`}
        />
      )}
    </Storefront>
  );
}