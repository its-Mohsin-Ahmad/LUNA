import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Your LUNA workspace — orders, listings, catalogue, team and platform insights in one place.',
  alternates: { canonical: '/dashboard' },
  robots: { index: false, follow: true },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}