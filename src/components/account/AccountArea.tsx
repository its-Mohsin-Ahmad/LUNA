'use client';

/* ------------------------------------------------------------------ */
/* Account area: auth guard + section navigation + panel router        */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings2,
  User as UserIcon,
} from 'lucide-react';
import { useAuth, useToast } from '@/lib/store';
import { Badge } from '@/components/ui';
import { Skeleton } from '@/components/ui/feedback';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';
import { ProfilePanel } from './ProfilePanel';
import { OrdersPanel } from './OrdersPanel';
import { WishlistPanel } from './WishlistPanel';
import { AddressesPanel } from './AddressesPanel';
import { ActivityPanel } from './ActivityPanel';
import { SettingsPanel } from './SettingsPanel';

type TabKey = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'activity' | 'settings';

const TABS: { key: TabKey; label: string; icon: typeof UserIcon }[] = [
  { key: 'profile', label: 'Profile', icon: UserIcon },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'activity', label: 'Activity & alerts', icon: Bell },
  { key: 'settings', label: 'Settings', icon: Settings2 },
];

export function AccountArea({ initialTab = 'profile' }: { initialTab?: TabKey } = {}) {
  const router = useRouter();
  const { user, status, signOut } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<TabKey>(initialTab);

  // Guests get bounced to the login screen.
  useEffect(() => {
    if (status === 'guest') router.replace('/login');
  }, [status, router]);

  if (!user) {
    return (
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]" aria-busy="true">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    toast.info('Signed out', 'See you next time.');
    router.push('/');
  };

  const active = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-line bg-white p-5">
          <div className="flex items-center gap-3.5">
            <span className="grid h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cream">
              <SmartImage
                src={user.avatar}
                alt={user.name}
                aspect="square"
                wrapperClassName="h-full w-full"
              />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge tone="forest">{user.role === 'CUSTOMER' ? 'Member' : user.role}</Badge>
            <Badge tone={user.verified ? 'success' : 'warning'}>
              {user.verified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>

        <nav
          aria-label="Account sections"
          className="flex gap-1.5 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 lg:flex-col lg:overflow-visible"
        >
          {TABS.map((item) => {
            const selected = item.key === tab;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold transition lg:w-full',
                  selected
                    ? 'bg-forest text-cream'
                    : 'text-muted hover:bg-cream hover:text-ink'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-sale transition hover:bg-sale/10 lg:mt-auto lg:w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            <span className="whitespace-nowrap">Sign out</span>
          </button>
        </nav>
      </aside>

      {/* Panel */}
      <section className="min-w-0 space-y-5" aria-live="polite">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream text-forest">
            <active.icon className="h-4 w-4" aria-hidden />
          </span>
          <h1 className="display text-2xl text-forest">{active.label}</h1>
        </div>

        {tab === 'profile' && <ProfilePanel />}
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'wishlist' && <WishlistPanel />}
        {tab === 'addresses' && <AddressesPanel />}
        {tab === 'activity' && <ActivityPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </section>
    </div>
  );
}
