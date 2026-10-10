'use client';

/* ------------------------------------------------------------------ */
/* Mobile drawer navigation                                             */
/* ------------------------------------------------------------------ */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Headphones,
  Heart,
  Mail,
  Menu,
  Phone,
  Home,
  ShoppingBag,
  Tag,
  User,
  Sparkles,
  Store,
  Lightbulb,
  PackageSearch,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';
import { Drawer } from '@/components/ui/overlays';
import { CATEGORIES } from '@/lib/data/categories';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store';
import { NAV_LINKS, UTILITY_LINKS } from './Navigation';

/** Primary destinations, each with a recognisable icon. */
const NAV_ICONS: Record<string, LucideIcon> = {
  '/': Home,
  '/shop': ShoppingBag,
  '/shop/deals': Tag,
  '/new-arrivals': Sparkles,
  '/brands': Store,
  '/inspiration': Lightbulb,
  '/track-order': PackageSearch,
};

/** Category tile icons — mirrors the homepage category rail. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Store,
  fashion: Sparkles,
  'home-living': Home,
  beauty: Sparkles,
  sports: Tag,
  'toys-kids': Sparkles,
  books: PackageSearch,
  'pet-supplies': Sparkles,
};

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    closeRef.current();
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Menu"
      side="left"
      width="w-[86vw] max-w-[360px]"
    >
      <div className="border-b border-line bg-cream/50 px-4 py-4 sm:px-5">
        <nav aria-label="Mobile utility">
          <ul className="grid grid-cols-2 gap-2">
            {UTILITY_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[13px] font-semibold text-ink transition active:scale-[0.98] hover:text-forest"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-forest" aria-hidden />
                    <span className="clamp-1">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="px-4 py-3 sm:px-5">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Browse</p>
        <ul className="divide-y divide-line">
          {NAV_LINKS.map((link) => {
            const Icon = NAV_ICONS[link.href] ?? ChevronRight;
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center gap-3 py-2.5 text-[14px] font-semibold transition',
                    active ? 'text-forest' : 'text-ink active:text-forest'
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0 text-forest/80" aria-hidden />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-line px-4 pb-6 pt-3 sm:px-5">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          All Categories
        </p>
        <ul className="divide-y divide-line">
          {CATEGORIES.map((cat) => {
            const isOpen = expanded === cat.slug;
            const Icon = CATEGORY_ICONS[cat.slug] ?? LayoutGrid;
            return (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : cat.slug)}
                  aria-expanded={isOpen}
                  className="flex min-h-12 w-full items-center gap-3 py-2.5 text-left text-[14px] font-semibold text-ink"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cream text-forest">
                    <Icon className="h-4 w-4" aria-hidden strokeWidth={1.7} />
                  </span>
                  <span className="flex-1">{cat.name}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                {isOpen && (
                  <ul className="animate-fadeUp space-y-0.5 pb-3 pl-11">
                    <li>
                      <Link
                        href={`/shop/${cat.slug}`}
                        className="block py-1.5 text-[13.5px] font-semibold text-forest"
                      >
                        All {cat.name}
                      </Link>
                    </li>
                    {cat.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/shop/${cat.slug}?sub=${sub.slug}`}
                          className="block py-1.5 text-[13.5px] text-muted transition active:text-forest"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto space-y-2 border-t border-line bg-warm px-4 py-4 sm:px-5">
        <a
          href={`mailto:${SITE.supportEmail}`}
          className="flex items-center gap-2.5 py-1 text-[13.5px] text-ink transition active:text-forest"
        >
          <Mail className="h-4 w-4 shrink-0 text-forest" aria-hidden />
          {SITE.supportEmail}
        </a>
        <a
          href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
          className="flex items-center gap-2.5 py-1 text-[13.5px] text-ink transition active:text-forest"
        >
          <Phone className="h-4 w-4 shrink-0 text-forest" aria-hidden />
          {SITE.phone}
        </a>
        <p className="flex items-center gap-2.5 text-[13.5px] text-ink">
          <Headphones className="h-4 w-4 shrink-0 text-forest" aria-hidden />
          {SITE.hours}
        </p>
      </div>
    </Drawer>
  );
}

/* --------------------------- Back to top (mobile) -------------------------- */

/**
 * Subtle floating jump-to-top control. Appears once the visitor has scrolled a
 * couple of screens, sits above the fixed bottom navigation, and is hidden on
 * desktop where the footer and sticky header already cover this need.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'tap-squish fixed right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-white/95 text-forest shadow-card backdrop-blur transition-all duration-300 lg:hidden',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      )}
      style={{ bottom: 'calc(9.5rem + env(safe-area-inset-bottom))' }}
    >
      <ArrowUp className="h-[18px] w-[18px]" aria-hidden />
    </button>
  );
}

/* --------------------------- Mobile bottom navigation ---------------------- */

export function MobileBottomNav({
  onOpenCart,
  onOpenNav,
}: {
  onOpenCart: () => void;
  onOpenNav: () => void;
}) {
  const { items } = useCart();
  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        <BottomItem href="/" label="Home" icon={Home} />
        <li>
          <button
            type="button"
            onClick={onOpenNav}
            className="tap-squish flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-semibold text-muted transition-colors active:text-forest"
          >
            <Menu className="h-[20px] w-[20px]" aria-hidden />
            Menu
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onOpenCart}
            className="tap-squish relative flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-semibold text-muted transition-colors active:text-forest"
          >
            <span className="relative">
              <ShoppingBag className="h-[20px] w-[20px]" aria-hidden />
              {count > 0 && (
                <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[9px] font-bold text-white ring-2 ring-white">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </span>
            Bag
          </button>
        </li>
        <BottomItem href="/wishlist" label="Saved" icon={Heart} />
        <BottomItem href="/account" label="Account" icon={User} />
      </ul>
    </nav>
  );
}

export function BottomItem({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'tap-squish flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
          active ? 'text-forest' : 'text-muted'
        )}
      >
        <Icon className="h-[20px] w-[20px]" aria-hidden />
        {label}
      </Link>
    </li>
  );
}