'use client';

/* ------------------------------------------------------------------ */
/* Horizontal product carousel with arrows and quick view              */
/* ------------------------------------------------------------------ */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/ui/feedback';
import { LinkButton } from '@/components/ui/primitives';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickView } from '@/components/product/QuickView';

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
  const [quickView, setQuickView] = useState<Product | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  const bg =
    tone === 'cream' ? 'bg-cream/60' : tone === 'white' ? 'bg-white' : 'bg-transparent';

  return (
    <section className={cn(bg, 'py-10 sm:py-14')} aria-label={title}>
      <div className="shell">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          action={
            href ? (
              <LinkButton href={href} variant="outline" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>
                {hrefLabel}
              </LinkButton>
            ) : undefined
          }
        />

        <div className="relative">
          <ul
            ref={scroller}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:gap-5"
          >
            {products.map((product, i) => (
              <li
                key={product.id}
                className="w-[calc(50%-0.5rem)] shrink-0 snap-start sm:w-[240px] lg:w-[248px]"
              >
                <ProductCard
                  product={product}
                  priority={i < 2}
                  onQuickView={setQuickView}
                />
              </li>
            ))}
          </ul>

          <CarouselButton side="left" onClick={() => scrollBy(-1)} label={`Scroll ${title} left`} />
          <CarouselButton side="right" onClick={() => scrollBy(1)} label={`Scroll ${title} right`} />
        </div>
      </div>

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
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
        side === 'left' ? '-left-4' : '-right-4'
      )}
    >
      {side === 'left' ? <ChevronLeft className="h-4.5 w-4.5" /> : <ChevronRight className="h-4.5 w-4.5" />}
    </button>
  );
}