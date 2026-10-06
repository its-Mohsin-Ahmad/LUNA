'use client';

/* ------------------------------------------------------------------ */
/* Forgot password: issues a (demo) reset link with a generated token  */
/* ------------------------------------------------------------------ */

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MailCheck } from 'lucide-react';
import { useAuth, useToast } from '@/lib/store';
import { Input, Button } from '@/components/ui';

function demoToken(): string {
  return `rst_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ email: string; token: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address');
    setBusy(true);
    setError(null);
    const res = await requestPasswordReset(email);
    setBusy(false);
    if (res.ok) {
      toast.success('Check your inbox', res.message);
      setSent({ email: email.trim().toLowerCase(), token: demoToken() });
    } else {
      setError(res.message);
    }
  };

  if (sent) {
    const href = `/reset-password?email=${encodeURIComponent(sent.email)}&token=${sent.token}`;
    return (
      <div className="space-y-5" aria-live="polite">
        <div className="flex items-start gap-3 rounded-xl border border-forest/25 bg-cream/70 p-4">
          <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-forest">Reset link created</p>
            <p className="text-[13px] leading-relaxed text-muted">
              In this demo there is no real email — open the link below to choose a new password.
            </p>
          </div>
        </div>

        <Button
          fullWidth
          onClick={() => window.location.assign(href)}
          icon={<ArrowRight className="h-4 w-4" aria-hidden />}
        >
          Open reset link
        </Button>

        <p className="text-center text-[13px] text-muted">
          Wrong address?{' '}
          <button
            type="button"
            onClick={() => setSent(null)}
            className="font-semibold text-forest underline-offset-4 hover:underline"
          >
            Try another email
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error ?? undefined}
        hint="We will send a secure link to reset your password."
      />

      <Button type="submit" loading={busy} fullWidth>
        Send reset link
      </Button>

      <p className="text-center text-[13px] text-muted">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-forest underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
