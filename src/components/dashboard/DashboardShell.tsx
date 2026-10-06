'use client';

/* ------------------------------------------------------------------ */
/* Dashboard chrome: role guard, sidebar navigation, top bar           */
/* ------------------------------------------------------------------ */

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut, Store } from 'lucide-react';
import type { Role } from '@/lib/types';
import { useAuth, useToast } from '@/lib/store';
import { LogoStack } from '@/components/brand/Logo';
import { Skeleton } from '@/components/ui/feedback';
import { cn } from '@/lib/utils';
import type { DashTab } from './dashPrimitives';

const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: 'Customer',
  VENDOR: 'Vendor',
  SALESMAN: 'Salesman',
  ADMIN: 'Administrator',
};

export function DashboardShell({
  role,
  tabs,
  active,
  onSelect,
  children,
}: {
  role: Role;
  tabs: DashTab[];
  active: string;
  onSelect: (key: string) => void;
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, status, signOut } = useAuth();
  const toast = useToast();

  const wrongRole = user !== null && user.role !== role;

  useEffect(() => {
    if (status === 'guest') router.replace('/login');
    else if (status === 'authenticated' && wrongRole)
      router.replace(`/dashboard/${user!.role.toLowerCase()}`);
  }, [status, wrongRole, user, router]);

  const handleSignOut = () => {
    signOut();
    toast.info('Signed out', 'See you next time.');
    router.push('/');
  };

  if (status !== 'authenticated' || wrongRole || !user) {
    return (
      <div
        className="mx-auto grid min-h-screen max-w-[1400px] gap-6 bg-warm p-6 lg:grid-cols-[240px_minmax(0,1fr)]"
        aria-busy="true"
      >
        <Skeleton className="min-h-screen rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="sticky top-0 z-40 flex shrink-0 flex-col bg-forest text-cream lg:min-h-screen lg:w-[248px]">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <Link href="/" aria-label="Back to LUNA storefront">
              <LogoStack className="h-7" />
            </Link>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
              {ROLE_LABEL[role]}
            </span>
          </div>

          <div className="mx-4 hidden items-center gap-3 rounded-xl bg-white/10 px-3.5 py-3 lg:flex">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-xs font-bold text-forest">
              {user.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold">{user.name}</span>
              <span className="block truncate text-[11px] text-cream/60">{user.email}</span>
            </span>
          </div>

          <nav
            aria-label="Dashboard sections"
            className="thin-scrollbar mt-3 flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-5 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {tabs.map((t) => {
              const selected = t.key === active;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => onSelect(t.key)}
                  aria-current={selected ? 'page' : undefined}
                  className={cn(
                    'flex shrink-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13.5px] font-semibold transition lg:w-full',
                    selected
                      ? 'bg-cream text-forest'
                      : 'text-cream/75 hover:bg-white/10 hover:text-cream'
                  )}
                >
                  <t.icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto hidden flex-col gap-1 border-t border-white/10 p-3 lg:flex">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13px] font-semibold text-cream/75 transition hover:bg-white/10 hover:text-cream"
            >
              <Store className="h-4 w-4" aria-hidden />
              Back to storefront
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-[13px] font-semibold text-cream/75 transition hover:bg-white/10 hover:text-cream"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main column */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-[57px] z-30 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white/90 px-5 py-3.5 backdrop-blur lg:top-0">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-forest-400">
                {ROLE_LABEL[role]} dashboard
              </p>
              <h1 className="display text-lg text-forest sm:text-xl">{current.label}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-[13px] font-semibold text-ink transition hover:border-forest hover:bg-cream"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                My account
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-[13px] font-semibold text-sale transition hover:bg-sale/10"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Sign out
              </button>
            </div>
          </header>

          <main id="main" className="p-5 sm:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}