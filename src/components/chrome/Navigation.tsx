'use client';

/* ------------------------------------------------------------------ */
/* Desktop navigation with hover mega-menu                             */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, LayoutGrid, Flame, Sparkles, Tag, Store, Building2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { cn } from '@/lib/utils';
import { MegaMenu } from './MegaMenu';

export const UTILITY_LINKS = [
  { label: 'All products', href: '/shop', icon: LayoutGrid },
  { label: 'Deals', href: '/shop/deals', icon: Tag },
  { label: 'New arrivals', href: '/new-arrivals', icon: Sparkles },
  { label: 'Flash sale', href: '/shop/deals?flash=1', icon: Flame },
  { label: 'Brands', href: '/brands', icon: Store },
  { label: 'Sell on LUNA', href: '/sell', icon: Building2 },
];

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setOpenSlug(null), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSlug(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const open = (slug: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenSlug(slug);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenSlug(null), 180);
  };

  return (
    <nav
      aria-label="Main"
      className={cn('relative hidden border-t border-line bg-white lg:block', className)}
      onMouseLeave={scheduleClose}
    >
      <div className="shell">
        <ul className="flex items-center gap-1">
          {CATEGORIES.map((cat) => {
            const isOpen = openSlug === cat.slug;
            return (
              <li key={cat.slug} onMouseEnter={() => open(cat.slug)}>
                <Link
                  href={`/shop/${cat.slug}`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onFocus={() => open(cat.slug)}
                  className={cn(
                    'flex items-center gap-1 whitespace-nowrap border-b-2 px-3 py-3 text-[13.5px] font-semibold transition-colors',
                    isOpen
                      ? 'border-forest text-forest'
                      : 'border-transparent text-ink hover:border-forest/40 hover:text-forest'
                  )}
                >
                  {cat.name}
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 text-muted transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </Link>
              </li>
            );
          })}
          <li className="ml-auto">
            <Link
              href="/shop/deals"
              className="flex items-center gap-1.5 px-3 py-3 text-[13.5px] font-bold text-sale"
            >
              <Flame className="h-3.5 w-3.5" />
              Sale
            </Link>
          </li>
        </ul>
      </div>

      {openSlug && <MegaMenu slug={openSlug} />}
    </nav>
  );
}