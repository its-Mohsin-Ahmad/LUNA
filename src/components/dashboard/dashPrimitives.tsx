'use client';

/* ------------------------------------------------------------------ */
/* Shared dashboard building blocks: tabs, stat cards, panels, tables   */
/* ------------------------------------------------------------------ */

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DashTab {
  key: string;
  label: string;
  icon: LucideIcon;
}

const STAT_TONES = {
  forest: 'bg-forest text-cream',
  cream: 'bg-cream text-forest',
  gold: 'bg-gold/15 text-gold',
  sale: 'bg-sale/10 text-sale',
  white: 'bg-white text-forest',
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'white',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof STAT_TONES;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3.5 rounded-2xl border border-line p-5',
        tone === 'white' ? 'bg-white text-forest' : STAT_TONES[tone]
      )}
    >
      <span
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
          tone === 'white' ? 'bg-cream text-forest' : 'bg-white/15'
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">
          {label}
        </span>
        <span className="display mt-0.5 block text-2xl leading-tight">{value}</span>
        {hint && <span className="mt-0.5 block text-xs opacity-70">{hint}</span>}
      </span>
    </div>
  );
}

export function PanelCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-2xl border border-line bg-white', className)}>
      {title && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/** Shared table styling used across every dashboard table. */
export const TABLE = {
  wrap: 'overflow-x-auto thin-scrollbar',
  table: 'w-full min-w-[560px] border-collapse text-sm',
  head: 'text-[11px] font-bold uppercase tracking-[0.12em] text-muted',
  th: 'border-b border-line px-4 py-3 text-left',
  td: 'border-b border-line px-4 py-3 text-[13px] text-ink',
};
