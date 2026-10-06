import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { OrderNumberFromQuery } from '@/components/checkout/OrderNumberFromQuery';
import { Skeleton } from '@/components/ui/feedback';

export const metadata: Metadata = {
  title: 'Order confirmation',
  description: 'Your LUNA order summary, delivery timeline and tracking details.',
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: 'Order confirmation' },
          ]}
        />
        {/* useSearchParams needs a Suspense boundary for static prerendering */}
        <Suspense
          fallback={
            <div className="space-y-6" aria-busy="true">
              <Skeleton className="h-72 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          }
        >
          <OrderNumberFromQuery />
        </Suspense>
      </div>
    </Storefront>
  );
}