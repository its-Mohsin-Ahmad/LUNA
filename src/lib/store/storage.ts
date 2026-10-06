'use client';

/* ------------------------------------------------------------------ */
/* Shared storage helpers for all LUNA client state.                   */
/* ------------------------------------------------------------------ */

import { safeJson } from '../utils';

export const STORAGE_KEYS = {
  cart: 'luna.cart.v1',
  wishlist: 'luna.wishlist.v1',
  compare: 'luna.compare.v1',
  recent: 'luna.recent.v1',
  searches: 'luna.searches.v1',
  session: 'luna.session.v1',
  users: 'luna.users.v1',
  prefs: 'luna.prefs.v1',
  orders: 'luna.orders.v1',
  addresses: 'luna.addresses.v1',
  newsletter: 'luna.newsletter.v1',
} as const;

/** Read persisted state, tolerating SSR and corrupt JSON. */
export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  return safeJson<T>(window.localStorage.getItem(key), fallback);
}

/** Write state, silently ignoring quota/private-mode errors. */
export function writeStore(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function clearStore(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}