import type { Currency, CurrencyCode } from './types';

/* ---------------------------------- cn ---------------------------------- */

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/* -------------------------------- format -------------------------------- */

export function formatMoney(
  amount: number,
  currency: Currency | { code: CurrencyCode; symbol: string; locale?: string } = {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
  }
): string {
  const locale =
    'locale' in currency && currency.locale
      ? currency.locale
      : currency.code === 'EUR'
        ? 'de-DE'
        : currency.code === 'GBP'
          ? 'en-GB'
          : 'en-US';
  const value = 'rate' in currency ? amount * currency.rate : amount;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency.symbol}${value.toFixed(2)}`;
  }
}

export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/* -------------------------------- misc --------------------------------- */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function titleCase(input: string): string {
  return input
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function orderNumber(): string {
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const seq = String(Math.floor(Math.random() * 900000) + 100000);
  return `LN-${y}${String(d.getMonth() + 1).padStart(2, '0')}-${seq}`;
}

export function discountOf(price: number, original?: number): number | undefined {
  if (!original || original <= price) return undefined;
  return Math.round(((original - price) / original) * 100);
}

export function safeJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function groupBy<T, K extends string>(items: T[], key: (item: T) => K): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const k = key(item);
      (acc[k] ||= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
}

/** Deterministic pseudo-random from seed — keeps SSR/CSR consistent. */
export function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
