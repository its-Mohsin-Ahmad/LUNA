'use client';

/* ------------------------------------------------------------------ */
/* Signup form: creates the account, then routes to email verification */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useToast } from '@/lib/store';
import { Input, PasswordInput, Button, Checkbox } from '@/components/ui';

export function SignupForm() {
  const router = useRouter();
  const { signUp, status } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Tell us your name');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address');
    if (form.password.length < 8) return setError('Passwords need at least 8 characters');
    if (!agreed) return setError('Please accept the terms to continue');

    setBusy(true);
    setError(null);
    const res = await signUp({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim() || undefined,
    });
    setBusy(false);

    if (res.ok) {
      toast.success('Account created', res.message);
      router.push(`/verify?email=${encodeURIComponent(form.email.trim())}`);
    } else {
      setError(res.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Input
        label="Full name"
        autoComplete="name"
        required
        placeholder="Ada Lovelace"
        value={form.name}
        onChange={set('name')}
      />
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        value={form.email}
        onChange={set('email')}
      />
      <Input
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        placeholder="+1 555 000 1234"
        value={form.phone}
        onChange={set('phone')}
      />
      <PasswordInput
        label="Password"
        autoComplete="new-password"
        required
        strength
        hint="At least 8 characters — mix cases, numbers or symbols for a stronger password."
        value={form.password}
        onChange={set('password')}
        error={error && form.password.length < 8 ? error : undefined}
      />

      <Checkbox
        checked={agreed}
        onChange={setAgreed}
        label={
          <>
            I agree to the{' '}
            <Link href="/terms" className="font-semibold text-forest underline-offset-4 hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="font-semibold text-forest underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </>
        }
      />

      {error && (
        <p role="alert" className="text-[13px] font-semibold text-sale">
          {error}
        </p>
      )}

      <Button type="submit" loading={busy} fullWidth>
        Create account
      </Button>

      <p className="text-center text-[13px] text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-forest underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
