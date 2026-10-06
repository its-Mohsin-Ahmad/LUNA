import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { AuthShell } from '@/components/auth/AuthShell';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Request a secure link to reset your LUNA account password.',
  alternates: { canonical: '/forgot-password' },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return (
    <Storefront>
      <div className="shell py-10 sm:py-14">
        <AuthShell
          eyebrow="Account recovery"
          title="Forgot your password?"
          subtitle="Enter the email you signed up with and we will prepare a secure reset link."
          footer={
            <>
              Stuck? Reach our team at{' '}
              <a
                href="mailto:support@luna.shop"
                className="font-semibold text-forest underline-offset-4 hover:underline"
              >
                support@luna.shop
              </a>
              .
            </>
          }
        >
          <ForgotPasswordForm />
        </AuthShell>
      </div>
    </Storefront>
  );
}
