'use client';

/* ------------------------------------------------------------------ */
/* Feedback and layout helpers                                         */
/* ------------------------------------------------------------------ */

import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn, clamp } from '@/lib/utils';
import { Button, LinkButton } from './primitives';

/* ------------------------------ Skeleton ------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-md', className)} aria-hidden />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-1/2" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ----------------------------- Empty state ----------------------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string } | { label: string; onClick: () => void };
  onAction?: () => void;
  className?: string;
}) {
  const href = action && 'href' in action ? action.href : undefined;
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-white/70 px-6 py-14 text-center',
        className
      )}
    >
      {icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-forest">
          {icon}
        </span>
      )}
      <div className="max-w-md space-y-1.5">
        <h3 className="display text-lg text-forest">{title}</h3>
        {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {action && href && <LinkButton href={action.label && href}>{action.label}</LinkButton>}
      {action && !href && (
        <Button onClick={'onClick' in action ? action.onClick : onAction}>{action.label}</Button>
      )}
    </div>
  );
}

/* -------------------------- Quantity stepper --------------------------- */

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'md',
  label = 'Quantity',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  const box = size === 'sm' ? 'h-8' : 'h-10';
  const btn = size === 'sm' ? 'w-8 text-sm' : 'w-10 text-base';
  return (
    <div className={cn('inline-flex items-center rounded-md border border-line bg-white', box)}>
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(btn, 'grid h-full place-items-center font-semibold text-forest transition hover:bg-cream disabled:opacity-35 disabled:hover:bg-transparent')}
      >
        −
      </button>
      <input
        type="number"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(clamp(n, min, max));
        }}
        className={cn('qty-input w-9 border-0 bg-transparent text-center text-sm font-semibold tabular-nums text-ink', box)}
      />
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(btn, 'grid h-full place-items-center font-semibold text-forest transition hover:bg-cream disabled:opacity-35 disabled:hover:bg-transparent')}
      >
        +
      </button>
    </div>
  );
}
/* -------------------------------- Tabs --------------------------------- */

export function Tabs({
  tabs,
  active,
  onChange,
  className,
  ariaLabel = 'Sections',
}: {
  tabs: Array<{ id: string; label: string; count?: number }>;
  active: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('no-scrollbar flex gap-1 overflow-x-auto border-b border-line', className)}
    >
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={cn(
              'relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors',
              isActive ? 'text-forest' : 'text-muted hover:text-ink'
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cn('ml-1.5 text-xs tabular-nums', isActive ? 'text-forest/60' : 'text-muted/70')}>
                {t.count}
              </span>
            )}
            {isActive && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-forest" />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------- Section heading ---------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className
      )}
    >
      <div className={cn('max-w-2xl space-y-1.5', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">{eyebrow}</p>
        )}
        <h2 className="display text-[26px] leading-tight text-forest sm:text-[32px]">{title}</h2>
        {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}