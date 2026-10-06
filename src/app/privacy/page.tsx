import type { Metadata } from 'next';
import Link from 'next/link';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'What data LUNA collects, why, who it is shared with, how long it is kept and the controls you have over it.',
  alternates: { canonical: '/privacy' },
};

const UPDATED = '1 April 2026';

const SECTIONS: { id: string; h: string; p: string[] }[] = [
  {
    id: 'collect',
    h: '1. What we collect',
    p: [
      'Account details you give us (name, email, phone, addresses), order and payment metadata (card tokens are handled by our payment processor — we never see or store full card numbers), and technical data such as device type and approximate location derived from your IP address.',
      'In this demo build, all state stays in your browser’s local storage and is never transmitted to a server.',
    ],
  },
  {
    id: 'use',
    h: '2. How we use it',
    p: [
      'To fulfil orders, provide support, prevent fraud, improve the shop experience and — only with your consent — send marketing you can unsubscribe from in one click.',
      'We do not sell personal data. We do not use third-party advertising trackers on this site.',
    ],
  },
  {
    id: 'share',
    h: '3. Who we share it with',
    p: [
      'Payment processors, courier partners and customs brokers receive the minimum data needed to complete your order. All processors are bound by contract to delete or return data once the task is done.',
      'Legal requests are honoured only where we are compelled to, and we notify you unless prohibited by law.',
    ],
  },
  {
    id: 'retain',
    h: '4. Retention and security',
    p: [
      'Order records are kept for 7 years for tax purposes. Support conversations are kept for 24 months. Everything else is deleted within 30 days of account closure.',
      'Data is encrypted in transit, access is limited by role, and staff access is audited.',
    ],
  },
  {
    id: 'rights',
    h: '5. Your rights',
    p: [
      'Access, correct, export or delete your data; withdraw consent for marketing; and object to profiling. Send requests to ' + SITE.supportEmail + ' — we respond within 5 working days.',
      'You can also adjust optional cookies from account settings at any time.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            Last updated {UPDATED}
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Privacy policy
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            The short version: we collect what an order needs, we never sell it, and you can make us
            delete the rest.
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
          See also the{' '}
          <Link href="/terms" className="font-semibold text-forest hover:underline">
            terms of service
          </Link>{' '}
          or{' '}
          <Link href="/contact" className="font-semibold text-forest hover:underline">
            contact us
          </Link>{' '}
          with any question.
        </p>
      </div>
    </Storefront>
  );
}