'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Wallet, Banknote, Truck, Check, ArrowLeft, MapPin } from 'lucide-react';
import type { Address, Order, OrderItem } from '@/lib/types';
import { useCart, useAuth, usePrefs, useToast } from '@/lib/store';
import { COMMERCE, PAYMENT_METHODS } from '@/lib/constants';
import { orderNumber, formatMoney } from '@/lib/utils';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button, EmptyState } from '@/components/ui';
import { Input, Select, RadioCard, Field } from '@/components/ui/forms';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'United Arab Emirates',
  'Pakistan', 'Germany', 'France', 'Japan', 'Australia',
].map((c) => ({ value: c, label: c }));

type Form = {
  email: string; fullName: string; line1: string; line2: string;
  city: string; state: string; zip: string; country: string; phone: string;
};

function formatCard(v: string): string {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={accent ? 'font-semibold tabular-nums text-forest' : 'tabular-nums text-ink'}>
        {value}
      </dd>
    </div>
  );
}

export function CheckoutFlow() {
  const router = useRouter();
  const { items, totals, clear, coupon, discount, removeCoupon } = useCart();
  const { user } = useAuth();
  const { currency } = usePrefs();
  const { error: toastError } = useToast();

  const saved = user?.addresses[0];
  const [form, setForm] = useState<Form>({
    email: user?.email ?? '',
    fullName: saved?.fullName ?? user?.name ?? '',
    line1: saved?.line1 ?? '',
    line2: saved?.line2 ?? '',
    city: saved?.city ?? '',
    state: saved?.state ?? '',
    zip: saved?.zip ?? '',
    country: saved?.country ?? 'United States',
    phone: saved?.phone ?? user?.phone ?? '',
  });
  const [payment, setPayment] = useState('CARD');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const shipping = useMemo(() => {
    if (totals.subtotal >= COMMERCE.freeShippingThreshold) return 0;
    return payment === 'COD' ? COMMERCE.standardShipping : COMMERCE.expressShipping;
  }, [totals.subtotal, payment]);

  const codFee = payment === 'COD' ? 4.5 : 0;
  const grandTotal = Math.max(0, totals.subtotal - discount + shipping + totals.tax + codFee);

  const set = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Truck className="h-6 w-6" />}
        title="Nothing to check out"
        description="Your bag is empty. Add a product and come back to complete your order."
        action={{ label: 'Browse the shop', href: '/shop' }}
      />
    );
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.fullName.trim().length < 2) next.fullName = 'Enter the recipient name';
    if (form.line1.trim().length < 4) next.line1 = 'Enter the street address';
    if (!form.city.trim()) next.city = 'Enter the city';
    if (!/^[a-z0-9-]{3,10}$/i.test(form.zip.trim())) next.zip = 'Enter a valid postcode';
    if (form.phone.replace(/\D/g, '').length < 7) next.phone = 'Enter a contactable number';
    if (payment === 'CARD') {
      if (card.number.replace(/\D/g, '').length < 12) next.cardNumber = 'Enter a valid card number';
      if (card.name.trim().length < 2) next.cardName = 'Enter the name on the card';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) next.cardExpiry = 'Use MM/YY';
      if (!/^\d{3,4}$/.test(card.cvc)) next.cardCvc = 'Enter the 3-digit code';
    }
    setErrors(next);
    if (Object.keys(next).length) toastError('Check the highlighted fields', 'A few details need your attention.');
    return Object.keys(next).length === 0;
  };
  /* __FORM__ */
const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 900));

    const address: Address = {
      fullName: form.fullName,
      line1: form.line1,
      line2: form.line2 || undefined,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      phone: form.phone,
    };

    const orderItems: OrderItem[] = items.map((i) => ({
      productId: i.product.id,
      name: i.product.name,
      image: i.product.images[0],
      price: i.product.price,
      qty: i.qty,
      variantLabel: i.variant ? `${i.variant.label}: ${i.variant.value}` : undefined,
    }));

    const order: Order = {
      id: `ord_${Date.now().toString(36)}`,
      number: orderNumber(),
      customerId: user?.id ?? 'guest',
      customerName: form.fullName,
      email: form.email,
      channel: 'WEB',
      items: orderItems,
      subtotal: totals.subtotal,
      discount,
      shipping,
      tax: totals.tax,
      total: grandTotal,
      couponCode: coupon ?? undefined,
      paymentMethod: payment as Order['paymentMethod'],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      address,
      timeline: [
        {
          status: 'PENDING',
          at: new Date().toISOString(),
          note: payment === 'COD' ? 'Order placed, pay on delivery' : 'Order placed, awaiting confirmation',
        },
      ],
    };

    const key = 'luna.orders.v1';
    const existing = window.localStorage.getItem(key);
    const parsed: Order[] = existing ? JSON.parse(existing) : [];
    window.localStorage.setItem(key, JSON.stringify([order, ...parsed]));

    clear();
    removeCoupon();
    setPlacing(false);
    router.push(`/order-confirmation?number=${encodeURIComponent(order.number)}`);
  };

  return (
    <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="display text-lg text-forest">1. Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Email address"
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              hint="Confirmation and tracking are sent here"
              containerClassName="sm:col-span-2"
            />
            <Input
              label="Phone number"
              required
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
              hint="Used only for delivery questions"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="display text-lg text-forest">2. Delivery address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Full name" required value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)} error={errors.fullName} />
            <Select label="Country" options={COUNTRIES} value={form.country}
              onChange={(e) => set('country', e.target.value)} />
            <Input label="Address line 1" required value={form.line1}
              onChange={(e) => set('line1', e.target.value)} error={errors.line1}
              containerClassName="sm:col-span-2" />
            <Input label="Address line 2 (optional)" value={form.line2}
              onChange={(e) => set('line2', e.target.value)} containerClassName="sm:col-span-2" />
            <Input label="City" required value={form.city}
              onChange={(e) => set('city', e.target.value)} error={errors.city} />
            <Input label="State or region" value={form.state}
              onChange={(e) => set('state', e.target.value)} />
            <Input label="Postcode" required value={form.zip}
              onChange={(e) => set('zip', e.target.value)} error={errors.zip} />
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs text-muted">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
            We ship to 180+ countries. Duties are calculated at checkout and shown on your receipt.
          </p>
        </section>
<section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="display text-lg text-forest">3. Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((method) => (
                <RadioCard
                  key={method.id}
                  checked={payment === method.id}
                  onSelect={() => setPayment(method.id)}
                  title={method.label}
                  description={
                    method.id === 'COD'
                      ? 'Pay the courier in cash. $4.50 handling fee applies.'
                      : method.id === 'CARD'
                        ? 'Visa, Mastercard and Amex accepted'
                        : method.id === 'WALLET'
                          ? 'Apple Pay, Google Pay and PayPal'
                          : 'Transfer within 48 hours to confirm'
                  }
                  icon={
                    method.id === 'CARD' ? <CreditCard className="h-4 w-4" />
                    : method.id === 'COD' ? <Banknote className="h-4 w-4" />
                    : method.id === 'WALLET' ? <Wallet className="h-4 w-4" />
                    : <MapPin className="h-4 w-4" />
                  }
                />
              ))}
            </div>

            {payment === 'CARD' && (
              <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                <Field
                  label="Card number"
                  error={errors.cardNumber}
                  required
                  containerClassName="sm:col-span-2"
                >
                  <input
                    inputMode="numeric"
                    value={card.number}
                    onChange={(e) => {
                      setCard((c) => ({ ...c, number: formatCard(e.target.value) }));
                      setErrors((x) => ({ ...x, cardNumber: '' }));
                    }}
                    placeholder="4242 4242 4242 4242"
                    className="h-11 w-full rounded-md border border-line px-3.5 text-sm tabular-nums focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
                  />
                </Field>
                <Input
                  label="Name on card"
                  required
                  value={card.name}
                  onChange={(e) => {
                    setCard((c) => ({ ...c, name: e.target.value }));
                    setErrors((x) => ({ ...x, cardName: '' }));
                  }}
                  error={errors.cardName}
                  containerClassName="sm:col-span-2"
                />
                <Input
                  label="Expiry"
                  placeholder="MM/YY"
                  required
                  value={card.expiry}
                  onChange={(e) => {
                    setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }));
                    setErrors((x) => ({ ...x, cardExpiry: '' }));
                  }}
                  error={errors.cardExpiry}
                />
                <Input
                  label="CVC"
                  inputMode="numeric"
                  placeholder="123"
                  required
                  value={card.cvc}
                  onChange={(e) => {
                    setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }));
                    setErrors((x) => ({ ...x, cardCvc: '' }));
                  }}
                  error={errors.cardCvc}
                />
              </div>
            )}
          </section>
      </div>
      <aside className="lg:sticky lg:top-[152px] lg:self-start">
        <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
          <h2 className="display text-lg text-forest">4. Review &amp; pay</h2>

          <ul className="thin-scrollbar max-h-60 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <li key={`${item.product.id}-${item.variant?.id ?? 'd'}`} className="flex gap-3">
                <SmartImage
                  src={item.product.images[0]}
                  alt={item.product.name}
                  seed={item.product.sku}
                  aspect="square"
                  wrapperClassName="h-14 w-14 shrink-0 rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="clamp-2 text-[13px] font-medium leading-snug text-ink">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-muted">Qty {item.qty}</p>
                </div>
                <p className="text-[13px] font-semibold tabular-nums text-ink">
                  {(item.product.price * item.qty).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 border-t border-line pt-4 text-sm">
            <Line label="Subtotal" value={totals.subtotal.toFixed(2)} />
            {discount > 0 && (
              <Line label="Promo discount" value={`-${discount.toFixed(2)}`} accent />
            )}
            <Line label="Delivery" value={shipping === 0 ? 'Free' : shipping.toFixed(2)} />
            {codFee > 0 && <Line label="Cash handling" value={codFee.toFixed(2)} />}
            <Line label="Tax" value={totals.tax.toFixed(2)} />
            <div className="flex items-center justify-between border-t border-line pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatMoney(grandTotal, currency)}</dd>
            </div>
          </dl>

          <Button type="submit" size="lg" fullWidth loading={placing}>
            {placing ? 'Placing order”¦' : 'Place order'}
          </Button>

          <Link
            href="/cart"
            className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-forest hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to bag
          </Link>

          <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
            By placing this order you accept the LUNA terms of sale and privacy policy.
          </p>
        </div>
      </aside>
    </form>
  );
}
