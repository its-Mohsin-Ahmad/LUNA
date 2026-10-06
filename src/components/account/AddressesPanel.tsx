'use client';

/* ------------------------------------------------------------------ */
/* Addresses: list, add and remove saved shipping addresses            */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useAuth, useToast } from '@/lib/store';
import type { Address } from '@/lib/types';
import { Button, EmptyState, Input } from '@/components/ui';

const EMPTY: Address = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  phone: '',
};

export function AddressesPanel() {
  const { user, addAddress, removeAddress } = useAuth();
  const toast = useToast();

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Address>(EMPTY);

  if (!user) return null;
  const addresses = user.addresses;

  const set = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.line1.trim().length < 3) return toast.error('Address incomplete', 'Street address is required.');
    if (form.city.trim().length < 2) return toast.error('Address incomplete', 'City is required.');
    addAddress({ ...form, fullName: form.fullName.trim() || user.name, line1: form.line1.trim(), city: form.city.trim() });
    setForm(EMPTY);
    setAdding(false);
    toast.success('Address saved', 'You can pick it at checkout.');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {addresses.length} saved address{addresses.length === 1 ? '' : 'es'}
        </p>
        {!adding && (
          <Button
            size="sm"
            icon={<Plus className="h-4 w-4" aria-hidden />}
            onClick={() => setAdding(true)}
          >
            Add address
          </Button>
        )}
      </div>

      {addresses.length === 0 && !adding && (
        <EmptyState
          icon={<MapPin className="h-6 w-6" />}
          title="No saved addresses"
          description="Save your shipping addresses once and breeze through checkout every time."
          action={{
            label: 'Add your first address',
            onClick: () => setAdding(true),
          }}
        />
      )}

      {addresses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address, index) => (
            <li
              key={`${address.line1}-${index}`}
              className="group relative rounded-2xl border border-line bg-white p-5"
            >
              <p className="text-sm font-bold text-ink">{address.fullName}</p>
              <address className="mt-1.5 space-y-0.5 text-[13px] leading-relaxed not-italic text-muted">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {address.city}, {address.state} {address.zip}
                </p>
                <p>{address.country}</p>
                <p className="text-xs">{address.phone}</p>
              </address>
              <button
                type="button"
                aria-label="Remove address"
                onClick={() => {
                  removeAddress(index);
                  toast.info('Address removed', 'It will no longer appear at checkout.');
                }}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted opacity-100 transition hover:bg-sale/10 hover:text-sale lg:opacity-0 lg:group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {adding && (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-line bg-warm/50 p-5 sm:p-6"
          aria-label="Add address"
        >
          <h2 className="display mb-4 text-lg text-forest">New address</h2>
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              value={form.fullName}
              onChange={set('fullName')}
              placeholder={user.name}
              className="sm:col-span-2"
              containerClassName="sm:col-span-2"
            />
            <Input
              label="Street address"
              value={form.line1}
              onChange={set('line1')}
              required
              containerClassName="sm:col-span-2"
            />
            <Input
              label="Apt / suite (optional)"
              value={form.line2 ?? ''}
              onChange={set('line2')}
              containerClassName="sm:col-span-2"
            />
            <Input label="City" value={form.city} onChange={set('city')} required />
            <Input label="State / region" value={form.state} onChange={set('state')} />
            <Input label="ZIP / postal code" value={form.zip} onChange={set('zip')} />
            <Input label="Country" value={form.country} onChange={set('country')} />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+1 555 000 1234"
            />
          </div>
          <div className="mt-5 flex gap-3">
            <Button type="submit">Save address</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(EMPTY);
                setAdding(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
