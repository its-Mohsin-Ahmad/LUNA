import type { Metadata } from 'next';
import Link from 'next/link';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of service',
  description:
    'The plain-language rules for using LUNA — accounts, orders, returns, marketplace conduct and liability.',
  alternates: { canonical: '/terms' },
};

const UPDATED = '1 April 2026';

const SECTIONS: { id: string; h: string; p: string[] }[] = [
  {
    id: 'using-luna',
    h: '1. Using LUNA',
    p: [
      'By using this site you agree to these terms. You must be at least 18 (or the age of majority where you live) to place an order, and you are responsible for everything done from your account.',
      'We may update these terms from time to time. Material changes will be announced by email to registered accounts at least 14 days before they take effect.',
    ],
  },
  {
    id: 'orders',
    h: '2. Orders and pricing',
    p: [
      'An order is an offer to buy. A contract forms when we send confirmation that the goods have been dispatched. Prices include applicable VAT for your region; duties for international orders are shown at checkout.',
      'If a product is mispriced or becomes unavailable after you order, we will contact you within one business day and either match the price or cancel with a full refund.',
    ],
  },
  {
    id: 'returns',
    h: '3. Returns, refunds and warranties',
    p: [
      'Most categories can be returned free within 30 days (14 days for electronics), unused and in original packaging. Refunds are issued within two business days of the return arriving at our warehouse.',
      'Manufacturer warranties are honoured on every product we sell; LUNA handles the claim for you during the first 12 months so you never deal with the factory yourself.',
    ],
  },
  {
    id: 'accounts',
    h: '4. Accounts and security',
    p: [
      'Keep your credentials confidential and tell us immediately if you suspect unauthorised access. We will never ask for your password by email, phone or chat.',
      'You can delete your account and all associated data at any time from account settings or by writing to ' + SITE.supportEmail + '.',
    ],
  },
  {
    id: 'marketplace',
    h: '5. Marketplace conduct',
    p: [
      'Sellers warrant that their listings are accurate and that they hold the rights to sell the products. Counterfeit goods, unsafe products and misleading listings result in immediate removal.',
      'Reviews must be your own experience. Incentivised or fabricated reviews lead to account suspension for both buyer and seller.',
    ],
  },
  {
    id: 'liability',
    h: '6. Liability',
    p: [
      'Nothing in these terms limits liability that cannot be limited by law, including liability for fraud, death or personal injury caused by negligence.',
      'For all other claims, our liability is limited to the amount you paid for the order in question within the preceding 12 months.',
    ],
  },
];

export default function TermsPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of service' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            Last updated {UPDATED}
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Terms of service
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Written to be read, not skipped. Short version: buy in good faith, sell honestly, and we
            will do the same.
          </p>
        </header>

        <div className="max-w-3xl space-y-7">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-36">
              <h2 className="text-base font-bold text-ink">{s.h}</h2>
              {s.p.map((para) => (
                <p key={para.slice(0, 32)} className="mt-2.5 text-sm leading-relaxed text-muted">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-10 max-w-3xl border-t border-line pt-6 text-[13px] text-muted">
          Questions? Read the{' '}
          <Link href="/privacy" className="font-semibold text-forest hover:underline">
            privacy policy
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="font-semibold text-forest hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </Storefront>
  );
}