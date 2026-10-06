'use client';

/* ------------------------------------------------------------------ */
/* Promo cards and brand strip                                         */
/* ------------------------------------------------------------------ */

import { useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Quote,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import type { Testimonial } from '@/lib/types';
import { PROMO_CARDS, TESTIMONIALS, TRUST_POINTS } from '@/lib/data/content';
import { BRANDS } from '@/lib/data/products/brands';
import { SmartImage } from '@/components/ui/SmartImage';
import { Rating } from '@/components/ui/primitives';
import { SectionHeading } from '@/components/ui/feedback';

/* ----------------------------- Promo cards ----------------------------- */

export function PromoCards() {
  return (
    <section className="shell py-10 sm:py-14" aria-label="Featured promotions">
      <div className="grid gap-4 md:grid-cols-3">
        {PROMO_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl p-5"
          >
            <SmartImage
              src={card.image}
              alt=""
              seed={card.id}
              aspect="auto"
              wrapperClassName="absolute inset-0 h-full w-full rounded-2xl"
              className="transition-transform duration-700 group-hover:scale-105"
            />
            <div
              className={`absolute inset-0 rounded-2xl ${
                card.tone === 'dark'
                  ? 'hero-veil'
                  : 'bg-gradient-to-t from-ink/80 via-ink/35 to-ink/5'
              }`}
            />
            <div className="relative space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/75">
                {card.eyebrow}
              </p>
              <h3 className="display text-lg leading-snug text-cream">{card.title}</h3>
              <p className="clamp-2 text-xs leading-relaxed text-cream/75">{card.copy}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-cream">
                {card.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- Brand strip ----------------------------- */

export function BrandStrip() {
  const scroller = useRef<HTMLUListElement>(null);
  const featured = BRANDS.slice(0, 22);

  const nudge = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 420, behavior: 'smooth' });

  return (
    <section className="border-y border-line bg-white py-10 sm:py-12" aria-label="Featured brands">
      <div className="shell">
        <SectionHeading
          eyebrow="Shop by brand"
          title="173 brands, one checkout"
          description="From independent makers to global names — every one vetted for quality and repairability."
          action={
            <Link href="/brands" className="text-sm font-semibold text-forest hover:underline">
              All brands
            </Link>
          }
        />
      </div>

      <div className="relative">
        <ul
          ref={scroller}
          className="no-scrollbar mx-auto flex max-w-[1360px] gap-3 overflow-x-auto px-6 lg:px-8"
        >
          {featured.map((brand) => (
            <li key={brand.slug} className="shrink-0">
              <Link
                href={`/brand/${brand.slug}`}
                className="flex h-16 w-36 items-center gap-2.5 rounded-xl border border-line bg-warm px-3 transition hover:border-forest/30 hover:bg-cream"
                title={brand.name}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-forest text-[11px] font-bold text-cream">
                  {brand.initials}
                </span>
                <span className="min-w-0">
                  <span className="clamp-1 block text-[12.5px] font-bold text-ink">{brand.name}</span>
                  <span className="block truncate text-[10px] text-muted">{brand.country}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Scroll brands left"
          className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Scroll brands right"
          className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
/* ---------------------------- Testimonials ---------------------------- */

export function TestimonialSection() {
  const scroller = useRef<HTMLUListElement>(null);
  const nudge = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });

  return (
    <section className="shell py-12 sm:py-16" aria-labelledby="testimonials-heading">
      <SectionHeading
        eyebrow="Verified reviews"
        title="What customers say"
        description="4.8 out of 5 across 68,000 verified orders in the last 12 months."
        align="center"
      />

      <div className="relative">
        <ul
          ref={scroller}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:gap-5"
        >
          {TESTIMONIALS.map((t) => (
            <li key={t.id} className="w-[280px] shrink-0 snap-start sm:w-[340px]">
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Scroll testimonials left"
          className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Scroll testimonials right"
          className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-5">
      <Quote className="h-6 w-6 shrink-0 text-forest/25" aria-hidden />
      <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink">
        {testimonial.quote}
      </blockquote>
      <Rating value={testimonial.rating} size="xs" showValue={false} className="mt-3" />
      <figcaption className="mt-3 flex items-center gap-3 border-t border-line pt-3">
        <SmartImage
          src={testimonial.avatar}
          alt={testimonial.name}
          seed={testimonial.id}
          aspect="square"
          wrapperClassName="h-9 w-9 shrink-0 rounded-full"
        />
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold text-ink">
            {testimonial.name}
          </span>
          <span className="block truncate text-[11px] text-muted">
            {testimonial.role} · {testimonial.location}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------ Trust bar ------------------------------ */

const TRUST_ICONS = [Truck, RotateCcw, CreditCard, ShieldCheck];

export function TrustBar() {
  return (
    <section className="shell pb-4" aria-label="Why shop with LUNA">
      <ul className="grid gap-4 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map((point, i) => {
          const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
          return (
            <li key={point.title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cream text-forest">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span>
                <span className="block text-[13.5px] font-semibold text-ink">{point.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{point.copy}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}