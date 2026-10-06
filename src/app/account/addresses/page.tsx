import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { AccountArea } from '@/components/account/AccountArea';

export const metadata: Metadata = {
  title: 'My addresses',
  description: 'Save delivery addresses for a checkout that remembers everything.',
  alternates: { canonical: '/account/addresses' },
  robots: { index: false, follow: true },
};

export default function AccountAddressesPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'My account', href: '/account' },
            { label: 'Addresses' },
          ]}
        />
        <div className="mt-4">
          <AccountArea initialTab="addresses" />
        </div>
      </div>
    </Storefront>
  );
}