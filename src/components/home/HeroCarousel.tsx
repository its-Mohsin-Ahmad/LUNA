'use client';

/* ------------------------------------------------------------------ */
/* Hero carousel — split layout matching the reference homepage:        */
/* serif heading + CTA + trust badges on the left, product imagery on   */
/* the right, compact dark-green sale panel top-right.                  */
/* Autoplay (5s) with pause-on-hover, arrows, dots, keyboard, pointer    */
/* drag, touch swipe and reduced-motion support.                        */
/* ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Tag, Users } from 'lucide-react';
import type { HeroSlide } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';

const AUTOPLAY_MS = 5000;

const HERO_TRUST = [
  { icon: ShieldCheck, label: 'Premium Quality' },
  { icon: Tag, label: 'Great Prices' },
  { icon: Users, label: 'Trusted by 10K+ Customers' },
] as const;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState('');
  const dragStart = useRef<number | null>(null);

  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      const clamped = (next + count) % count;
      setIndex(clamped);
      setAnnounce(`Slide ${clamped + 1} of ${count}: ${slides[clamped].title}`);
    },
    [count, slides]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      go(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      go(count - 1);
    }
  };

  /* Mouse drag + touch swipe via pointer events */
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) > 45) {
      if (delta < 0) next();
      else prev();
    }
  };

  const slide = slides[index];

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="relative isolate touch-pan-y overflow-hidden rounded-[18px] sm:rounded-[22px]"
      style={{ background: slide.bg ?? '#E7EFE6' }}
    >
      <div className="relative h-[352px] w-full transition-colors duration-500 max-[360px]:h-[330px] sm:h-[290px] lg:h-[306px]">
        {slides.map((s, i) => {
          const isActive = i === index;
          return (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!isActive}
              className={cn(
                'absolute inset-0 transition-opacity duration-500 ease-out',
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              <div
                className="grid h-full grid-cols-1 grid-rows-[1fr_144px] sm:grid-cols-[1.05fr_1fr] sm:grid-rows-1"
                style={{ background: s.bg }}
              >
                {/* TOP — copy (image sits below on phones) */}
                <div className="z-10 flex flex-col justify-center px-5 pb-4 pt-6 sm:px-8 sm:py-6 lg:px-10">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="display max-w-[62%] text-[clamp(26px,7.6vw,42px)] leading-[1.06] text-forest sm:max-w-[290px] sm:text-[37px] lg:max-w-[330px] lg:text-[44px]">
                      {s.title}
                    </h2>

                    {/* Sale panel: compact inline chip on phones, pinned
                        top-right of the slide from `sm` up (reference look). */}
                    {s.sale && (
                      <div className="shrink-0 rounded-xl bg-forest px-2 py-2.5 text-center text-cream shadow-soft sm:absolute sm:right-5 sm:top-5 sm:w-[106px] sm:px-2.5 sm:py-3">
                        <p className="display text-[13px] uppercase leading-[1.1] tracking-wide text-cream sm:text-[17px]">
                          {s.sale.kicker}
                        </p>
                        {s.sale.upTo && (
                          <p className="mt-1 text-[8.5px] font-bold tracking-[0.16em] text-cream/70 sm:text-[9px]">
                            {s.sale.upTo}
                          </p>
                        )}
                        <p className="display text-[24px] leading-none text-gold sm:text-[30px]">
                          {s.sale.percent}
                        </p>
                        {s.sale.suffix && (
                          <p className="mt-0.5 text-[9px] font-bold tracking-[0.18em] text-cream/80">
                            {s.sale.suffix}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="mt-2.5 max-w-[42ch] text-[13px] leading-relaxed text-ink/75 sm:text-[14px]">
                    {s.copy}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={s.cta.href}
                      tabIndex={isActive ? 0 : -1}
                      className="tap-squish inline-flex h-11 items-center gap-2 rounded-md bg-forest px-5 text-sm font-semibold text-white transition hover:bg-forest-600"
                    >
                      {s.cta.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>

                  {/* Trust badges */}
                  <ul className="mt-5 hidden flex-wrap items-center gap-x-6 gap-y-2 sm:flex">
                    {HERO_TRUST.map((t) => {
                      const Icon = t.icon;
                      return (
                        <li key={t.label} className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0 text-forest/70" aria-hidden />
                          <span className="max-w-[110px] text-[11.5px] font-medium leading-tight text-ink/80">
                            {t.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* RIGHT — product imagery */}
                <div className="relative min-h-0">
                  <SmartImage
                    src={s.image}
                    alt=""
                    seed={s.id}
                    aspect="auto"
                    priority={i === 0}
                    wrapperClassName="absolute inset-0 h-full w-full"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest shadow-soft transition hover:bg-white sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest shadow-soft transition hover:bg-white sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center">
        <div className="flex items-center gap-0.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              aria-current={i === index}
              className="grid h-8 w-6 place-items-center"
            >
              <span
                aria-hidden
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-5 bg-forest' : 'w-1.5 bg-forest/30'
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </section>
  );
}

