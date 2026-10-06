'use client';

/* ------------------------------------------------------------------ */
/* Hero carousel                                                       */
/*                                                                     */
/* 6 slides in a ~300px rounded banner: autoplay with pause-on-hover,  */
/* arrows, dots, keyboard, touch swipe and reduced-motion support.      */
/* ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { HeroSlide } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState('');
  const touchStart = useRef<number | null>(null);

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

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
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
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={handleTouchEnd}
      className="relative isolate overflow-hidden rounded-[18px] bg-forest sm:rounded-[22px]"
    >
      <div className="relative h-[260px] w-full sm:h-[290px] lg:h-[310px]">
        {slides.map((s, i) => {
          const isActive = i === index;
          const light = s.tone === 'light';
          return (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!isActive}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-out',
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              <SmartImage
                src={s.image}
                alt=""
                seed={s.id}
                aspect="auto"
                priority={i === 0}
                className={cn(
                  'h-full w-full object-cover transition-transform duration-[6000ms] ease-linear',
                  isActive ? 'scale-105' : 'scale-100'
                )}
              />
              <div className={cn('absolute inset-0 hero-veil', light && 'opacity-55')} />
              <div className="absolute inset-0 flex items-center">
                <div className="shell">
                  <div className="max-w-xl">
                    <p
                      className={cn(
                        'text-[11px] font-bold uppercase tracking-[0.2em]',
                        light ? 'text-forest-700' : 'text-forest-300'
                      )}
                    >
                      {s.eyebrow}
                    </p>
                    <h1
                      className={cn(
                        'display mt-2 text-[28px] leading-[1.1] sm:text-[38px] lg:text-[44px]',
                        light ? 'text-forest-900' : 'text-cream'
                      )}
                    >
                      {s.title}
                    </h1>
                    <p
                      className={cn(
                        'clamp-2 mt-3 max-w-lg text-[13px] leading-relaxed sm:text-[15px]',
                        light ? 'text-forest-800/85' : 'text-cream/80'
                      )}
                    >
                      {s.copy}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <Link
                        href={s.cta.href}
                        tabIndex={isActive ? 0 : -1}
                        className={cn(
                          'inline-flex h-11 items-center rounded-md px-5 text-sm font-semibold transition',
                          light
                            ? 'bg-forest text-white hover:bg-forest-600'
                            : 'bg-cream text-forest hover:bg-white'
                        )}
                      >
                        {s.cta.label}
                      </Link>
                      <Link
                        href={s.secondary.href}
                        tabIndex={isActive ? 0 : -1}
                        className={cn(
                          'inline-flex h-11 items-center rounded-md border px-5 text-sm font-semibold transition',
                          light
                            ? 'border-forest/30 text-forest hover:bg-forest hover:text-white'
                            : 'border-cream/40 text-cream hover:bg-cream/15'
                        )}
                      >
                        {s.secondary.label}
                      </Link>
                    </div>
                  </div>
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
        className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest shadow-soft transition hover:bg-white sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-forest shadow-soft transition hover:bg-white sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-3.5 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-ink/30 px-2.5 py-1.5 backdrop-blur-sm">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}: ${s.title}`}
              aria-current={i === index}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-6 bg-cream' : 'w-1.5 bg-cream/50 hover:bg-cream/80'
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
            className="ml-1 grid h-5 w-5 place-items-center rounded-full text-cream/70 transition hover:text-cream"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
        <div
          key={`${index}-${paused}`}
          className={cn('h-full origin-left bg-gold', paused ? '' : 'progress-fill')}
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </section>
  );
}