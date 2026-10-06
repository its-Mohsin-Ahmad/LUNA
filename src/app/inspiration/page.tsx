import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Storefront } from '@/components/chrome/Storefront';
import { Breadcrumbs } from '@/components/chrome/Breadcrumbs';
import { SmartImage } from '@/components/ui/SmartImage';
import { HERO_SLIDES, TRUST_POINTS } from '@/lib/data/content';
import { CATEGORIES } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Inspiration',
  description:
    'Season edits, buying guides and department spotlights from the LUNA editorial team — ideas before you shop.',
  alternates: { canonical: '/inspiration' },
};

export default function InspirationPage() {
  const edits = HERO_SLIDES.slice(0, 6);
  const spotlights = CATEGORIES.slice(0, 3);

  return (
    <Storefront>
      <div className="shell py-8 sm:py-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Inspiration' }]} />

        <header className="mb-8 max-w-2xl space-y-2">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-forest-400">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            The LUNA edit
          </p>
          <h1 className="display text-[30px] leading-tight text-forest sm:text-[38px]">
            Inspiration &amp; guides
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Stories from our buyers — seasonal edits, department deep-dives and the thinking behind
            what makes the cut.
          </p>
        </header>

        {/* Editorial cards from the current hero stories */}
        <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {edits.map((story) => (
            <article
              key={story.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-card-hover"
            >
              <div className="relative overflow-hidden bg-warm">
                <SmartImage
                  src={story.image}
                  alt={story.title}
                  seed={story.id}
                  aspect="16/9"
                  wrapperClassName="h-full"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-forest-400">
                  {story.eyebrow}
                </p>
                <h2 className="text-base font-bold leading-snug text-ink group-hover:text-forest">
                  {story.title}
                </h2>
                <p className="flex-1 text-[13px] leading-relaxed text-muted">{story.copy}</p>
                <Link
                  href={story.cta.href}
                  className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-forest hover:underline"
                >
                  {story.cta.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Department spotlights */}
        <section className="mb-12">
          <h2 className="display mb-4 text-xl text-forest">Department deep-dives</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {spotlights.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-line"
              >
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  seed={`edit-${cat.slug}`}
                  aspect="4/3"
                  wrapperClassName="h-full"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block text-lg font-bold text-white">{cat.name}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-white/80">
                    {cat.tagline}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust notes */}
        <section className="rounded-2xl bg-cream/60 p-6 sm:p-8">
          <h2 className="display mb-4 text-xl text-forest">Why these picks</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((t) => (
              <li key={t.title} className="text-[13px] leading-relaxed">
                <strong className="block text-sm text-ink">{t.title}</strong>
                <span className="text-muted">{t.copy}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Storefront>
  );
}