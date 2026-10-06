'use client';

/* ------------------------------------------------------------------ */
/* Site footer                                                          */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { CATEGORIES } from '@/lib/data/categories';
import { Logo } from '@/components/brand/Logo';
import { NewsletterForm } from './NewsletterForm';
import { FOOTER_COLUMNS, PAYMENT_METHODS, LEGAL_LINKS } from './footerLinks';

const SOCIAL_ICONS = [
  { label: 'Instagram', href: SITE.socials[0].href, Icon: Instagram },
  { label: 'Facebook', href: SITE.socials[1].href, Icon: Facebook },
  { label: 'YouTube', href: SITE.socials[2].href, Icon: Youtube },
  { label: 'LinkedIn', href: SITE.socials[3].href, Icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-cream">
      <div className="border-b border-white/10 bg-forest-900">
        <div className="shell grid gap-8 py-12 lg:grid-cols-2 lg:items-center lg:py-14">
          <div className="space-y-3">
            <h2 className="display text-[26px] leading-tight text-cream sm:text-[30px]">
              Ten percent off your first order
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-cream/70">
              Join the LUNA list for early access to drops, members-only pricing and a welcome
              code. No noise, unsubscribe in one click.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6 lg:py-16">
        <div className="lg:col-span-2">
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            LUNA is an independent marketplace for considered goods — from audio and homeware to
            pantry staples. Curated in Seattle, shipped worldwide.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-cream/70">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-forest-300" />
              <a href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className="hover:text-cream">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-forest-300" />
              <a href={`mailto:${SITE.supportEmail}`} className="hover:text-cream">
                {SITE.supportEmail}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-forest-300" />
              Seattle · Dubai · Karachi
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            {SOCIAL_ICONS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-cream/70 transition hover:border-forest-300 hover:bg-forest-700 hover:text-cream"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/75 hover:text-cream">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="shell pb-10">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
          Popular categories
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/shop/${cat.slug}`}
                className="inline-block rounded-full border border-white/12 px-3.5 py-1.5 text-[13px] text-cream/70 transition hover:border-forest-300 hover:bg-forest-700 hover:text-cream"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-cream/50">
            <ShieldCheck className="h-4 w-4" />
            Secure payments — PCI DSS Level 1
          </p>
          <ul className="flex flex-wrap items-center gap-2">
            {PAYMENT_METHODS.map((method) => (
              <li
                key={method}
                className="rounded border border-white/12 px-2.5 py-1 text-[11px] font-semibold text-cream/60"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/45 sm:flex-row">
          <p>© {SITE.foundedYear}–2026 LUNA Marketplace. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-4">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}