import type { Metadata } from 'next';
import { ArrowRight, BadgeDollarSign, BarChart3, PackageCheck, Store } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { Accordion } from '@/components/ui/overlays';
import { LinkButton } from '@/components/ui';
import { SITE, COMMERCE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Sell on LUNA',
  description:
    'Join the LUNA marketplace — curated brands, 180+ countries, transparent 12% commission and payouts every Friday.',
  alternates: { canonical: '/sell' },
};

const STEPS = [
  { icon: Store, title: 'Apply', copy: 'Tell us about your brand. We review every application within 3 business days.' },
  { icon: PackageCheck, title: 'List', copy: 'Import your catalogue or build listings with our onboarding tools.' },
  { icon: BarChart3, title: 'Grow', copy: 'Merchandising, analytics and support handled — you focus on making things.' },
];

const PERKS = [
  { title: '12% commission', copy: `No listing fees, no monthly fee. Free shipping handling over $${COMMERCE.freeShippingThreshold}.` },
  { title: 'Friday payouts', copy: 'Weekly bank transfers in 14 currencies, with a full reconciliation report.' },
  { title: '180+ countries', copy: 'We handle customs, duties and last-mile partners in every market we ship to.' },
  { title: 'Editorial placement', copy: 'Standout products get picked for homepage edits, emails and guides — free.' },
];

const FAQ = [
  { id: 'q1', question: 'What do I need to apply?', answer: 'A registered business, product liability cover and 10+ SKUs in a category we stock. Consumer marketplaces and drop-shippers are not a fit for LUNA.' },
  { id: 'q2', question: 'How fast can I go live?', answer: 'Most sellers launch within two weeks: 3 days for review, then catalogue import and a merchandising call with your partner manager.' },
  { id: 'q3', question: 'Who handles returns?', answer: 'Local returns go to our regional hubs; you are only charged for items that come back damaged or outside the window.' },
];

export default function SellPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sell on LUNA' }]} />

        <header className="mb-10 max-w-2xl space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            Marketplace partners
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Sell on LUNA
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            We add a limited number of sellers each quarter so the catalogue stays curated. If your
            brand earns its place, we bring the audience, logistics and support.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <LinkButton href="/contact">Apply to sell</LinkButton>
            <LinkButton href="/brands" variant="secondary">
              See who sells here
            </LinkButton>
          </div>
        </header>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-line bg-white p-6">
              <span className="absolute right-5 top-5 display text-3xl text-cream">0{i + 1}</span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-forest">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-3 text-sm font-bold text-ink">{s.title}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.copy}</p>
            </div>
          ))}
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-2xl bg-warm p-5">
              <BadgeDollarSign className="h-5 w-5 text-forest" aria-hidden />
              <h3 className="mt-2.5 text-sm font-bold text-ink">{p.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{p.copy}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="display mb-4 text-xl text-forest">Seller questions</h2>
            <Accordion items={FAQ} />
          </section>

          <section className="rounded-2xl border border-line bg-forest p-6 text-cream sm:p-8">
            <h2 className="display text-xl">Ready when you are</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Send a short pitch to {SITE.salesEmail} — links to your current shop, your best
              sellers and where you make things. A partner manager replies personally, not with a
              template.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <LinkButton href="/contact" variant="secondary">
                Start the conversation
              </LinkButton>
              <span className="inline-flex items-center gap-1.5 text-[13px] text-cream/70">
                Median reply: 1 business day
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </div>
          </section>
        </div>
      </div>
    </Storefront>
  );
}