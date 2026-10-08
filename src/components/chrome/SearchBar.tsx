'use client';

/* ------------------------------------------------------------------ */
/* Search with live suggestions, recent terms and category shortcuts   */
/* ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchProducts } from '@/lib/data/products';
import { BRANDS } from '@/lib/data/products/brands';
import { usePrefs } from '@/lib/store';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { Price } from '@/components/ui/primitives';
import { SearchIdlePanel } from './SearchIdlePanel';

export function SearchBar({
  className,
  onNavigate,
  autoFocus,
}: {
  className?: string;
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const { searches, pushSearch, clearSearches } = usePrefs();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanQuery = query.trim();
  const results = cleanQuery.length >= 2 ? searchProducts(cleanQuery, 6) : [];
  const brandHits =
    cleanQuery.length >= 2
      ? BRANDS.filter((b) => b.name.toLowerCase().includes(cleanQuery.toLowerCase())).slice(0, 4)
      : [];
  const hasHits = results.length > 0 || brandHits.length > 0;

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const go = useCallback(
    (term: string) => {
      const clean = term.trim();
      if (!clean) return;
      pushSearch(clean);
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
      onNavigate?.();
      router.push(`/search?q=${encodeURIComponent(clean)}`);
    },
    [pushSearch, router, onNavigate]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(results.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(-1, h - 1));
    } else if (e.key === 'Enter') {
      if (highlight >= 0 && results[highlight]) {
        pushSearch(query);
        setOpen(false);
        onNavigate?.();
        router.push(`/product/${results[highlight].slug}`);
      } else {
        go(query);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showPanel = open && (hasHits || cleanQuery.length < 2);

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="luna-search-panel"
          aria-autocomplete="list"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search products, brands and more..."
          className="h-11 w-full rounded-md border border-transparent bg-mist pl-11 pr-14 text-sm text-ink placeholder:text-muted focus:border-forest focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/15"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-12 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-muted transition hover:bg-cream hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => go(query)}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-forest text-white transition hover:bg-forest-600"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      {showPanel && (
        <div
          id="luna-search-panel"
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-line bg-white shadow-card-hover animate-fadeUp"
        >
          {hasHits ? (
            <div className="py-1.5">
              {results.length > 0 && (
                <>
                  <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Products
                  </p>
              {results.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  role="option"
                  aria-selected={i === highlight}
                  onClick={() => {
                    pushSearch(query);
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 transition hover:bg-cream/60',
                    i === highlight && 'bg-cream/60'
                  )}
                >
                  <SmartImage
                    src={p.images[0]}
                    alt={p.name}
                    seed={p.sku}
                    aspect="square"
                    wrapperClassName="h-11 w-11 shrink-0 rounded-lg"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="clamp-1 block text-sm font-medium text-ink">{p.name}</span>
                    <span className="block text-xs text-muted">
                      {p.brand} · {p.category}
                    </span>
                  </span>
                  <Price amount={p.price} size="sm" />
                </Link>
              ))}
                </>
              )}
              {brandHits.length > 0 && (
                <>
                  <p className="px-4 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Brands
                  </p>
                  {brandHits.map((b) => (
                    <Link
                      key={b.id}
                      href={`/brand/${b.slug}`}
                      role="option"
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-cream/60"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cream text-[11px] font-bold text-forest">
                        {b.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">{b.name}</span>
                        <span className="block text-xs text-muted">{b.category} · {b.country}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted" />
                    </Link>
                  ))}
                </>
              )}
              <button
                type="button"
                onClick={() => go(query)}
                className="flex w-full items-center gap-2 border-t border-line px-4 py-3 text-sm font-semibold text-forest transition hover:bg-cream/60"
              >
                See all results for “{query}”
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : cleanQuery.length >= 2 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-semibold text-ink">No matches for “{query}”</p>
              <p className="mt-1 text-xs text-muted">Try a category, a brand or a shorter term.</p>
            </div>
          ) : (
            <SearchIdlePanel
              searches={searches}
              onPick={go}
              onClear={clearSearches}
              onNavigate={() => {
                setOpen(false);
                onNavigate?.();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}