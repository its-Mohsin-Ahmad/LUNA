'use client';

/* ------------------------------------------------------------------ */
/* Sticky site header: logo · search · account/wishlist/cart            */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/Logo';
import { SearchBar } from './SearchBar';
import { HeaderActions } from './HeaderActions';

export function Header({
  onOpenCart,
  onOpenMobileNav,
}: {
  onOpenCart: () => void;
  onOpenMobileNav: () => void;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow',
        scrolled ? 'border-line shadow-soft' : 'border-transparent'
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="shell">
        {/* ROW 1 — hamburger · logo · wishlist · cart (icons only on phones) */}
        <div className="flex h-16 items-center gap-1 sm:gap-4 lg:h-[74px] lg:gap-6">
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open menu"
            className="tap-squish -ml-1 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-forest transition hover:bg-cream md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo className="min-w-0 shrink" showTagline />

          {/* Center: large search (desktop / tablet) */}
          <SearchBar className="mx-auto hidden max-w-2xl flex-1 md:block" key={`d-${pathname}`} />

          {/* Right: account · wishlist · cart */}
          <HeaderActions onOpenCart={onOpenCart} className="ml-auto md:ml-0" />
        </div>

        {/* ROW 2 — full-width search */}
        <div className="pb-2.5 md:hidden">
          <SearchBar key={`m-${pathname}`} />
        </div>
      </div>
    </header>
  );
}