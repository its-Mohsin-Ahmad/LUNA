'use client';

import Link from 'next/link';
import { Clock, TrendingUp } from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';

const POPULAR = ['headphones', 'sofa', 'running shoes', 'coffee', 'gift set'];

/** Shown when the search field is focused but empty. */
export function SearchIdlePanel({
  searches,
  onPick,
  onClear,
  onNavigate,
}: {
  searches: string[];
  onPick: (term: string) => void;
  onClear: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="py-3">
      {searches.length > 0 && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Recent searches
            </p>
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] font-semibold text-forest hover:underline"
            >
              Clear
            </button>
          </div>
          <ul className="mt-1.5 space-y-0.5">
            {searches.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => onPick(s)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-ink transition hover:bg-cream/60"
                >
                  <Clock className="h-3.5 w-3.5 shrink-0 text-muted" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-4 pt-2">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          <TrendingUp className="h-3 w-3" />
          Popular right now
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {POPULAR.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onPick(term)}
              className="rounded-full border border-line bg-warm px-3 py-1.5 text-xs font-medium text-ink transition hover:border-forest hover:bg-cream"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 border-t border-line px-4 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Categories</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CATEGORIES.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              onClick={onNavigate}
              className="rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-forest transition hover:bg-sage"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}