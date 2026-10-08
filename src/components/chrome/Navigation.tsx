'use client';

/* ------------------------------------------------------------------ */
/* Desktop navigation: All Categories mega menu + primary links         */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LayoutGrid, Flame, Sparkles, Tag, Store, Building2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { cn } from '@/lib/utils';

export const UTILITY_LINKS = [
  { label: 'All products', href: '/shop', icon: LayoutGrid },
  { label: 'Deals', href: '/shop/deals', icon: Tag },
  { label: 'New arrivals', href: '/new-arrivals', icon: Sparkles },
  { label: 'Flash sale', href: '/shop/deals?flash=1', icon: Flame },
  { label: 'Brands', href: '/brands', icon: Store },
  { label: 'Sell on LUNA', href: '/sell', icon: Building2 },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Deals', href: '/shop/deals' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Brands', href: '/brands' },
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Track Order', href: '/track-order' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '/shop') {
    // Category pages count as Shop, but Deals does not.
    return pathname.startsWith('/shop') && !pathname.startsWith('/shop/deals');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className={cn('relative hidden border-t border-line bg-white lg:block', className)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="shell">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            onMouseEnter={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="true"
            className="my-2 mr-3 inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-forest px-4 text-[13px] font-bold text-white transition hover:bg-forest-600"
          >
            <Menu className="h-4 w-4" aria-hidden />
            All Categories
          </button>

          <ul className="flex items-center">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center whitespace-nowrap border-b-2 px-3.5 py-3.5 text-[13.5px] font-semibold transition-colors',
                      active
                        ? 'border-forest text-forest'
                        : 'border-transparent text-ink hover:border-forest/40 hover:text-forest'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {open && (
        <div
          className="absolute inset-x-0 top-full z-40 border-y border-line bg-white shadow-card-hover animate-fadeUp"
          onMouseEnter={() => setOpen(true)}
        >
          <div className="shell grid grid-cols-4 gap-x-7 gap-y-6 py-6 xl:grid-cols-7">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug}>
                <Link
                  href={`/shop/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="text-[13px] font-bold text-forest hover:underline"
                >
                  {cat.name}
                </Link>
                <ul className="mt-2 space-y-1.5">
                  {cat.subcategories.slice(0, 5).map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/shop/${cat.slug}?sub=${sub.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-[12.5px] leading-snug text-muted transition hover:text-forest"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="shell flex border-t border-line py-3.5">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-forest hover:underline"
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
              View all categories
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}