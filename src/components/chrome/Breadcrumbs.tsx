'use client';

import Link from 'next/link';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import type { Breadcrumb } from '@/lib/types';

export function Breadcrumbs({
  items,
  className,
}: {
  items: Breadcrumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i === 0 && <HomeIcon className="h-3.5 w-3.5" aria-hidden />}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded transition-colors hover:text-forest hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-ink" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 text-muted/60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}