'use client';

/* ------------------------------------------------------------------ */
/* Mobile drawer navigation                                             */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Headphones, Mail, Phone, Home, Heart, User, Menu, ShoppingBag, type LucideIcon } from 'lucide-react';
import { Drawer } from '@/components/ui/overlays';
import { CATEGORIES } from '@/lib/data/categories';
import { SITE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useCart } from '@/lib/store';
import { UTILITY_LINKS } from './Navigation';

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    closeRef.current();
  }, [pathname]);

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left" width="max-w-sm">
      <div className="border-b border-line bg-cream/50 px-5 py-4">
        <nav aria-label="Mobile utility">
          <ul className="grid grid-cols-2 gap-2">
            {UTILITY_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-[13px] font-semibold text-ink transition hover:text-forest"
                  >
                    <Icon className="h-3.5 w-3.5 text-forest" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="px-5 py-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Categories</p>
        <ul className="divide-y divide-line">
          {CATEGORIES.map((cat) => {
            const isOpen = expanded === cat.slug;
            return (
              <li key={cat.slug}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : cat.slug)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-ink"
                >
                  {cat.name}
                  <ChevronDown
                    className={`h-4 w-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <ul className="animate-fadeUp space-y-0.5 pb-3 pl-3">
                    <li>
                      <Link
                        href={`/shop/${cat.slug}`}
                        className="block rounded-md py-1.5 text-sm font-semibold text-forest"
                      >
                        All {cat.name}
                      </Link>
                    </li>
                    {cat.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/shop/${cat.slug}?sub=${sub.slug}`}
                          className="block rounded-md py-1.5 text-sm text-muted transition hover:text-forest"
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

      <div className="mt-auto space-y-2 border-t border-line bg-warm px-5 py-4">
        <a
          href={`mailto:${SITE.supportEmail}`}
          className="flex items-center gap-2.5 text-sm text-ink transition hover:text-forest"
        >
          <Mail className="h-4 w-4 text-forest" />
          {SITE.supportEmail}
        </a>
        <a
          href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
          className="flex items-center gap-2.5 text-sm text-ink transition hover:text-forest"
        >
          <Phone className="h-4 w-4 text-forest" />
          {SITE.phone}
        </a>
        <p className="flex items-center gap-2.5 text-sm text-ink">
          <Headphones className="h-4 w-4 text-forest" />
          {SITE.hours}
        </p>
      </div>
    </Drawer>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile bottom navigation bar                                        */
/* ------------------------------------------------------------------ */

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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-5">
        <BottomItem href="/" label="Home" icon={Home} />
        <li>
          <button
            type="button"
            onClick={onOpenNav}
            className="flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-semibold text-muted transition-colors active:text-forest"
          >
            <Menu className="h-[18px] w-[18px]" />
            Menu
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-semibold text-muted transition-colors active:text-forest"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            Bag
            {count > 0 && (
              <span className="absolute right-[20%] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[9px] font-bold text-white">
                {count > 9 ? '9+' : count}
              </span>
            )}
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
          'flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
          active ? 'text-forest' : 'text-muted'
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
        {label}
      </Link>
    </li>
  );
}