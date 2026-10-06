import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Leaf, Recycle, Users } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { LinkButton } from '@/components/ui';
import { SITE, COMMERCE } from '@/lib/constants';
import { CATEGORIES } from '@/lib/data/categories';
import { PRODUCTS } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'About LUNA',
  description:
    'LUNA is a curated international marketplace founded in 2014 — our story, sustainability commitments, open roles, press desk and legal basics.',
  alternates: { canonical: '/about' },
};

const STATS = [
  { value: `${PRODUCTS.length}+`, label: 'Products curated' },
  { value: `${CATEGORIES.length}`, label: 'Departments' },
  { value: '180+', label: 'Countries served' },
  { value: String(SITE.foundedYear), label: 'Founded' },
];

const VALUES = [
  {
    icon: Leaf,
    title: 'Curated, not endless',
    copy: 'Every listing is vetted for build quality, repairability and honest pricing before it goes live.',
  },
  {
    icon: Recycle,
    title: 'Built to last longer',
    copy: 'Free 30-day returns, spare-parts guides and warranty support on everything we stock.',
  },
  {
    icon: Users,
    title: 'People on the other end',
    copy: 'Support staffed by humans with a median 3-hour first response — no bots at the front door.',
  },
];

export default function AboutPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />

        <header className="mb-10 max-w-3xl space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            Our story
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[40px]">
            Shop better. Live better. Discover more.
          </h1>
          <p className="text-base leading-relaxed text-muted">
            LUNA started in {SITE.foundedYear} in a {SITE.addresses[0].city} loft with one belief:
            buying online should feel like being recommended something by a friend who actually owns
            it. Twelve years later we ship to 180+ countries with the same editorial eye — fewer
            products, chosen better.
          </p>
        </header>

        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-white p-5 text-center">
              <p className="display text-2xl text-forest sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <section className="mb-12 space-y-5">
          <h2 className="display text-xl text-forest">What we optimise for</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-line bg-white p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-forest">
                  <v.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-bold text-ink">{v.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{v.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-10">
          {/* #sustainability */}
          <section
            id="sustainability"
            className="scroll-mt-36 rounded-2xl border border-line bg-warm p-6 sm:p-8"
          >
            <h2 className="display text-xl text-forest">Sustainability</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              We prioritise brands with repair programs and take-back schemes, consolidate
              shipments to cut courier miles, and offset the remaining freight on every order over{' '}
              {COMMERCE.freeShippingThreshold} USD. Packaging is plastic-free across 11 of our{' '}
              {CATEGORIES.length} departments and fully recyclable everywhere else.
            </p>
          </section>

          {/* #careers */}
          <section
            id="careers"
            className="scroll-mt-36 rounded-2xl border border-line bg-white p-6 sm:p-8"
          >
            <h2 className="display text-xl text-forest">Careers</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              We hire across {SITE.addresses.map((a) => a.city).join(', ')} — engineering, editorial,
              logistics and support. Remote-first with quarterly on-sites, and every role gets the
              same furniture budget we give our warehouses: the good stuff.
            </p>
            <div className="mt-4">
              <LinkButton href="/contact" variant="secondary">
                Ask about open roles
              </LinkButton>
            </div>
          </section>

          {/* #press */}
          <section
            id="press"
            className="scroll-mt-36 rounded-2xl border border-line bg-white p-6 sm:p-8"
          >
            <h2 className="display text-xl text-forest">Press</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              For interviews, imagery or data requests, write to{' '}
              <a
                href={`mailto:${SITE.salesEmail}`}
                className="font-semibold text-forest hover:underline"
              >
                {SITE.salesEmail}
              </a>
              . We usually reply within one business day with logos, founder bios and the numbers
              you need.
            </p>
          </section>

          {/* Legal anchors: #terms #privacy #cookies */}
          <section className="rounded-2xl border border-line bg-cream/60 p-6 sm:p-8">
            <h2 className="display text-xl text-forest">The legal bits</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <article id="terms" className="scroll-mt-36 rounded-xl border border-line bg-white p-5">
                <h3 className="text-sm font-bold text-ink">Terms of service</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  Plain-language rules for using LUNA — orders, returns, accounts and marketplace
                  conduct.
                </p>
                <Link
                  href="/terms"
                  className="mt-3 inline-block text-[13px] font-bold text-forest hover:underline"
                >
                  Read the full terms
                </Link>
              </article>
              <article id="privacy" className="scroll-mt-36 rounded-xl border border-line bg-white p-5">
                <h3 className="text-sm font-bold text-ink">Privacy</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  What we collect, why we collect it, and the controls you have — including how to
                  get everything deleted.
                </p>
                <Link
                  href="/privacy"
                  className="mt-3 inline-block text-[13px] font-bold text-forest hover:underline"
                >
                  Read the privacy policy
                </Link>
              </article>
              <article id="cookies" className="scroll-mt-36 rounded-xl border border-line bg-white p-5">
                <h3 className="text-sm font-bold text-ink">Cookies</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                  Strictly necessary cookies keep your bag and session alive. Everything else is
                  optional and controlled from{' '}
                  <Link href="/account/settings" className="font-semibold text-forest hover:underline">
                    account settings
                  </Link>
                  .
                </p>
              </article>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-forest px-6 py-6 text-cream">
          <p className="text-sm">
            Curious how the catalogue is built? Browse {PRODUCTS.length}+ products across{' '}
            {CATEGORIES.length} departments.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-cream underline-offset-4 hover:underline"
          >
            Explore the shop
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Storefront>
  );
}