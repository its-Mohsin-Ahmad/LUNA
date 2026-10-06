'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

/** Newsletter capture used in the footer. */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState('error');
      return;
    }
    setState('done');
    setEmail('');
  };

  if (state === 'done') {
    return (
      <p className="flex items-center gap-2.5 rounded-lg border border-forest-300/40 bg-forest-700 px-4 py-3.5 text-sm font-medium text-cream">
        <Check className="h-4 w-4 shrink-0 text-forest-300" />
        You are on the list — your 10% code is on its way.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState('idle');
          }}
          placeholder="Enter your email address"
          aria-invalid={state === 'error'}
          className="h-12 flex-1 rounded-md border border-white/15 bg-white/5 px-4 text-sm text-cream placeholder:text-cream/40 focus:border-forest-300 focus:outline-none focus:ring-2 focus:ring-forest-300/25"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-md bg-cream px-6 text-sm font-bold text-forest transition hover:bg-white"
        >
          Subscribe
        </button>
      </div>
      {state === 'error' && (
        <p className="mt-2 text-xs font-medium text-red-300" role="alert">
          Please enter a valid email address.
        </p>
      )}
      <p className="mt-2.5 text-xs text-cream/45">
        By subscribing you agree to our privacy policy. Unsubscribe any time.
      </p>
    </form>
  );
}