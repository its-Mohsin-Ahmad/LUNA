'use client';

/* ------------------------------------------------------------------ */
/* Contact form — client-validated demo enquiry                        */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useToast } from '@/lib/store';
import { Button, Input, Select, Textarea } from '@/components/ui';

const TOPICS = [
  { value: 'orders', label: 'Orders & delivery' },
  { value: 'returns', label: 'Returns & refunds' },
  { value: 'product', label: 'Product question' },
  { value: 'account', label: 'Account help' },
  { value: 'seller', label: 'Selling on LUNA' },
  { value: 'other', label: 'Something else' },
];

export function ContactForm() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', topic: 'orders', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.message.trim().length < 10) next.message = 'Add a little more detail (10+ characters)';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    await new Promise((r) => setTimeout(r, 600)); // simulated round trip
    setBusy(false);
    toast.success(
      'Message sent',
      'Thanks — our team replies within 3 hours during opening times.'
    );
    setForm({ name: '', email: '', topic: 'orders', message: '' });
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Your name"
          required
          value={form.name}
          onChange={(e) => set('name')(e.target.value)}
          error={errors.name}
          placeholder="Isabella Fontaine"
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => set('email')(e.target.value)}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <Select
        label="What is it about?"
        value={form.topic}
        onChange={(e) => set('topic')(e.target.value)}
        options={TOPICS}
      />

      <Textarea
        label="Message"
        required
        value={form.message}
        onChange={(e) => set('message')(e.target.value)}
        error={errors.message}
        placeholder="Order number (if you have one), then how we can help…"
        rows={5}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          Demo form — nothing leaves your browser.
        </p>
        <Button type="submit" variant="primary" disabled={busy} icon={<Send className="h-4 w-4" />}>
          {busy ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}