'use client';

/* ------------------------------------------------------------------ */
/* Settings: currency, language, motion, data controls                 */
/* ------------------------------------------------------------------ */

import { useRouter } from 'next/navigation';
import { Globe, LogOut, Palette, Trash2 } from 'lucide-react';
import { useAuth, usePrefs, useToast } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';
import type { CurrencyCode } from '@/lib/types';
import { Button, Select } from '@/components/ui';

const LANGUAGES: Array<{ value: 'en' | 'ar' | 'ur'; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية (Arabic)' },
  { value: 'ur', label: 'اردو (Urdu)' },
];

export function SettingsPanel() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { prefs, setPref, clearSearches, clearRecent, clearCompare } = usePrefs();
  const toast = useToast();

  const wipeActivity = () => {
    clearSearches();
    clearRecent();
    clearCompare();
    toast.success('Activity cleared', 'Search, compare and view history were removed.');
  };

  return (
    <div className="space-y-5">
      {/* Regional */}
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="display mb-4 flex items-center gap-2 text-lg text-forest">
          <Globe className="h-4 w-4 text-forest-400" aria-hidden />
          Region & language
        </h2>
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <Select
            label="Currency"
            value={prefs.currency}
            onChange={(e) => {
              setPref('currency', e.target.value as CurrencyCode);
              toast.success('Currency updated', `Prices now display in ${e.target.value}.`);
            }}
            options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} (${c.symbol})` }))}
          />
          <Select
            label="Language"
            value={prefs.language}
            onChange={(e) => setPref('language', e.target.value as 'en' | 'ar' | 'ur')}
            options={LANGUAGES}
            hint="Interface translation ships in a later release."
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="display mb-4 flex items-center gap-2 text-lg text-forest">
          <Palette className="h-4 w-4 text-forest-400" aria-hidden />
          Accessibility
        </h2>
        <label className="flex cursor-pointer items-start justify-between gap-4">
          <span>
            <span className="block text-sm font-semibold text-ink">Reduce motion</span>
            <span className="block text-[13px] text-muted">
              Minimise carousels, parallax and animated transitions.
            </span>
          </span>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={prefs.reduceMotion}
            onChange={(e) => setPref('reduceMotion', e.target.checked)}
          />
          <span
            aria-hidden
            className={
              prefs.reduceMotion
                ? 'relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-forest transition'
                : 'relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-line transition'
            }
          >
            <span
              className={
                prefs.reduceMotion
                  ? 'absolute left-0.5 top-0.5 h-5 w-5 translate-x-5 rounded-full bg-white shadow transition-transform'
                  : 'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform'
              }
            />
          </span>
        </label>
      </section>

      {/* Data & session */}
      <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
        <h2 className="display mb-4 text-lg text-forest">Data & session</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Trash2 className="h-4 w-4" aria-hidden />}
            onClick={wipeActivity}
          >
            Clear activity history
          </Button>
          <Button
            variant="sale"
            size="sm"
            icon={<LogOut className="h-4 w-4" aria-hidden />}
            onClick={() => {
              signOut();
              toast.info('Signed out', 'Your data stays saved on this device.');
              router.push('/');
            }}
          >
            Sign out
          </Button>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          LUNA is a demo marketplace — every account, order and preference lives only in this
          browser&apos;s local storage. Clearing site data resets everything.
        </p>
      </section>
    </div>
  );
}
