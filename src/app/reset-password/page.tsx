import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { AuthShell } from '@/components/auth/AuthShell';
import { ResetForm } from '@/components/auth/ResetForm';

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Choose a new password for your LUNA account.',
  alternates: { canonical: '/reset-password' },
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Storefront>
      <div className="shell py-10 sm:py-14">
        <AuthShell
          eyebrow="Account recovery"
          title="Set a new password"
          subtitle="Pick something strong — at least 8 characters. You will head straight to sign in afterwards."
          footer="Reset links are single-use and expire after one hour."
        >
          <ResetForm />
        </AuthShell>
      </div>
    </Storefront>
  );
}
