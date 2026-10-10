'use client';

import { useRef, useState } from 'react';
import { Share2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/lib/store';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/primitives';

export function ProductGallery({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const dragStart = useRef<number | null>(null);
  const { info } = useToast();

  const total = product.images.length;
  const go = (next: number) => setActiveImage(((next % total) + total) % total);

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      info('Share unavailable', 'Copy the page address from your browser instead.');
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-[80px_minmax(0,1fr)]">
      <ul className="order-2 flex gap-2.5 sm:order-1 sm:flex-col sm:gap-3">
        {product.images.map((image, i) => (
          <li key={image}>
            <button
              type="button"
              onClick={() => setActiveImage(i)}
              aria-label={`View image ${i + 1} of ${product.images.length}`}
              aria-current={i === activeImage}
              className={cn(
                'overflow-hidden rounded-lg border-2 transition',
                i === activeImage ? 'border-forest' : 'border-transparent'
              )}
            >
              <SmartImage
                src={image}
                alt={`${product.name} thumbnail ${i + 1}`}
                seed={`${product.sku}-thumb-${i}`}
                aspect="square"
                wrapperClassName="h-16 w-16 sm:h-[72px] sm:w-[72px]"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="order-1 sm:order-2">
        {/* Swipeable main image; dots on phones, arrows from `sm` up. */}
        <div
          className="relative touch-pan-y overflow-hidden rounded-2xl border border-line bg-white"
          onPointerDown={(e) => {
            dragStart.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (dragStart.current === null) return;
            const delta = e.clientX - dragStart.current;
            dragStart.current = null;
            if (Math.abs(delta) > 45) go(activeImage + (delta < 0 ? 1 : -1));
          }}
        >
          <SmartImage
            src={product.images[activeImage]}
            alt={`${product.name} - view ${activeImage + 1}`}
            seed={`${product.sku}-main`}
            aspect="4/3"
            priority
            wrapperClassName="overflow-hidden"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.discountPct && <Badge tone="sale">Save {product.discountPct}%</Badge>}
            {product.tags.includes('exclusive') && <Badge tone="gold">Exclusive</Badge>}
            {product.tags.includes('eco') && <Badge tone="sage">Eco choice</Badge>}
          </div>
          <button
            type="button"
            onClick={share}
            aria-label="Share this product"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-forest shadow-soft transition active:scale-95"
          >
            {shareCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(activeImage - 1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest shadow-soft transition hover:bg-white sm:grid"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(activeImage + 1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest shadow-soft transition hover:bg-white sm:grid"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1 sm:hidden">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Go to image ${i + 1}`}
                    aria-current={i === activeImage}
                    className="grid h-8 w-5 place-items-center"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'block h-1.5 rounded-full transition-all duration-300',
                        i === activeImage ? 'w-5 bg-forest' : 'w-1.5 bg-forest/30'
                      )}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}