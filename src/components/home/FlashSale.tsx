'use client';

/* ------------------------------------------------------------------ */
/* Flash sale band with a live countdown                               */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { COMMERCE } from '@/lib/constants';
import { formatMoney } from '@/lib/utils';
import { usePrefs, useCart, useToast } from '@/lib/store';
import { SmartImage } from '@/components/ui/SmartImage';
import { Rating } from '@/components/ui/primitives';

/** Countdown that always resolves to a future deadline, then rolls over. */
function useCountdown(hours: number) {
  const [remaining, setRemaining] = useState(() => hours * 3600 * 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? hours * 3600 * 1000 : prev - 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [hours]);

  const total = Math.max(0, Math.floor(remaining / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function FlashSale({ products }: { products: Product[] }) {
  const { hours, minutes, seconds } = useCountdown(COMMERCE.flashSaleHours);
  const { currency } = usePrefs();
  const { add } = useCart();
  const { success } = useToast();

  const units = useMemo(
    () => [
      { label: 'Hours', value: hours },
      { label: 'Mins', value: minutes },
      { label: 'Secs', value: seconds },
    ],
    [hours, minutes, seconds]
  );

  return (
    <section className="shell py-10 sm:py-14" aria-labelledby="flash-sale-heading">
      <div className="overflow-hidden rounded-2xl bg-forest text-cream">
        <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sale text-white">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h2 id="flash-sale-heading" className="display text-xl sm:text-2xl">
                Flash sale
              </h2>
              <p className="text-xs text-cream/70">Up to 60% off — while stock lasts</p>
            </div>
          </div>

          <div className="flex items-center gap-2" role="timer" aria-label="Time remaining">
            {units.map((u) => (
              <div
                key={u.label}
                className="min-w-[58px] rounded-lg bg-white/10 px-3 py-2 text-center"
              >
                <span className="block text-lg font-bold tabular-nums leading-none">
                  {String(u.value).padStart(2, '0')}
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-wider text-cream/60">
                  {u.label}
                </span>
              </div>
            ))}
            <Link
              href="/shop/deals"
              className="ml-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-cream px-4 py-2.5 text-[13px] font-bold text-forest transition hover:bg-white"
            >
              Shop all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 py-5 sm:gap-5 sm:px-7">
          {products.map((product) => (
            <li key={product.id} className="w-[190px] shrink-0 snap-start sm:w-[212px]">
              <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white/95">
                <Link href={`/product/${product.slug}`} className="relative block">
                  <SmartImage
                    src={product.images[0]}
                    alt={product.name}
                    seed={product.sku}
                    aspect="square"
                  />
                  {product.discountPct && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-sale px-2 py-0.5 text-[11px] font-bold text-white">
                      −{product.discountPct}%
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    {product.brand}
                  </p>
                  <Link
                    href={`/product/${product.slug}`}
                    className="clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-forest"
                  >
                    {product.name}
                  </Link>
                  <Rating value={product.rating} size="xs" showValue={false} />
                  <div className="mt-auto flex items-end justify-between gap-2 pt-1.5">
                    <span className="text-[15px] font-bold tabular-nums text-forest">
                      {formatMoney(product.price, currency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        add(product.id, 1);
                        success('Added to your bag', product.name);
                      }}
                      className="rounded-md bg-forest px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-forest-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}