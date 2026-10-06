import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { AccountArea } from '@/components/account/AccountArea';

export const metadata: Metadata = {
  title: 'My orders',
  description: 'Every LUNA order with live status, invoices, tracking and one-tap reorders.',
  alternates: { canonical: '/account/orders' },
  robots: { index: false, follow: true },
};

export default function AccountOrdersPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'My account', href: '/account' },
            { label: 'Orders' },
          ]}
        />
        <div className="mt-4">
          <AccountArea initialTab="orders" />
        </div>
      </div>
    </Storefront>
  );
}