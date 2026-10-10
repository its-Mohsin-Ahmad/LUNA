import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryRail } from '@/components/home/CategoryRail';
import { ProductCarousel } from '@/components/home/ProductCarousel';
import { PromoCards, TestimonialSection, HomeNewsletter, TrustBar } from '@/components/home/homeSections';
import { HERO_SLIDES } from '@/lib/data/content';
import { getOnSale } from '@/lib/data/products';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  // The reference home page shows a single "Top Picks For You" rail made up of
  // discounted products (each card carries a % off badge) — mirror that here.
  const topPicks = getOnSale(8);

  return (
    <Storefront>
      <div className="pt-5 sm:pt-6">
        <HeroCarousel slides={HERO_SLIDES} />
      </div>

      <CategoryRail />
      <ProductCarousel
        eyebrow="Top picks"
        title="Top Picks For You ✨"
        products={topPicks}
        href="/shop/deals"
        hrefLabel="See All Deals"
      />
      <PromoCards />
      <TestimonialSection />
      <HomeNewsletter />
      <TrustBar />
    </Storefront>
  );
}