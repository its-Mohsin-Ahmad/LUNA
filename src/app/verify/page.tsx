import type { Metadata } from 'next';
import { Storefront } from '@/components/chrome/Storefront';
import { AuthShell } from '@/components/auth/AuthShell';
import { VerifyForm } from '@/components/auth/VerifyForm';

export const metadata: Metadata = {
  title: 'Verify your email',
  description: 'Enter the 6-digit code sent to your inbox to activate your LUNA account.',
  alternates: { canonical: '/verify' },
  robots: { index: false, follow: false },
};

export default function VerifyPage() {
  return (
    <Storefront>
      <div className="shell py-10 sm:py-14">
        <AuthShell
          eyebrow="One last step"
          title="Verify your email"
          subtitle="We sent a 6-digit code to your inbox. Enter it below to activate your account."
          footer="Demo mode accepts any 6 digits — no real email is sent."
        >
          <VerifyForm />
        </AuthShell>
      </div>
    </Storefront>
  );
}
