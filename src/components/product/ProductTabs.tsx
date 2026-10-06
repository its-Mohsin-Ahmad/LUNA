'use client';

import { useState } from 'react';
import { Check, ThumbsUp, BadgeCheck } from 'lucide-react';
import type { Product, Review } from '@/lib/types';
import { COMMERCE } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { getReviews } from '@/lib/data/products/brands';
import { Tabs } from '@/components/ui/feedback';
import { Rating } from '@/components/ui/primitives';
import { SmartImage } from '@/components/ui/SmartImage';

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState('description');

  return (
    <div className="rounded-2xl border border-line bg-white">
      <Tabs
        tabs={[
          { id: 'description', label: 'Description' },
          { id: 'specs', label: 'Specifications', count: product.specs.length },
          { id: 'reviews', label: 'Reviews', count: product.reviewCount },
          { id: 'delivery', label: 'Delivery & returns' },
        ]}
        active={tab}
        onChange={setTab}
        className="px-2"
        ariaLabel={`Information about ${product.name}`}
      />
      <div className="p-5 sm:p-6">
        {tab === 'description' && (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-ink">{product.description}</p>
            <ul className="space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'specs' && (
          <dl className="divide-y divide-line">
            {product.specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-3 gap-3 py-2.5 text-sm">
                <dt className="col-span-1 font-semibold text-ink">{spec.label}</dt>
                <dd className="col-span-2 text-muted">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {tab === 'reviews' && <ReviewsPanel product={product} />}

        {tab === 'delivery' && (
          <div className="space-y-4 text-sm leading-relaxed text-muted">
            <p>
              Standard delivery arrives in {product.deliveryDays}–
              {product.deliveryDays + 3} business days and is free on orders over $
              {COMMERCE.freeShippingThreshold}. Express options are offered at checkout.
            </p>
            <p>
              This item can be returned free within {product.returnDays} days of delivery,
              provided it is unused and in its original packaging.
            </p>
            <p>
              Covered by a {product.warrantyMonths ?? 12}-month manufacturer warranty. Defective
              items are collected from your door at no cost.
            </p>
          </div>
        )}
      </div>
    </div>
  );
/* ------------------------------- Reviews ------------------------------- */

/** Ratings breakdown derived from the product's review count. */
function ratingBreakdown(product: Product) {
  const weights = [0.62, 0.24, 0.08, 0.04, 0.02];
  return {
    average: product.rating,
    total: product.reviewCount,
    buckets: weights.map((w, i) => Math.round(w * product.reviewCount * (i === 0 ? 1.02 : 0.97))),
  };
}

function ReviewsPanel({ product }: { product: Product }) {
  const reviews = getReviews(product.id, 6);
  const summary = ratingBreakdown(product);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="space-y-3 rounded-xl bg-warm p-4 text-center">
        <p className="text-4xl font-bold tabular-nums text-forest">
          {summary.average.toFixed(1)}
        </p>
        <Rating value={summary.average} showValue={false} className="justify-center" />
        <p className="text-xs text-muted">{summary.total.toLocaleString()} reviews</p>
        <ul className="space-y-1.5 pt-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.buckets[star - 1] ?? 0;
            const pct = summary.total ? (count / summary.total) * 100 : 0;
            return (
              <li key={star} className="flex items-center gap-2 text-[11px] text-muted">
                <span className="w-6 text-right tabular-nums">{star}★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full rounded-full bg-gold"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-9 text-right tabular-nums">{count}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="space-y-4">
        {reviews.map((review: Review) => (
          <li key={review.id} className="border-b border-line pb-4 last:border-0">
            <div className="flex items-start gap-3">
              <SmartImage
                src={review.avatar}
                alt={review.author}
                seed={review.id}
                aspect="square"
                wrapperClassName="h-9 w-9 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[13.5px] font-semibold text-ink">{review.author}</p>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold text-forest">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                  <span className="text-[11px] text-muted">{formatDate(review.date)}</span>
                </div>
                <Rating value={review.rating} size="xs" showValue={false} className="mt-1" />
                <p className="mt-1.5 text-sm font-semibold text-ink">{review.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{review.body}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-muted">
                  <ThumbsUp className="h-3 w-3" />
                  {review.helpful} people found this helpful
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
}