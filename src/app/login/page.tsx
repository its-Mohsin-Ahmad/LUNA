import type { Metadata } from 'next';
import Link from 'next/link';
import { Storefront } from '@/components/chrome/Storefront';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your LUNA account to track orders, save wishlists and check out faster.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Storefront>
      <div className="shell py-10 sm:py-14">
        <AuthShell
          eyebrow="Welcome back"
          title="Sign in to LUNA"
          subtitle="Pick up where you left off — orders, addresses and wishlists, all in sync."
          footer={
            <>
              New to LUNA?{' '}
              <Link
                href="/signup"
                className="font-semibold text-forest underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
              . Demo marketplace — data stays in your browser.
            </>
          }
        >
          <LoginForm />
        </AuthShell>
      </div>
    </Storefront>
  );
}
