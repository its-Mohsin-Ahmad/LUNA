'use client';

/* ------------------------------------------------------------------ */
/* Promo cards and brand strip                                         */
/* ------------------------------------------------------------------ */

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  Heart,
  Mail,
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
import { Input } from '@/components/ui/forms';
import { cn } from '@/lib/utils';
/* ----------------------------- Promo cards ----------------------------- */

export function PromoCards() {
  return (
    <section className="shell py-8 sm:py-14" aria-label="Featured promotions">
      {/* Mobile: swipeable rail showing ~1.1 cards so the next one peeks in.
          Tablet / desktop: the reference three-up grid. */}
      <div className="rail rail-bleed -mb-2 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0">
        {PROMO_CARDS.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className={cn(
              'group relative flex h-[196px] w-[82vw] max-w-[320px] flex-col overflow-hidden rounded-2xl p-5 shadow-soft transition-shadow hover:shadow-card-hover md:h-auto md:min-h-[220px] md:w-auto md:max-w-none',
              card.bg ? "bg-[#" + card.bg + "]" : "bg-white"
            )}
          >
            <SmartImage
              src={card.image}
              alt=""
              seed={card.id}
              aspect="auto"
              wrapperClassName="absolute inset-0 h-full w-full rounded-2xl"
              className="transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-ink/55 via-ink/8 to-ink/10" />
            <div className="relative z-10 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/90">
                {card.eyebrow}
              </p>
              <h3 className="display text-lg leading-snug text-cream">{card.title}</h3>
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
          className="rail rail-bleed mx-auto flex max-w-[1360px] gap-3 overflow-x-auto lg:px-8"
        >
          {featured.map((brand) => (
            <li key={brand.slug} className="shrink-0">
              <Link
                href={`/brands/${brand.slug}`}
                className="flex h-16 w-[142px] items-center gap-2.5 rounded-xl border border-line bg-warm px-3 transition hover:border-forest/30 hover:bg-cream sm:w-36"
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
          className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Scroll brands right"
          className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
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
  const visible = TESTIMONIALS.slice(0, 4);
  const [active, setActive] = useState(0);

  /* Phones show ~1 card (next one peeking); the dot row and native swipe stay
     in sync because every card shares the same step. */
  const step = () => {
    const el = scroller.current;
    if (!el || visible.length < 2) return 0;
    return (el.scrollWidth - el.clientWidth) / (visible.length - 1);
  };

  const scrollToIndex = (i: number) => {
    const next = Math.max(0, Math.min(visible.length - 1, i));
    setActive(next);
    scroller.current?.scrollTo({ left: next * step(), behavior: 'smooth' });
  };

  const onScroll = () => {
    const s = step();
    if (s > 0) setActive(Math.round((scroller.current?.scrollLeft ?? 0) / s));
  };

  return (
    <section className="shell py-10 sm:py-16" aria-labelledby="testimonials-heading">
      <SectionHeading title="Loved By Thousands ❤️" align="center" />

      <div className="relative">
        <ul
          ref={scroller}
          onScroll={onScroll}
          className="rail rail-bleed flex gap-4 overflow-x-auto sm:gap-5"
        >
          {visible.map((t) => (
            <li key={t.id} className="w-[82vw] max-w-[340px] shrink-0 sm:w-[340px] lg:w-[calc((100%-3.75rem)/4)]">
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scrollToIndex(active - 1)}
          aria-label="Scroll testimonials left"
          className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(active + 1)}
          aria-label="Scroll testimonials right"
          className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid"
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="mt-5 flex justify-center gap-1 lg:hidden">
          {visible.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className="grid h-8 w-6 place-items-center"
            >
              <span
                aria-hidden
                className={cn(
                  'block h-2 rounded-full transition-all duration-300',
                  i === active ? 'w-6 bg-forest' : 'w-2 bg-forest/25'
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-5">
      <div className="flex gap-1 text-forest/30" aria-label="Loved by customers">
        <Heart className="h-5 w-5 fill-current" aria-hidden />
        <Heart className="h-5 w-5 fill-current" aria-hidden />
      </div>
      <blockquote className="clamp-4 mt-2 flex-1 text-[13.5px] leading-relaxed text-ink sm:text-sm">
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
          <span className="flex items-center gap-1.5">
            <span className="clamp-1 text-[13px] font-semibold text-ink">
              {testimonial.name}
            </span>
            <BadgeCheck
              className="h-3.5 w-3.5 shrink-0 text-forest"
              aria-label="Verified buyer"
            />
          </span>
          <span className="clamp-1 block text-[11px] text-muted">
            {testimonial.role} · {testimonial.location}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
/* ------------------------------ Newsletters ------------------------------ */

export function HomeNewsletter() {
  return (
    <section className="bg-forest relative overflow-hidden" aria-label="Newsletter">
      <div className="absolute inset-0 bg-forest-600/20" />
      <div className="shell relative flex flex-col gap-6 py-12 sm:flex-row sm:py-14 sm:gap-8">
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cream/75">
            Newsletter
          </p>
          <h2 className="display text-[26px] leading-[1.05] text-white sm:text-[36px]">
            Stay in the Loop
          </h2>
          <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-cream/85 sm:text-sm">
            Pre-release access to new collections, first look at new launches, plus early access to
            sales.
          </p>
        </div>
        <div className="flex-1">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}

function NewsletterForm({ className }: { className?: string }) {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSent(true);
  };

  return (
    <form className={cn('flex flex-1 justify-center', className)} onSubmit={submit} noValidate>
      {/* Phones: stacked input + full-width button. `sm` up: inline row. */}
      <div className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:items-center">
        <Input
          type="email"
          required
          aria-label="Email address"
          placeholder="Enter your email for pre-release access"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="email"
          className="sm:h-11"
        />
        <button
          type="submit"
          className="tap-squish inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-forest shadow-soft transition hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-forest sm:h-11"
        >
          <Mail className="h-4 w-4" aria-hidden />
          {sent ? "You're on the list" : 'Subscribe'}
        </button>
      </div>
      {sent && (
        <p className="mt-3 text-[13px] font-medium text-cream sm:text-center sm:text-sm" role="status">
          Welcome to the Inner Circle — check your inbox for a welcome offer.
        </p>
      )}
    </form>
  );
}

/* ------------------------------ Trust bar ------------------------------ */

const TRUST_ICONS = [Truck, RotateCcw, CreditCard, ShieldCheck];

export function TrustBar() {
  return (
    <section className="shell pb-6 pt-4 sm:pb-4" aria-label="Why shop with LUNA">
      {/* 2×2 on phones · 4-up on desktop, compact spacing throughout. */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-line bg-white p-4 sm:gap-5 sm:p-6 lg:grid-cols-4 lg:gap-6">
        {TRUST_POINTS.map((point, i) => {
          const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
          return (
            <li key={point.title} className="flex items-start gap-2.5 sm:gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream text-forest sm:h-10 sm:w-10">
                <Icon className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold leading-snug text-ink sm:text-[13.5px]">
                  {point.title}
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-relaxed text-muted sm:text-xs">
                  {point.copy}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}