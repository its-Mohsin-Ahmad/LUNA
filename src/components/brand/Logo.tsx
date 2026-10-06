import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* LUNA brand mark — crescent moon rising over a leaf.                 */
/* Rendered as inline SVG so it stays crisp at every size.             */
/* ------------------------------------------------------------------ */

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="LUNA logo"
      className={cn('h-9 w-9', className)}
    >
      <circle cx="20" cy="20" r="19" fill="currentColor" />
      {/* crescent moon cut-out */}
      <path
        d="M25.6 12.2a9.6 9.6 0 1 0 2.2 12.4A8 8 0 0 1 25.6 12.2Z"
        fill="#FAF9F4"
      />
      {/* leaf */}
      <path
        d="M14.4 28.2c3.6-1.1 6.2-3.4 7.4-6.6-3.3-.5-6.2.9-7.4 6.6Z"
        fill="#9EC8BC"
      />
      <path d="M14.6 28.1c2-1.6 3.9-3.3 6.4-5.6" stroke="#FAF9F4" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  tone = 'dark',
  showTagline = false,
  href = '/',
}: {
  className?: string;
  tone?: 'dark' | 'light';
  showTagline?: boolean;
  href?: string;
}) {
  const isLight = tone === 'light';
  return (
    <Link
      href={href}
      aria-label="LUNA — Shop Better. Live Better. Discover More. Go to homepage"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <LogoMark className={cn('shrink-0 transition-transform group-hover:scale-105', isLight ? 'text-cream' : 'text-forest')} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[22px] font-bold tracking-[0.24em]',
            isLight ? 'text-cream' : 'text-forest'
          )}
        >
          LUNA
        </span>
        {showTagline && (
          <span
            className={cn(
              'mt-1 text-[9px] font-medium uppercase tracking-[0.18em]',
              isLight ? 'text-cream/60' : 'text-muted'
            )}
          >
            Shop Better. Live Better.
          </span>
        )}
      </span>
    </Link>
  );
}

/** Compact wordmark used inside the dark footer and dashboards. */
export function LogoStack({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <Logo tone="light" />
      <p className="max-w-xs text-sm leading-relaxed text-cream/60">
        Curated quality, honest pricing and delivery to more than 180 countries — since 2014.
      </p>
    </div>
  );
}