'use client';

/* ------------------------------------------------------------------ */
/* Wishlist, compare, recently viewed, search history and UI prefs     */
/* ------------------------------------------------------------------ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CurrencyCode } from '../types';
import { currencyByCode } from '../constants';
import { STORAGE_KEYS, readStore, writeStore } from './storage';

export interface UiPrefs {
  currency: CurrencyCode;
  language: 'en' | 'ar' | 'ur';
  emailOptIn: boolean;
  orderUpdates: boolean;
  smsOptIn: boolean;
  reduceMotion: boolean;
}

const DEFAULT_PREFS: UiPrefs = {
  currency: 'USD',
  language: 'en',
  emailOptIn: true,
  orderUpdates: true,
  smsOptIn: false,
  reduceMotion: false,
};

const MAX_RECENT = 12;
const MAX_SEARCHES = 8;

interface PrefsContextValue {
  /* Wishlist */
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;

  /* Compare */
  compare: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  /* Recently viewed */
  recent: string[];
  pushRecent: (productId: string) => void;
  clearRecent: () => void;

  /* Recent searches */
  searches: string[];
  pushSearch: (term: string) => void;
  clearSearches: () => void;

  /* Preferences */
  prefs: UiPrefs;
  setPref: <K extends keyof UiPrefs>(key: K, value: UiPrefs[K]) => void;
  currency: ReturnType<typeof currencyByCode>;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStore<string[]>(STORAGE_KEYS.wishlist, [])
  );
  const [compare, setCompare] = useState<string[]>(() =>
    readStore<string[]>(STORAGE_KEYS.compare, [])
  );
  const [recent, setRecent] = useState<string[]>(() =>
    readStore<string[]>(STORAGE_KEYS.recent, [])
  );
  const [searches, setSearches] = useState<string[]>(() =>
    readStore<string[]>(STORAGE_KEYS.searches, [])
  );
  const [prefs, setPrefs] = useState<UiPrefs>(() => ({
    ...DEFAULT_PREFS,
    ...readStore<Partial<UiPrefs>>(STORAGE_KEYS.prefs, {}),
  }));

  useEffect(() => writeStore(STORAGE_KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => writeStore(STORAGE_KEYS.compare, compare), [compare]);
  useEffect(() => writeStore(STORAGE_KEYS.recent, recent), [recent]);
  useEffect(() => writeStore(STORAGE_KEYS.searches, searches), [searches]);
  useEffect(() => writeStore(STORAGE_KEYS.prefs, prefs), [prefs]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]
    );
  }, []);

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const toggleCompare = useCallback((productId: string) => {
    setCompare((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : prev.length >= 4
          ? prev
          : [...prev, productId]
    );
  }, []);

  const pushRecent = useCallback((productId: string) => {
    setRecent((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX_RECENT));
  }, []);

  const pushSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (clean.length < 2) return;
    setSearches((prev) => [clean, ...prev.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_SEARCHES));
  }, []);

  const setPref = useCallback(<K extends keyof UiPrefs>(key: K, value: UiPrefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo<PrefsContextValue>(
    () => ({
      wishlist,
      isWishlisted,
      toggleWishlist,
      clearWishlist: () => setWishlist([]),
      compare,
      toggleCompare,
      clearCompare: () => setCompare([]),
      recent,
      pushRecent,
      clearRecent: () => setRecent([]),
      searches,
      pushSearch,
      clearSearches: () => setSearches([]),
      prefs,
      setPref,
      currency: currencyByCode(prefs.currency),
    }),
    [wishlist, isWishlisted, toggleWishlist, compare, toggleCompare, recent, pushRecent, searches, pushSearch, prefs, setPref]
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside <PrefsProvider>');
  return ctx;
}

/** Standalone wishlist hook so components can import it directly. */
export function useWishlist() {
  const { wishlist, isWishlisted, toggleWishlist, clearWishlist } = usePrefs();
  return { wishlist, isWishlisted, toggleWishlist, clearWishlist };
}