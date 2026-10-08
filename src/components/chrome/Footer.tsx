'use client';

/* ------------------------------------------------------------------ */
/* Site footer                                                          */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, ShieldCheck, Apple, Play } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { CATEGORIES } from '@/lib/data/categories';
import { Logo } from '@/components/brand/Logo';
import { FOOTER_COLUMNS, PAYMENT_METHODS, LEGAL_LINKS } from './footerLinks';

const SOCIAL_ICONS = [
  { label: 'Instagram', href: SITE.socials[0].href, Icon: Instagram },
  { label: 'Facebook', href: SITE.socials[1].href, Icon: Facebook },
  { label: 'YouTube', href: SITE.socials[2].href, Icon: Youtube },
  { label: 'LinkedIn', href: SITE.socials[3].href, Icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-forest text-cream">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5 lg:py-16">
        <div>
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
          <div className="mt-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
              Get the LUNA app
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/app/ios"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-cream/85 transition hover:border-forest-300 hover:bg-forest-700 hover:text-cream"
              >
                <Apple className="h-4 w-4" />
                App Store
              </a>
              <a
                href="/app/android"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-cream/85 transition hover:border-forest-300 hover:bg-forest-700 hover:text-cream"
              >
                <Play className="h-4 w-4" />
                Google Play
              </a>
            </div>
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
          <label className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
              Ship to
            </span>
            <select
              aria-label="Ship to country"
              defaultValue="US"
              className="rounded border border-white/15 bg-transparent px-2 py-1 text-xs text-cream/80 focus:border-forest-300 focus:outline-none"
            >
              <option value="US">United States</option>
              <option value="AE">United Arab Emirates</option>
              <option value="PK">Pakistan</option>
              <option value="IN">India</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
            </select>
          </label>
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