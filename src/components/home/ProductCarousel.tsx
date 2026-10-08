'use client';

/* ------------------------------------------------------------------ */
/* Horizontal product carousel: 5-up desktop · 3-up tablet · 2-up phone */
/* ------------------------------------------------------------------ */

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/feedback';
import { ProductCard } from '@/components/product/ProductCard';

export function ProductCarousel({
  eyebrow,
  title,
  description,
  products,
  href,
  hrefLabel = 'View all',
  tone = 'light',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
  href?: string;
  hrefLabel?: string;
  tone?: 'light' | 'cream' | 'white';
}) {
  const scroller = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  const bg = tone === 'cream' ? 'bg-cream/60' : tone === 'white' ? 'bg-white' : 'bg-transparent';

  return (
    <section className={cn(bg, 'py-8 sm:py-10')} aria-label={title}>
      <div className="shell">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          className="mb-5"
          action={
            href ? (
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-forest underline-offset-4 hover:underline"
              >
                {hrefLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : undefined
          }
        />

        <div className="relative">
          <ul
            ref={scroller}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
          >
            {products.map((product, i) => (
              <li
                key={product.id}
                className="w-[calc(50%-0.5rem)] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]"
              >
                <ProductCard product={product} priority={i < 2} />
              </li>
            ))}
          </ul>

          <CarouselButton side="left" onClick={() => scrollBy(-1)} label={`Scroll ${title} left`} />
          <CarouselButton side="right" onClick={() => scrollBy(1)} label={`Scroll ${title} right`} />
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  side,
  onClick,
  label,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid',
        side === 'left' ? '-left-5' : '-right-5'
      )}
    >
      {side === 'left' ? <ChevronLeft className="h-4.5 w-4.5" /> : <ChevronRight className="h-4.5 w-4.5" />}
    </button>
  );
}