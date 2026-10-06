'use client';

/* ------------------------------------------------------------------ */
/* Profile: edit name/phone, loyalty tier, referral code               */
/* ------------------------------------------------------------------ */

import { useMemo, useState } from 'react';
import { Copy, Gem, ShieldCheck } from 'lucide-react';
import { useAuth, useToast } from '@/lib/store';
import { STORAGE_KEYS, readStore } from '@/lib/store/storage';
import type { Order } from '@/lib/types';
import { formatMoney } from '@/lib/utils';
import { Badge, Button, Input, LinkButton } from '@/components/ui';

const TIERS = [
  { name: 'Bronze', min: 0, tone: 'gold' as const },
  { name: 'Silver', min: 250, tone: 'neutral' as const },
  { name: 'Gold', min: 750, tone: 'success' as const },
];

function lifetimeSpend(customerId: string): number {
  const orders = readStore<Order[]>(STORAGE_KEYS.orders, []);
  return orders
    .filter((o) => o.customerId === customerId || o.customerId === 'guest')
    .reduce((sum, o) => sum + o.total, 0);
}

export function ProfilePanel() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [editing, setEditing] = useState(false);

  const spend = useMemo(() => (user ? lifetimeSpend(user.id) : 0), [user]);
  const tier = [...TIERS].reverse().find((t) => spend >= t.min) ?? TIERS[0];
  const nextTier = TIERS.find((t) => t.min > spend);
  const progress = nextTier ? Math.min(100, Math.round((spend / nextTier.min) * 100)) : 100;

  const referralCode = useMemo(() => {
    const slug = (user?.name ?? '').replace(/[^A-Za-z]/g, '').slice(0, 5).toUpperCase();
    return `LUNA-${slug || 'FRIEND'}`;
  }, [user]);

  if (!user) return null;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error('Check your name', 'It looks too short.');
    updateProfile({ name: name.trim(), phone: phone.trim() || undefined });
    setEditing(false);
    toast.success('Profile updated', 'Your changes were saved.');
  };

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success('Copied', `Referral code ${referralCode} is on your clipboard.`);
    } catch {
      toast.error('Copy blocked', `Your code is ${referralCode}.`);
    }
  };

  return (
    <div className="space-y-5">
      {/* Identity */}
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="display text-lg text-forest">Your details</h2>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          )}
        </div>

        {editing ? (
          <form onSubmit={save} className="grid max-w-xl gap-4">
            <Input
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 000 1234"
            />
            <Input
              label="Email"
              value={user.email}
              disabled
              hint="Email changes are not supported yet."
            />
            <div className="flex gap-3">
              <Button type="submit">Save changes</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setName(user.name);
                  setPhone(user.phone ?? '');
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Name</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Email</dt>
              <dd className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-ink">
                {user.email}
                {user.verified && (
                  <ShieldCheck className="h-4 w-4 text-forest-400" aria-hidden />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">{user.phone || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                Member since
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                {new Date(user.joinedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* Loyalty */}
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="display flex items-center gap-2 text-lg text-forest">
            <Gem className="h-4 w-4 text-gold" aria-hidden />
            Loyalty
          </h2>
          <Badge tone={tier.tone}>{tier.name} tier</Badge>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-muted">Lifetime spend</span>
            <span className="font-bold text-ink">{formatMoney(spend)}</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-warm"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-forest transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[13px] text-muted">
            {nextTier
              ? `${formatMoney(nextTier.min - spend)} more to reach ${nextTier.name} tier and unlock extra perks.`
              : 'You reached the top tier — enjoy priority support and early access to drops.'}
          </p>
        </div>
      </section>
      {/* Referrals */}
      <section className="rounded-2xl border border-dashed border-line bg-cream/50 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="display text-lg text-forest">Give $10, get $10</h2>
            <p className="max-w-md text-[13px] leading-relaxed text-muted">
              Share your code with a friend — they get $10 off their first order and you earn $10
              in LUNA credit once it ships.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold tracking-wider text-forest">
              {referralCode}
            </code>
            <Button
              variant="secondary"
              size="sm"
              icon={<Copy className="h-4 w-4" aria-hidden />}
              onClick={copyReferral}
            >
              Copy
            </Button>
          </div>
        </div>
        {!user.verified && (
          <div className="mt-4 flex items-center gap-3 text-[13px] text-muted">
            <span>Verify your email to start earning referral credit.</span>
            <LinkButton href="/verify" variant="ghost" size="sm">
              Verify now
            </LinkButton>
          </div>
        )}
      </section>
    </div>
  );
}
