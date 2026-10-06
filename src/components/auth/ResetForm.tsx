'use client';

/* ------------------------------------------------------------------ */
/* Reset form: new password, completes the forgot-password flow        */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useToast } from '@/lib/store';
import { Input, PasswordInput, Button } from '@/components/ui';

export function ResetForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Prefill from the reset link (?email=...&token=...).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefillEmail = params.get('email');
    const prefillToken = params.get('token');
    if (prefillEmail) setEmail(prefillEmail);
    if (prefillToken) setToken(prefillToken);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError('Passwords need at least 8 characters');
    setBusy(true);
    setError(null);
    const res = await resetPassword(email, token, password);
    setBusy(false);
    if (res.ok) {
      toast.success('Password updated', res.message);
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
        label="Reset token"
        required
        placeholder="rst_..."
        hint="Prefilled automatically when you arrive from the reset link."
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <PasswordInput
        label="New password"
        autoComplete="new-password"
        required
        strength
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error && password.length < 8 ? error : undefined}
      />

      {error && password.length >= 8 && (
        <p role="alert" className="text-[13px] font-semibold text-sale">
          {error}
        </p>
      )}

      <Button type="submit" loading={busy} fullWidth>
        Set new password
      </Button>

      <p className="text-center text-[13px] text-muted">
        <Link href="/login" className="font-semibold text-forest underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
