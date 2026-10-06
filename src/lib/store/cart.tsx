'use client';

/* ------------------------------------------------------------------ */
/* Cart state                                                          */
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
import type { CartItem, CartLine, ProductVariant } from '../types';
import { COMMERCE } from '../constants';
import { getProductById } from '../data/products';
import { STORAGE_KEYS, readStore, writeStore } from './storage';
import { round2 } from '../utils';

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  savings: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingGap: number;
  qualifiesForFreeShipping: boolean;
}

export const COUPONS: Record<string, { rate: number; label: string }> = {
  LUNA10: { rate: 0.1, label: '10% off' },
  WELCOME15: { rate: 0.15, label: '15% welcome discount' },
  SAVE20: { rate: 0.2, label: '20% off' },
  FREESHIP: { rate: 0, label: 'Free shipping' },
};

interface CartContextValue {
  lines: CartLine[];
  items: CartItem[];
  totals: CartTotals;
  discount: number;
  coupon: string | null;
  add: (productId: string, qty?: number, variantId?: string) => void;
  remove: (productId: string, variantId?: string) => void;
  setQty: (productId: string, qty: number, variantId?: string) => void;
  clear: () => void;
  countFor: (productId: string) => number;
  variantStock: (productId: string, variant?: ProductVariant) => number;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function resolveLines(lines: CartLine[]): CartItem[] {
  return lines.flatMap((line) => {
    const product = getProductById(line.productId);
    if (!product) return [];
    const variant = line.variantId
      ? product.variants.find((v) => v.id === line.variantId)
      : undefined;
    return [{ product, variant, qty: line.qty }];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readStore<CartLine[]>(STORAGE_KEYS.cart, []));
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => writeStore(STORAGE_KEYS.cart, lines), [lines]);

  const add = useCallback((productId: string, qty = 1, variantId?: string) => {
    setLines((prev) => {
      const idx = prev.findIndex(
        (l) => l.productId === productId && (l.variantId ?? null) === (variantId ?? null)
      );
      const product = getProductById(productId);
      const max = product
        ? Math.min(product.stock, COMMERCE.maxQtyPerLine)
        : COMMERCE.maxQtyPerLine;
      if (idx === -1) return [...prev, { productId, variantId, qty, addedAt: Date.now() }];
      const next = [...prev];
      next[idx] = { ...next[idx], qty: Math.min(max, next[idx].qty + qty) };
      return next;
    });
  }, []);

  const remove = useCallback((productId: string, variantId?: string) => {
    setLines((prev) =>
      prev.filter(
        (l) => !(l.productId === productId && (l.variantId ?? null) === (variantId ?? null))
      )
    );
  }, []);

  const setQty = useCallback((productId: string, qty: number, variantId?: string) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter(
            (l) => !(l.productId === productId && (l.variantId ?? null) === (variantId ?? null))
          )
        : prev.map((l) =>
            l.productId === productId && (l.variantId ?? null) === (variantId ?? null)
              ? { ...l, qty: Math.min(COMMERCE.maxQtyPerLine, qty) }
              : l
          )
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const items = useMemo(() => resolveLines(lines), [lines]);
const discount = useMemo(() => {
    if (!coupon) return 0;
    const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);
    return round2(subtotal * (COUPONS[coupon]?.rate ?? 0));
  }, [coupon, items]);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = round2(items.reduce((n, i) => n + i.product.price * i.qty, 0));
    const listTotal = items.reduce(
      (n, i) => n + (i.product.originalPrice ?? i.product.price) * i.qty,
      0
    );
    const itemCount = items.reduce((n, i) => n + i.qty, 0);
    const qualifies = subtotal >= COMMERCE.freeShippingThreshold;
    let shipping = subtotal === 0 || qualifies ? 0 : COMMERCE.standardShipping;
    if (coupon === 'FREESHIP') shipping = 0;
    const tax = round2(subtotal * COMMERCE.taxRate);
    const payable = Math.max(0, subtotal - discount);
    return {
      itemCount,
      subtotal,
      savings: round2(listTotal - subtotal + discount),
      shipping,
      tax,
      total: round2(payable + shipping + tax),
      freeShippingGap: Math.max(0, round2(COMMERCE.freeShippingThreshold - subtotal)),
      qualifiesForFreeShipping: qualifies,
    };
  }, [items, discount, coupon]);

  const countFor = useCallback(
    (productId: string) =>
      lines.filter((l) => l.productId === productId).reduce((n, l) => n + l.qty, 0),
    [lines]
  );

  const variantStock = useCallback(
    (productId: string, variant?: ProductVariant) =>
      variant ? variant.stock : (getProductById(productId)?.stock ?? 0),
    []
  );

  const applyCoupon = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      if (!(key in COUPONS)) return { ok: false, message: 'That promo code is not recognised.' };
      if (totals.subtotal === 0) return { ok: false, message: 'Add something to your bag first.' };
      setCoupon(key);
      return { ok: true, message: `${COUPONS[key].label} applied.` };
    },
    [totals.subtotal]
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      items,
      totals,
      discount,
      coupon,
      add,
      remove,
      setQty,
      clear,
      countFor,
      variantStock,
      applyCoupon,
      removeCoupon,
    }),
    [
      lines,
      items,
      totals,
      discount,
      coupon,
      add,
      remove,
      setQty,
      clear,
      countFor,
      variantStock,
      applyCoupon,
      removeCoupon,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}