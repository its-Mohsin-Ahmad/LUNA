import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryRail } from '@/components/home/CategoryRail';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { FlashSale } from '@/components/home/FlashSale';
import { PopularCategories } from '@/components/home/PopularCategories';
import { PromoCards, BrandStrip, TestimonialSection, HomeNewsletter, TrustBar } from '@/components/home/homeSections';
import { HERO_SLIDES } from '@/lib/data/content';
import {
  getFeatured,
  getNewArrivals,
  getBestSellers,
  getTopRated,
  getOnSale,
  getProductsByIds,
} from '@/lib/data/products';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const featured = getFeatured(10);
  const newArrivals = getNewArrivals(10);
  const bestSellers = getBestSellers(10);
  const topRated = getTopRated(10);
  const flashSale = getOnSale(8);

  // "Recommended" blends rating and popularity, excluding items already shown.
  const shownIds = new Set([
    ...featured.map((p) => p.id),
    ...newArrivals.map((p) => p.id),
  ]);
  const recommended = getProductsByIds(
    [...bestSellers, ...topRated]
      .filter((p) => !shownIds.has(p.id))
      .map((p) => p.id)
      .slice(0, 10)
  );

  return (
    <Storefront>
      <div className="pt-5 sm:pt-6">
        <HeroCarousel slides={HERO_SLIDES} />
      </div>

      <CategoryRail />
      <ProductCarousel
        eyebrow="Top picks"
        title="Chosen by our buyers"
        description="The pieces our team keeps coming back to, across every department."
        products={featured}
        href="/shop?tag=featured"
        hrefLabel="All top picks"
      />
      <PromoCards />
      <ProductCarousel
        eyebrow="Just landed"
        title="New arrivals"
        description="Fresh from our partner ateliers and warehouses this week."
        products={newArrivals}
        href="/new-arrivals"
        tone="cream"
      />
      <FlashSale products={flashSale} />
      <ProductCarousel
        eyebrow="Trending"
        title="Trending this week"
        description="What is moving fastest across LUNA right now."
        products={bestSellers}
        href="/shop?sort=popular"
        hrefLabel="Most popular"
      />
      <PopularCategories />
      <BrandStrip />
      <ProductCarousel
        eyebrow="For you"
        title="Recommended"
        description="Highly rated products we think will suit how you shop."
        products={recommended}
        href="/shop?sort=rating"
        hrefLabel="Top rated"
        tone="white"
      />
      <TestimonialSection />
      <HomeNewsletter />
      <TrustBar />
    </Storefront>
  );
}