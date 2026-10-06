'use client';

/* ------------------------------------------------------------------ */
/* Login form: email + password, demo account shortcuts                */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useToast } from '@/lib/store';
import { Input, PasswordInput, Button } from '@/components/ui';

const DEMO_ACCOUNTS = [
  { email: 'admin@luna.shop', password: 'Admin123', role: 'Admin' },
  { email: 'sales@luna.shop', password: 'Sales123', role: 'Salesman' },
  { email: 'vendor@luna.shop', password: 'Vendor123', role: 'Vendor' },
  { email: 'customer@luna.shop', password: 'Customer123', role: 'Customer' },
] as const;

export function LoginForm() {
  const router = useRouter();
  const { signIn, status } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in? Skip the form entirely.
  useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await signIn(email, password);
    setBusy(false);
    if (res.ok) {
      toast.success('Welcome back', res.message);
      router.push('/');
    } else {
      setError(res.message);
    }
  };

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
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
        error={error && !email ? 'Enter your email' : undefined}
      />
      <PasswordInput
        label="Password"
        autoComplete="current-password"
        required
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error ?? undefined}
      />

      <div className="flex items-center justify-between gap-3 pt-0.5">
        <Link
          href="/forgot-password"
          className="text-[13px] font-semibold text-forest underline-offset-4 hover:underline"
        >
          Forgot password?
        </Link>
        <span className="text-[13px] text-muted">
          New here?{' '}
          <Link
            href="/signup"
            className="font-semibold text-forest underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </span>
      </div>

      <Button type="submit" loading={busy} fullWidth>
        Sign in
      </Button>

      {/* Demo shortcuts */}
      <div className="rounded-xl border border-dashed border-line bg-warm/60 p-3.5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Demo accounts — tap to fill
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => fillDemo(account)}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-ink transition hover:border-forest hover:text-forest"
            >
              {account.role}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
