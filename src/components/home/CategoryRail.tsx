'use client';

/* ------------------------------------------------------------------ */
/* Circular category rail — pastel icon circles (swipeable on mobile)   */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import {
  BookOpen,
  Dumbbell,
  Gamepad2,
  Home,
  LayoutGrid,
  Monitor,
  PawPrint,
  Shirt,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';

const ICONS: Record<string, LucideIcon> = {
  electronics: Monitor,
  fashion: Shirt,
  'home-living': Home,
  beauty: Sparkles,
  sports: Dumbbell,
  'toys-kids': Gamepad2,
  books: BookOpen,
  'pet-supplies': PawPrint,
};

/* Literal Tailwind classes so they are picked up by the JIT scanner. */
const PASTELS: Record<string, string> = {
  electronics: 'bg-[#DCEAF6]',
  fashion: 'bg-[#F7DFE4]',
  'home-living': 'bg-[#F8E8D7]',
  beauty: 'bg-[#F6E3EE]',
  sports: 'bg-[#DFE9F6]',
  'toys-kids': 'bg-[#F9E7D5]',
  books: 'bg-[#F1E5EE]',
  'pet-supplies': 'bg-[#E8E4F3]',
};

export function CategoryRail() {
  const shown = CATEGORIES.slice(0, 8);

  return (
    <section className="shell pt-7 pb-8 sm:pt-9 sm:pb-10" aria-label="Shop by category">
      <ul className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-1 sm:gap-8 lg:mx-0 lg:grid lg:grid-cols-9 lg:gap-4 lg:overflow-visible lg:px-0">
        {shown.map((cat) => {
          const Icon = ICONS[cat.slug] ?? LayoutGrid;
          return (
            <li key={cat.slug} className="w-[84px] shrink-0 snap-start lg:w-auto">
              <Link href={`/shop/${cat.slug}`} className="group flex flex-col items-center text-center">
                <span
                  className={`grid h-[84px] w-[84px] place-items-center rounded-full transition-transform duration-300 group-hover:-translate-y-1 sm:h-[92px] sm:w-[92px] ${
                    PASTELS[cat.slug] ?? 'bg-mist'
                  }`}
                >
                  <Icon className="h-8 w-8 text-forest/80" aria-hidden strokeWidth={1.6} />
                </span>
                <span className="mt-2.5 block text-[12.5px] font-semibold leading-tight text-ink transition-colors group-hover:text-forest">
                  {cat.name}
                </span>
              </Link>
            </li>
          );
        })}

        {/* View all */}
        <li className="w-[84px] shrink-0 snap-start lg:w-auto">
          <Link href="/shop" className="group flex flex-col items-center text-center">
            <span className="grid h-[84px] w-[84px] place-items-center rounded-full bg-mist transition-transform duration-300 group-hover:-translate-y-1 sm:h-[92px] sm:w-[92px]">
              <LayoutGrid className="h-8 w-8 text-forest/80" aria-hidden strokeWidth={1.6} />
            </span>
            <span className="mt-2.5 block text-[12.5px] font-semibold leading-tight text-ink transition-colors group-hover:text-forest">
              View All
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
