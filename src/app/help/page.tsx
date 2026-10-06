import type { Metadata } from 'next';
import Link from 'next/link';
import { LifeBuoy, Mail, MessageSquare, PackageSearch } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { Accordion } from '@/components/ui/overlays';
import { LinkButton } from '@/components/ui';
import { FAQS, FAQ_GROUPS } from '@/lib/data/content';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Help centre',
  description:
    'Answers on orders, shipping, returns, accounts and payments — plus how to report a seller and reach LUNA support.',
  alternates: { canonical: '/help' },
};

const slug = (s: string) => s.toLowerCase();

const SELLER_REPORT = {
  id: 'sellers',
  question: 'How do I report a seller?',
  answer:
    'Open the product page, choose “Report seller” in the more menu, or email support@luna.shop with the product link and what went wrong. Reports are reviewed within 24 hours and sellers are removed from the marketplace for repeat offences.',
};

export default function HelpPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Help centre' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            <LifeBuoy className="h-3.5 w-3.5" aria-hidden />
            Help centre
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            How can we help?
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            The most common questions, answered in plain language. If yours is not here, our team
            replies within 3 hours.
          </p>
        </header>

        {/* Jump links */}
        <nav aria-label="Help topics" className="mb-8 flex flex-wrap gap-2">
          {FAQ_GROUPS.map((group) => (
            <a
              key={group}
              href={`#${slug(group)}`}
              className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ink transition hover:border-forest hover:bg-cream hover:text-forest"
            >
              {group}
            </a>
          ))}
          <a
            href="#sellers"
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ink transition hover:border-forest hover:bg-cream hover:text-forest"
          >
            Report a seller
          </a>
        </nav>

        {/* Quick actions */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/track-order"
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 transition hover:border-forest/40 hover:shadow-card-hover"
          >
            <PackageSearch className="h-5 w-5 shrink-0 text-forest" aria-hidden />
            <span>
              <strong className="block text-sm text-ink">Track an order</strong>
              <span className="text-xs text-muted">Live courier status</span>
            </span>
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 transition hover:border-forest/40 hover:shadow-card-hover"
          >
            <Mail className="h-5 w-5 shrink-0 text-forest" aria-hidden />
            <span>
              <strong className="block text-sm text-ink">Contact support</strong>
              <span className="text-xs text-muted">Median reply: 3 hours</span>
            </span>
          </Link>
          <Link
            href="/account/orders"
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 transition hover:border-forest/40 hover:shadow-card-hover"
          >
            <MessageSquare className="h-5 w-5 shrink-0 text-forest" aria-hidden />
            <span>
              <strong className="block text-sm text-ink">Start a return</strong>
              <span className="text-xs text-muted">From your orders</span>
            </span>
          </Link>
        </div>

        {/* FAQ groups — ids: #orders #shipping #returns #account #payments */}
        <div className="space-y-10">
          {FAQ_GROUPS.map((group) => (
            <section key={group} id={slug(group)} className="scroll-mt-36">
              <h2 className="display mb-4 text-xl text-forest">{group}</h2>
              <Accordion
                items={FAQS.filter((f) => f.group === group).map((f) => ({
                  id: f.q,
                  question: f.q,
                  answer: f.a,
                }))}
              />
            </section>
          ))}

          {/* Report a seller — footer anchor #sellers */}
          <section id="sellers" className="scroll-mt-36">
            <h2 className="display mb-4 text-xl text-forest">Marketplace safety</h2>
            <Accordion items={[SELLER_REPORT]} />
          </section>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-cream/60 px-6 py-6">
          <p className="text-sm text-muted">
            Still stuck? Write to us — {SITE.supportEmail} or the contact form.
          </p>
          <LinkButton href="/contact">
            Contact support
          </LinkButton>
        </div>
      </div>
    </Storefront>
  );
}