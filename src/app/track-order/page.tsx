import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Undo2 } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { TrackOrderForm } from '@/components/content/TrackOrderForm';

export const metadata: Metadata = {
  title: 'Track your order',
  description:
    'Enter your LUNA order number and checkout email to see live courier updates, the full status timeline and delivery ETA.',
  alternates: { canonical: '/track-order' },
};

const PROMISES = [
  { icon: Truck, title: 'Tracked end to end', copy: 'Every parcel gets a live courier feed within an hour of dispatch.' },
  { icon: Undo2, title: '30-day free returns', copy: 'Changed your mind? Start a return from the order page, no questions.' },
  { icon: ShieldCheck, title: 'Buyer protection', copy: 'Refunds land within two business days of the return arriving.' },
];

export default function TrackOrderPage() {
  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Track order' }]} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-6">
            <header className="max-w-xl space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
                Where is my parcel?
              </p>
              <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
                Track your order
              </h1>
              <p className="text-sm leading-relaxed text-muted">
                Enter the order number from your confirmation email together with the address you
                checked out with. In this demo, orders are stored locally in your browser.
              </p>
            </header>

            <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
              <TrackOrderForm />
            </div>

            <p className="text-[13px] text-muted">
              Lost the number? It also lives in{' '}
              <Link href="/account/orders" className="font-semibold text-forest hover:underline">
                your orders
              </Link>{' '}
              — or{' '}
              <Link href="/contact" className="font-semibold text-forest hover:underline">
                contact support
              </Link>{' '}
              and we will find it.
            </p>
          </section>

          <aside className="space-y-4">
            {PROMISES.map((p) => (
              <div key={p.title} className="flex gap-3.5 rounded-2xl border border-line bg-white p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-forest">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <strong className="block text-sm text-ink">{p.title}</strong>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{p.copy}</span>
                </span>
              </div>
            ))}
            <Link
              href="/help#shipping"
              className="flex items-center justify-between rounded-2xl border border-forest/30 bg-cream p-5 text-sm font-bold text-forest transition hover:bg-forest hover:text-cream"
            >
              Delivery times explained
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </div>
    </Storefront>
  );
}