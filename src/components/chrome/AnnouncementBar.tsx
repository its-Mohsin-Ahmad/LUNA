'use client';

/* ------------------------------------------------------------------ */
/* Announcement bar — rotating messages, dismissible                  */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Leaf, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMMERCE } from '@/lib/constants';

const MESSAGES = [
  { icon: Truck, text: `Free express delivery on orders over $${COMMERCE.freeShippingThreshold}`, href: '/shop' },
  { icon: ShieldCheck, text: '30-day free returns on every order', href: '/help' },
  { icon: Leaf, text: 'Plastic-free packaging as standard', href: '/about' },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  if (closed) return null;
  const msg = MESSAGES[index];
  const Icon = msg.icon;

  return (
    <div className="relative bg-forest text-cream">
      <div className="shell flex h-10 items-center justify-center gap-3 px-10 text-[12.5px]">
        <Icon className="h-3.5 w-3.5 shrink-0 text-forest-300" aria-hidden />
        <p className="truncate font-medium tracking-wide" aria-live="polite">
          <Link href={msg.href} className="transition hover:text-white">
            {msg.text}
          </Link>
        </p>
        {/* Dot indicators double as manual controls */}
        <span className="hidden items-center gap-1 sm:flex">
          {MESSAGES.map((m, i) => (
            <button
              key={m.text}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show announcement ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-4 bg-cream' : 'w-1.5 bg-cream/40 hover:bg-cream/70'
              )}
            />
          ))}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label="Dismiss announcements"
        className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-cream/70 transition hover:bg-white/10 hover:text-cream sm:right-5"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}