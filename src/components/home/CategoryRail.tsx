'use client';

/* ------------------------------------------------------------------ */
/* Circular category rail (swipeable, arrow-navigable)                */
/* ------------------------------------------------------------------ */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { SmartImage } from '@/components/ui/SmartImage';
import { SectionHeading } from '@/components/ui/feedback';

export function CategoryRail() {
  const scroller = useRef<HTMLUListElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <section className="shell py-10 sm:py-14" aria-labelledby="categories-heading">
      <SectionHeading
        eyebrow="Browse"
        title="Shop by category"
        description="Fourteen curated departments, from audio engineering to pantry staples."
        action={
          <Link
            href="/shop"
            className="text-sm font-semibold text-forest underline-offset-4 hover:underline"
          >
            View all products
          </Link>
        }
      />

      <div className="relative">
        <ul
          ref={scroller}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-6"
        >
          {CATEGORIES.map((cat) => (
            <li key={cat.slug} className="w-[104px] shrink-0 snap-start sm:w-[124px]">
              <Link href={`/shop/${cat.slug}`} className="group block text-center">
                <span className="relative mx-auto block h-[104px] w-[104px] overflow-hidden rounded-full ring-2 ring-transparent transition duration-300 group-hover:ring-forest/25 sm:h-[124px] sm:w-[124px]">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    seed={cat.slug}
                    aspect="square"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="mt-2.5 block text-[12.5px] font-semibold leading-tight text-ink transition-colors group-hover:text-forest">
                  {cat.name}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted">
                  {cat.subcategories.length} sections
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <RailButton side="left" onClick={() => scrollBy(-1)} />
        <RailButton side="right" onClick={() => scrollBy(1)} />
      </div>
    </section>
  );
}

function RailButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const [hidden, setHidden] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Scroll categories left' : 'Scroll categories right'}
      onMouseEnter={() => setHidden(false)}
      className={`absolute top-[46%] hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-forest shadow-soft transition hover:bg-cream lg:grid ${
        side === 'left' ? '-left-4' : '-right-4'
      } ${hidden ? 'opacity-0' : 'opacity-100'}`}
    >
      {side === 'left' ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}