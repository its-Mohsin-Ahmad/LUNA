import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Providers } from '@/lib/store';
import { ToastViewport } from '@/components/ui';
import { DashboardArea } from '@/components/dashboard/DashboardArea';
import type { Role } from '@/lib/types';

type Params = { params: Promise<{ role: string }> };

const ROLE_MAP: Record<string, Role> = {
  customer: 'CUSTOMER',
  vendor: 'VENDOR',
  salesman: 'SALESMAN',
  admin: 'ADMIN',
};

const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: 'Customer',
  VENDOR: 'Vendor',
  SALESMAN: 'Salesman',
  ADMIN: 'Administrator',
};

export function generateStaticParams() {
  return Object.keys(ROLE_MAP).map((role) => ({ role }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { role } = await params;
  const mapped = ROLE_MAP[role];
  if (!mapped) return { title: 'Dashboard not found' };
  return {
    title: `${ROLE_LABEL[mapped]} dashboard`,
    description: `The LUNA ${ROLE_LABEL[mapped].toLowerCase()} workspace — overview, orders, catalogue and tools for your role.`,
    alternates: { canonical: `/dashboard/${role}` },
    robots: { index: false, follow: true },
  };
}

export default async function DashboardRolePage({ params }: Params) {
  const { role } = await params;
  const mapped = ROLE_MAP[role];
  if (!mapped) notFound();

  // The root layout ships no providers and the dashboard runs outside the
  // Storefront chrome, so the page itself provides stores + toast viewport.
  return (
    <Providers>
      <DashboardArea role={mapped} />
      <ToastViewport />
    </Providers>
  );
}