import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { WishlistPage } from '@/components/product/WishlistPage';

export const metadata: Metadata = {
  title: 'Your wishlist',
  description: 'Everything you have saved on LUNA, ready to add to your bag.',
  robots: { index: false, follow: true },
};

export default function WishlistRoute() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]} />
        <h1 className="display mb-8 mt-4 text-[30px] leading-tight text-forest sm:text-[36px]">
          Your wishlist
        </h1>
        <WishlistPage />
      </div>
    </Storefront>
  );
}