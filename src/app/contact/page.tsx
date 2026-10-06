import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock3, Globe, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { ContactForm } from '@/components/content/ContactForm';
import { SITE } from '@/lib/constants';
import { FAQS } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Reach the LUNA support team by email, phone or chat — real people, median 3-hour first response, every day 08:00–22:00 UTC.',
  alternates: { canonical: '/contact' },
};

const CHANNELS = [
  {
    icon: Mail,
    title: 'Email',
    value: SITE.supportEmail,
    note: 'Median first reply: 3 hours',
    href: `mailto:${SITE.supportEmail}`,
  },
  {
    icon: Phone,
    title: 'Phone',
    value: SITE.phone,
    note: 'Toll-free, 08:00–22:00 UTC',
    href: `tel:${SITE.phone.replace(/[^+\d]/g, '')}`,
  },
  {
    icon: MessageSquare,
    title: 'Live chat',
    value: SITE.whatsapp,
    note: 'WhatsApp, usually under 10 minutes',
    href: `https://wa.me/${SITE.whatsapp.replace(/[^+\d]/g, '')}`,
  },
  {
    icon: Clock3,
    title: 'Opening hours',
    value: SITE.hours,
    note: 'Including weekends and holidays',
  },
];

export default function ContactPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            Support that answers
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Talk to a real person
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Orders, returns, product questions or selling on LUNA — our team replies fast, in your
            language, wherever you are.
          </p>
        </header>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((ch) => {
            const inner = (
              <>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-forest">
                  <ch.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                  {ch.title}
                </span>
                <span className="block text-sm font-semibold text-ink">{ch.value}</span>
                <span className="block text-xs text-muted">{ch.note}</span>
              </>
            );
            return ch.href ? (
              <Link
                key={ch.title}
                href={ch.href}
                className="space-y-1.5 rounded-2xl border border-line bg-white p-5 transition hover:border-forest/40 hover:shadow-card-hover"
              >
                {inner}
              </Link>
            ) : (
              <div key={ch.title} className="space-y-1.5 rounded-2xl border border-line bg-white p-5">
                {inner}
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <h2 className="display mb-5 text-xl text-forest">Send us a message</h2>
            <ContactForm />
          </section>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-line bg-warm p-6">
              <h2 className="mb-3 text-sm font-bold text-ink">Offices</h2>
              <ul className="space-y-3">
                {SITE.addresses.map((a) => (
                  <li key={a.city} className="flex gap-2.5 text-[13px] leading-relaxed">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden />
                    <span>
                      <strong className="block text-ink">{a.city}</strong>
                      <span className="text-muted">{a.line}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-warm p-6">
              <h2 className="mb-3 text-sm font-bold text-ink">Quick answers</h2>
              <ul className="space-y-2 text-[13px]">
                {FAQS.slice(0, 3).map((f) => (
                  <li key={f.q} className="leading-snug">
                    <Link href="/help" className="text-forest hover:underline">
                      {f.q}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/help"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-forest hover:underline"
              >
                Visit the help centre
                <Globe className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Storefront>
  );
}