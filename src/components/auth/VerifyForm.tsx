'use client';

/* ------------------------------------------------------------------ */
/* Email verification: 6-digit code sent after signup                  */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useToast } from '@/lib/store';
import { Input, Button } from '@/components/ui';

export function VerifyForm() {
  const router = useRouter();
  const { verifyOtp } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Prefill the email from the signup redirect (?email=...).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get('email');
    if (prefill) setEmail(prefill);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await verifyOtp(email, code);
    setBusy(false);
    if (res.ok) {
      toast.success('Email verified', res.message);
      router.push('/login');
    } else {
      setError(res.message);
    }
  };

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
      />
      <Input
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        maxLength={6}
        placeholder="6-digit code"
        hint="Demo mode: any 6 digits will verify your account."
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        error={error ?? undefined}
      />

      <Button type="submit" loading={busy} fullWidth>
        Verify email
      </Button>

      <p className="text-center text-[13px] text-muted">
        Wrong email?{' '}
        <Link
          href="/signup"
          className="font-semibold text-forest underline-offset-4 hover:underline"
        >
          Start over
        </Link>
      </p>
    </form>
  );
}
