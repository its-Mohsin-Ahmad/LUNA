'use client';

/* ------------------------------------------------------------------ */
/* Buttons and badges                                                  */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2, Star } from 'lucide-react';
import { cn, formatMoney } from '@/lib/utils';
import { usePrefs } from '@/lib/store';

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'sale' | 'dark' | 'gold';
export type Size = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-forest text-white hover:bg-forest-600 active:bg-forest-800 shadow-soft disabled:bg-forest/40',
  secondary: 'bg-cream text-forest hover:bg-sage border border-forest/10 disabled:bg-cream/60',
  outline:
    'border border-forest/25 text-forest hover:bg-forest hover:text-white hover:border-forest disabled:opacity-40',
  ghost: 'text-forest hover:bg-cream/70 disabled:opacity-40',
  sale: 'bg-sale text-white hover:brightness-95 shadow-soft disabled:opacity-50',
  dark: 'bg-ink text-white hover:bg-forest disabled:opacity-50',
  gold: 'bg-gold text-ink hover:brightness-105 shadow-soft disabled:opacity-50',
};

export const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
  xl: 'h-14 px-8 text-base gap-2.5',
  icon: 'h-10 w-10 justify-center',
};

const BASE =
  'inline-flex items-center justify-center rounded-md font-semibold tracking-tight ' +
  'transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:active:translate-y-0 select-none';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading,
    fullWidth,
    icon,
    className,
    children,
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
});

export function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  fullWidth,
  icon,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
}) {
  return (
    <Link href={href} className={cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}>
      {icon}
      {children}
    </Link>
  );
}

/* -------------------------------- Badge -------------------------------- */

const BADGE_TONES = {
  neutral: 'bg-mist text-muted',
  forest: 'bg-forest text-white',
  sage: 'bg-sage text-forest',
  sale: 'bg-sale text-white',
  gold: 'bg-gold text-ink',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-800',
} as const;

export type BadgeTone = keyof typeof BADGE_TONES;

export function Badge({
  children,
  tone = 'neutral',
  className,
  size = 'md',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        BADGE_TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------ StatusBadge ------------------------------ */

const STATUS_TONES: Record<string, BadgeTone> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  PACKED: 'info',
  SHIPPED: 'info',
  OUT_FOR_DELIVERY: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  RETURNED: 'neutral',
  NEW: 'info',
  CONTACTED: 'warning',
  QUALIFIED: 'info',
  PROPOSAL: 'info',
  WON: 'success',
  LOST: 'danger',
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  PAID: 'success',
  UNPAID: 'warning',
  REFUNDED: 'info',
  PUBLISHED: 'success',
  DRAFT: 'warning',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge tone={STATUS_TONES[status.toUpperCase()] ?? 'neutral'} className={className}>
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
/* ------------------------------- Rating -------------------------------- */

export function Rating({
  value,
  count,
  size = 'sm',
  showValue = true,
  className,
}: {
  value: number;
  count?: number;
  size?: 'xs' | 'sm' | 'md';
  showValue?: boolean;
  className?: string;
}) {
  const px = size === 'xs' ? 12 : size === 'sm' ? 14 : 18;
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="inline-flex items-center gap-px" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className="relative inline-block" style={{ width: px, height: px }}>
              <Star className="absolute inset-0 text-line" style={{ width: px, height: px }} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star
                  className="text-gold"
                  style={{ width: px, height: px }}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-ink tabular-nums">{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-xs text-muted tabular-nums">({count.toLocaleString()})</span>
      )}
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5
        {count !== undefined ? ` from ${count} reviews` : ''}
      </span>
    </span>
  );
}

/* -------------------------------- Price -------------------------------- */

export function Price({
  amount,
  originalAmount,
  size = 'md',
  className,
}: {
  amount: number;
  originalAmount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const { currency } = usePrefs();
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('font-bold text-ink tabular-nums', sizes[size])}>
        {formatMoney(amount, currency)}
      </span>
      {originalAmount && originalAmount > amount && (
        <span className={cn('text-muted line-through tabular-nums', size === 'lg' ? 'text-sm' : 'text-xs')}>
          {formatMoney(originalAmount, currency)}
        </span>
      )}
    </span>
  );
}

/** Renders an amount in the active currency. */
export function Money({
  amount,
  className,
  bold = true,
}: {
  amount: number;
  className?: string;
  bold?: boolean;
}) {
  const { currency } = usePrefs();
  return (
    <span className={cn(bold && 'font-bold tabular-nums', className)}>
      {formatMoney(amount, currency)}
    </span>
  );
}