import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { AccountArea } from '@/components/account/AccountArea';

export const metadata: Metadata = {
  title: 'Account settings',
  description:
    'Control your LUNA currency, language, motion preferences, notifications and account data.',
  alternates: { canonical: '/account/settings' },
  robots: { index: false, follow: true },
};

export default function AccountSettingsPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'My account', href: '/account' },
            { label: 'Settings' },
          ]}
        />
        <div className="mt-4">
          <AccountArea initialTab="settings" />
        </div>
      </div>
    </Storefront>
  );
}