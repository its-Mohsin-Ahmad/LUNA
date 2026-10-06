import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { CartPage } from '@/components/cart/CartPage';

export const metadata: Metadata = {
  title: 'Your bag',
  description: 'Review the items in your LUNA bag, apply a promo code and continue to checkout.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: true },
};

export default function CartRoute() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Bag' }]} />
        <h1 className="display mt-4 text-[30px] leading-tight text-forest sm:text-[36px]">
          Your bag
        </h1>
        <p className="mb-8 mt-1.5 text-sm text-muted">
          Items are reserved for 30 minutes once added.
        </p>
        <CartPage />
      </div>
    </Storefront>
  );
}