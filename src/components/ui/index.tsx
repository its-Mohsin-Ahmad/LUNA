'use client';

/* ------------------------------------------------------------------ */
/* Barrel for the LUNA design-system primitives                        */
/* ------------------------------------------------------------------ */

import Link from 'next/link';
import { Check, AlertCircle, Info, X, ShoppingBag } from 'lucide-react';
import { useToast } from '@/lib/store';
import { cn } from '@/lib/utils';
import { SmartImage } from './SmartImage';

export * from './primitives';
export * from './feedback';
export * from './overlays';
export * from './forms';
export { SmartImage, CircularImage } from './SmartImage';

/* ------------------------------ Toast viewport ------------------------------ */

const TOAST_STYLES = {
  success: { icon: Check, ring: 'ring-emerald-200', badge: 'bg-emerald-600 text-white' },
  error: { icon: AlertCircle, ring: 'ring-red-200', badge: 'bg-red-600 text-white' },
  info: { icon: Info, ring: 'ring-blue-200', badge: 'bg-blue-600 text-white' },
  cart: { icon: ShoppingBag, ring: 'ring-forest/20', badge: 'bg-forest text-white' },
} as const;

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.variant];
        const Icon = style.icon;
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-white p-3.5 shadow-card-hover ring-1 animate-toastIn',
              style.ring
            )}
          >
            {toast.image ? (
              <SmartImage
                src={toast.image}
                alt=""
                aspect="square"
                wrapperClassName="h-12 w-12 shrink-0 rounded-lg"
              />
            ) : (
              <span
                className={cn(
                  'grid h-8 w-8 shrink-0 place-items-center rounded-full',
                  style.badge
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-semibold leading-snug text-ink">{toast.title}</p>
              {toast.description && (
                <p className="line-clamp-2 text-xs leading-relaxed text-muted">{toast.description}</p>
              )}
              {toast.action && (
                <Link
                  href={toast.action.href}
                  onClick={() => dismiss(toast.id)}
                  className="mt-1 inline-block text-xs font-semibold text-forest underline underline-offset-2 hover:text-forest-600"
                >
                  {toast.action.label}
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="grid h-6 w-6 shrink-0 place-items-center rounded text-muted transition hover:bg-cream hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}