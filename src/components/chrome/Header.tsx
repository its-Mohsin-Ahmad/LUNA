'use client';

/* ------------------------------------------------------------------ */
/* Sticky site header shell                                            */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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
    >
      <div className="shell">
        <div className="flex h-16 items-center gap-3 lg:h-[74px] lg:gap-8">
          <HeaderActions onOpenCart={onOpenCart} onOpenMobileNav={onOpenMobileNav} />
          <Logo className="shrink-0" />
          <SearchBar className="hidden max-w-2xl flex-1 md:block" key={`d-${pathname}`} />
          <div className="ml-auto hidden lg:block">
            <a
              href="#footer-help"
              className="text-[13px] font-semibold text-ink transition-colors hover:text-forest"
            >
              Help
            </a>
          </div>
        </div>
        <div className="pb-3 md:hidden">
          <SearchBar key={`m-${pathname}`} />
        </div>
      </div>
    </header>
  );
}