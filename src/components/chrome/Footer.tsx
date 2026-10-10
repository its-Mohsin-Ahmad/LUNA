'use client';

/* ------------------------------------------------------------------ */
/* Site footer                                                          */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Apple,
  Play,
  ChevronDown,
} from 'lucide-react';
import { SITE } from '@/lib/constants';
import { CATEGORIES } from '@/lib/data/categories';
import { Logo } from '@/components/brand/Logo';
import { FOOTER_COLUMNS, PAYMENT_METHODS, LEGAL_LINKS } from './footerLinks';
import { cn } from '@/lib/utils';

const SOCIAL_ICONS = [
  { label: 'Instagram', href: SITE.socials[0].href, Icon: Instagram },
  { label: 'Facebook', href: SITE.socials[1].href, Icon: Facebook },
  { label: 'YouTube', href: SITE.socials[2].href, Icon: Youtube },
  { label: 'LinkedIn', href: SITE.socials[3].href, Icon: Linkedin },
];

export function Footer() {
  /* Phones stack the link columns into accordions to keep the footer compact. */
  const [openColumn, setOpenColumn] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 767px)').matches) setOpenColumn(null);
  }, []);

  return (
    <footer className="mt-12 bg-forest text-cream sm:mt-20">
      <div className="shell grid gap-6 py-10 md:grid-cols-2 md:gap-10 lg:grid-cols-5 lg:py-16">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-cream/60 sm:text-sm">
            LUNA is an independent marketplace for considered goods — from audio and homeware to
            pantry staples. Curated in Seattle, shipped worldwide.
          </p>
          <ul className="mt-5 space-y-2 text-[13.5px] text-cream/70 sm:text-sm">
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
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-cream/70 transition hover:border-forest-300 hover:bg-forest-700 hover:text-cream sm:h-9 sm:w-9"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
              Get the LUNA app
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
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

        {FOOTER_COLUMNS.map((col) => {
          const isOpen = openColumn === col.title;
          return (
            <nav
              key={col.title}
              aria-label={col.title}
              className="border-b border-white/10 md:border-0"
            >
              {/* Phone: tappable accordion header (44px tall). */}
              <button
                type="button"
                onClick={() => setOpenColumn(isOpen ? null : col.title)}
                aria-expanded={isOpen}
                className="flex h-12 w-full items-center justify-between gap-4 md:hidden"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
                  {col.title}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'h-4 w-4 text-cream/60 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>

              <h3 className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50 md:block">
                {col.title}
              </h3>

              <ul
                className={cn(
                  'pb-3 md:mt-4 md:block md:space-y-2.5 md:pb-0',
                  isOpen ? 'mt-1 block space-y-1' : 'hidden'
                )}
              >
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-2 text-[13.5px] text-cream/75 transition hover:text-cream md:py-0 md:text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>

      <div className="shell hidden pb-10 md:block">
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

      <div className="border-t border-white/10 md:hidden">
        <div className="shell pb-8 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cream/50">
            Popular categories
          </p>
          <ul className="rail rail-bleed mt-3 flex gap-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug} className="shrink-0">
                <Link
                  href={`/shop/${cat.slug}`}
                  className="inline-block rounded-full border border-white/12 px-3.5 py-1.5 text-[13px] text-cream/70"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
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