import type { ReactNode } from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';

const PERKS = [
  { icon: Truck, title: 'Free delivery', note: 'On every order over $99' },
  { icon: RotateCcw, title: '30-day returns', note: 'Send anything back, hassle-free' },
  { icon: ShieldCheck, title: 'Secure checkout', note: 'Your data never leaves LUNA' },
] as const;

/**
 * Split layout shared by every auth route: brand panel on the left,
 * form card on the right. Purely presentational (server-safe).
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-white shadow-card lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between gap-10 bg-forest p-8 text-cream lg:flex">
        <Link
          href="/"
          className="display text-2xl tracking-wide text-cream transition hover:text-white"
        >
          LUNA
        </Link>

        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cream/50">
            Marketplace
          </p>
          <h2 className="display max-w-xs text-3xl leading-tight">
            Everything you love, delivered beautifully.
          </h2>
          <ul className="mt-7 space-y-4">
            {PERKS.map((perk) => (
              <li key={perk.title} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream/10 text-cream">
                  <perk.icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-cream">{perk.title}</p>
                  <p className="text-[13px] leading-snug text-cream/60">{perk.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-xs text-cream/50">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Trusted by 40,000+ shoppers worldwide
        </div>
      </div>

      {/* Form card */}
      <div className="p-6 sm:p-10">
        <div className="mb-7 space-y-1.5">
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
              {eyebrow}
            </p>
          )}
          <h1 className="display text-[26px] leading-tight text-forest sm:text-[30px]">{title}</h1>
          {subtitle && <p className="text-sm leading-relaxed text-muted">{subtitle}</p>}
        </div>

        {children}

        {footer && (
          <div className="mt-7 border-t border-line pt-5 text-center text-sm text-muted sm:text-left">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
