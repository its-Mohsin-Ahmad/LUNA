'use client';

/* ------------------------------------------------------------------ */
/* /dashboard index: bounce the signed-in user to their role workspace  */
/* ------------------------------------------------------------------ */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Providers, useAuth } from '@/lib/store';
import { Skeleton } from '@/components/ui/feedback';

function DashboardRedirect() {
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === 'guest') router.replace('/login');
    else if (status === 'authenticated' && user)
      router.replace(`/dashboard/${user.role.toLowerCase()}`);
  }, [status, user, router]);

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

export default function DashboardIndexPage() {
  return (
    <Providers>
      <DashboardRedirect />
    </Providers>
  );
}