import type { Metadata } from 'next';
import Link from 'next/link';
import { Storefront } from '@/components/chrome/Storefront';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Join LUNA to unlock member pricing, faster checkout and order tracking.',
  alternates: { canonical: '/signup' },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <Storefront>
      <div className="shell py-10 sm:py-14">
        <AuthShell
          eyebrow="Join LUNA"
          title="Create your account"
          subtitle="Members get early drops, free returns and a checkout that remembers everything."
          footer={
            <>
              Already with us?{' '}
              <Link
                href="/login"
                className="font-semibold text-forest underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
              .
            </>
          }
        >
          <SignupForm />
        </AuthShell>
      </div>
    </Storefront>
  );
}
