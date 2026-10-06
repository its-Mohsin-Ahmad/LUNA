import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { AccountArea } from '@/components/account/AccountArea';

export const metadata: Metadata = {
  title: 'My account',
  description:
    'Manage your LUNA profile, orders, wishlist, addresses, notifications and shopping preferences.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'My account' }]} />
        <div className="mb-7 mt-4 space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            Welcome back
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[36px]">
            My account
          </h1>
        </div>
        <AccountArea />
      </div>
    </Storefront>
  );
}
