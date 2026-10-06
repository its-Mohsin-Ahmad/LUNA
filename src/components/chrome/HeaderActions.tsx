'use client';

/* ------------------------------------------------------------------ */
/* Header actions: account menu, wishlist and cart with live badges    */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  LayoutDashboard,
  LogOut,
  Package,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { useAuth, useCart, usePrefs } from '@/lib/store';
import { cn, formatMoney } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';

function AccountMenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-ink transition hover:bg-cream/70"
    >
      <span className="text-muted">{icon}</span>
      {label}
    </Link>
  );
}

export function HeaderActions({
  onOpenCart,
  onOpenMobileNav,
  className,
}: {
  onOpenCart: () => void;
  onOpenMobileNav?: () => void;
  className?: string;
}) {
  const { totals } = useCart();
  const { wishlist, currency } = usePrefs();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const dashboardHref = user ? `/dashboard/${user.role.toLowerCase()}` : '/login';

  return (
    <div className={cn('flex items-center gap-1 sm:gap-1.5', className)}>
      {onOpenMobileNav && (
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-md text-forest transition hover:bg-cream lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex h-10 items-center gap-2 rounded-md px-2 text-forest transition hover:bg-cream"
        >
          {user ? (
            <SmartImage
              src={user.avatar}
              alt={user.name}
              seed={user.id}
              aspect="square"
              wrapperClassName="h-7 w-7 rounded-full"
            />
          ) : (
            <UserIcon className="h-5 w-5" />
          )}
          <span className="hidden text-sm font-semibold lg:inline">
            {user ? user.name.split(' ')[0] : 'Sign in'}
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 lg:inline" />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-card-hover animate-fadeUp"
          >
            {user ? (
              <>
                <div className="border-b border-line px-4 py-3">
                  <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                  <span className="mt-2 inline-block rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest">
                    {user.role.toLowerCase()}
                  </span>
                </div>
                <div className="py-1.5">
                  <AccountMenuLink href="/account" icon={<UserIcon className="h-4 w-4" />} label="My account" />
                  <AccountMenuLink href="/account/orders" icon={<Package className="h-4 w-4" />} label="My orders" />
                  <AccountMenuLink href="/account/wishlist" icon={<Heart className="h-4 w-4" />} label="Wishlist" />
                  <AccountMenuLink href="/account/addresses" icon={<MapPin className="h-4 w-4" />} label="Addresses" />
                  <AccountMenuLink href={dashboardHref} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
                </div>
                <div className="border-t border-line p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-sale transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-4">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-md bg-forest px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-forest-600"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 block w-full rounded-md border border-forest/25 px-4 py-2.5 text-center text-sm font-semibold text-forest transition hover:bg-cream"
                  >
                    Create account
                  </Link>
                </div>
                <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-muted">
                  Sign in for order history, saved addresses and loyalty points.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <Link
        href="/wishlist"
        aria-label={`Wishlist, ${wishlist.length} items`}
        className="relative grid h-10 w-10 place-items-center rounded-md text-forest transition hover:bg-cream"
      >
        <Heart className="h-5 w-5" />
        {wishlist.length > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
            {wishlist.length > 9 ? '9+' : wishlist.length}
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={onOpenCart}
        aria-label={`Shopping bag, ${totals.itemCount} items, ${formatMoney(totals.total, currency)}`}
        className="relative flex h-10 items-center gap-2 rounded-md px-2 text-forest transition hover:bg-cream"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="hidden text-sm font-semibold tabular-nums xl:inline">
          {formatMoney(totals.total, currency)}
        </span>
        {totals.itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-forest px-1 text-[10px] font-bold text-white">
            {totals.itemCount > 99 ? '99+' : totals.itemCount}
          </span>
        )}
      </button>
    </div>
  );
}