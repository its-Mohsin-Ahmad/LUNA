import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';

export const metadata: Metadata = {
  title: 'Secure checkout',
  description: 'Complete your LUNA order with encrypted payment and tracked delivery.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Bag', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />
        <h1 className="display mb-8 mt-4 text-[30px] leading-tight text-forest sm:text-[36px]">
          Checkout
        </h1>
        <CheckoutFlow />
      </div>
    </Storefront>
  );
}