import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { AccountArea } from '@/components/account/AccountArea';

export const metadata: Metadata = {
  title: 'My wishlist',
  description: 'Your saved LUNA products — move them to the bag, compare or clear the list.',
  alternates: { canonical: '/account/wishlist' },
  robots: { index: false, follow: true },
};

export default function AccountWishlistPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'My account', href: '/account' },
            { label: 'Wishlist' },
          ]}
        />
        <div className="mt-4">
          <AccountArea initialTab="wishlist" />
        </div>
      </div>
    </Storefront>
  );
}