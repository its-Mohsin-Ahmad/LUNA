'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/lib/store';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/primitives';

export function ProductGallery({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);
  const { info } = useToast();

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
      <ul className="order-2 flex gap-3 sm:order-1 sm:flex-col">
        {product.images.map((image, i) => (
          <li key={image}>
            <button
              type="button"
              onClick={() => setActiveImage(i)}
              aria-label={`View image ${i + 1} of ${product.images.length}`}
              aria-current={i === activeImage}
              className={cn(
                'overflow-hidden rounded-lg border-2 transition',
                i === activeImage ? 'border-forest' : 'border-transparent hover:border-line'
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
        <div className="relative overflow-hidden rounded-2xl border border-line bg-white">
          <SmartImage
            src={product.images[activeImage]}
            alt={`${product.name} — view ${activeImage + 1}`}
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
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-forest shadow-soft transition hover:bg-cream"
          >
            {shareCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}