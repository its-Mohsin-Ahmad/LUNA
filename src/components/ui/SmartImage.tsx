'use client';

/* ------------------------------------------------------------------ */
/* SmartImage — resilient image rendering                              */
/*                                                                     */
/* Every remote image in LUNA renders through this component. It falls */
/* back through: remote URL -> picsum seed -> inline SVG gradient, so  */
/* a broken or blocked remote asset can never show a broken image icon. */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useState } from 'react';
import { cn, seededRandom } from '@/lib/utils';

export interface SmartImageProps {
  src: string;
  alt: string;
  seed?: string;
  className?: string;
  wrapperClassName?: string;
  /** Eager-load above-the-fold imagery. */
  priority?: boolean;
  sizes?: string;
  aspect?: 'square' | '4/5' | '3/4' | '4/3' | '16/9' | 'auto';
  rounded?: string;
}

const ASPECT: Record<NonNullable<SmartImageProps['aspect']>, string> = {
  square: 'aspect-square',
  '4/5': 'aspect-[4/5]',
  '3/4': 'aspect-[3/4]',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  auto: '',
};

/** Deterministic pleasant gradient for the final fallback. */
function placeholderSvg(seed: string, label: string): string {
  const rand = seededRandom(seed);
  const hue = Math.floor(rand() * 360);
  const h2 = (hue + 40) % 360;
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(${hue},26%,88%)"/><stop offset="100%" stop-color="hsl(${h2},30%,72%)"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="250" r="86" fill="rgba(255,255,255,0.42)"/><text x="300" y="272" font-family="Georgia,serif" font-size="52" font-weight="700" fill="rgba(0,61,50,0.72)" text-anchor="middle">${initials}</text><text x="300" y="420" font-family="Helvetica,Arial,sans-serif" font-size="26" fill="rgba(23,35,31,0.58)" text-anchor="middle">LUNA</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function SmartImage({
  src,
  alt,
  seed,
  className,
  wrapperClassName,
  priority = false,
  aspect = 'square',
  rounded = '',
}: SmartImageProps) {
  const key = seed ?? alt ?? src;
  const [stage, setStage] = useState(0);

  // A new src should restart the fallback chain.
  useEffect(() => {
    setStage(0);
  }, [src]);

  const resolved = useMemo(() => {
    if (stage === 0) return src;
    if (stage === 1) return `https://picsum.photos/seed/${encodeURIComponent(key)}/700/700`;
    return placeholderSvg(key, alt);
  }, [stage, src, key, alt]);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-cream',
        ASPECT[aspect],
        rounded,
        wrapperClassName
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolved}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        onError={() => setStage((s) => Math.min(s + 1, 2))}
        className={cn('h-full w-full object-cover', className)}
      />
      {stage === 2 && (
        <span className="sr-only" role="img" aria-label={alt}>
          {alt}
        </span>
      )}
    </div>
  );
}

/** Circular variant used by the category rail. */
export function CircularImage({
  src,
  alt,
  seed,
  className,
}: {
  src: string;
  alt: string;
  seed?: string;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-full bg-cream', className)}>
      <SmartImage src={src} alt={alt} seed={seed} aspect="square" />
    </div>
  );
}