'use client';

/* ------------------------------------------------------------------ */
/* Single entry point that composes every LUNA store provider.        */
/* ------------------------------------------------------------------ */

import type { ReactNode } from 'react';
import { ToastProvider } from './toast';
import { CartProvider } from './cart';
import { AuthProvider } from './auth';
import { PrefsProvider } from './prefs';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PrefsProvider>
        <CartProvider>
          <AuthProvider>{children}</AuthProvider>
        </CartProvider>
      </PrefsProvider>
    </ToastProvider>
  );
}

export { useCart, COUPONS } from './cart';
export type { CartTotals } from './cart';
export { useToast } from './toast';
export type { Toast, ToastApi } from './toast';
export { useAuth, DEMO_ACCOUNTS } from './auth';
export { usePrefs, useWishlist } from './prefs';
export type { UiPrefs } from './prefs';
export { STORAGE_KEYS, readStore, writeStore, clearStore } from './storage';