'use client';

/* ------------------------------------------------------------------ */
/* Storefront shell: chrome, overlays and global toasts                */
/* ------------------------------------------------------------------ */

import { useState, type ReactNode } from 'react';
import { Providers } from '@/lib/store';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { MobileNav, MobileBottomNav } from './MobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastViewport } from '@/components/ui';

function StorefrontFrame({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>

      <Header onOpenCart={() => setCartOpen(true)} onOpenMobileNav={() => setNavOpen(true)} />
      <Navigation />

      <main id="main" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      <Footer />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
      <MobileBottomNav onOpenCart={() => setCartOpen(true)} onOpenNav={() => setNavOpen(true)} />
      <ToastViewport />
    </div>
  );
}

export function Storefront({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <StorefrontFrame>{children}</StorefrontFrame>
    </Providers>
  );
}