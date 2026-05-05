import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Quote, Scale } from 'lucide-react'
import { bySlug } from '@/data/types'
import { MotifIcon } from '@/lib/motifs'
import { Tag } from '@/components/Card'
import { SpotsList } from '@/components/SpotsList'
import { LineageChips } from '@/components/LineageChips'
import { RelatedCards } from '@/components/RelatedCards'
import { PageHead } from '@/components/PageHead'
import { NotFound } from './NotFound'

export function Detail() {
  const { slug = '' } = useParams()
  const entry = bySlug(slug)
  if (!entry) return <NotFound />

  const showMotif = entry.image_needs_replacement
  const ogImage = showMotif
    ? `https://biriyani.wiki/og/${entry.slug}.png`
    : entry.image
  const summary = entry.distinct.replace(/\s+/g, ' ').trim()
  const description = `${entry.tagline} ${summary}`.slice(0, 300)

  return (
    <article className="container-page">
      <PageHead
        title={`${entry.name} — ${entry.region}'s ${entry.style.toLowerCase()} biriyani | Biriyani`}
        description={description}
        url={`https://biriyani.wiki/b/${entry.slug}`}
        image={ogImage}
        type="article"
      />
      <header className="reveal pt-6 pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-bark-soft hover:text-saffron"
        >
          ← Back to atlas
        </Link>
      </header>

      <section
        className="reveal relative overflow-hidden rounded-3xl shadow-paper"
        style={{ animationDelay: '120ms' }}
      >
        {showMotif ? (
          <div
            className="relative aspect-[4/5] w-full p-7 sm:aspect-[16/8] sm:p-8 md:p-12 flex flex-col justify-between"
            style={{ background: entry.accent, color: '#fffaf0' }}
          >
            <div className="flex items-end gap-6">
              {entry.motifs.slice(0, 3).map((m) => (
                <MotifIconBig key={m} slug={m} />
              ))}
            </div>
            <div>
              <div className="kicker" style={{ color: '#fffaf0', opacity: 0.85 }}>
                {entry.region}
              </div>
              <h1
                className="mt-2 max-w-3xl font-serif leading-[1.02]"
                style={{ color: '#fffaf0' }}
              >
                {entry.name}
              </h1>
            </div>
          </div>
        ) : (
          <>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-soft sm:aspect-[16/8]">
              <img
                src={entry.image}
                alt={entry.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.6) 100%)`,
                }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-6 sm:pb-7 md:px-10 md:pb-10">
              <div className="kicker" style={{ color: '#fffaf0' }}>
                {entry.region}
              </div>
              <h1
                className="mt-2 max-w-3xl font-serif text-[1.9rem] leading-[1.02] sm:text-[2.4rem] md:text-[clamp(2.4rem,1rem+4vw,4.4rem)]"
                style={{ color: '#fffaf0', textShadow: '0 2px 18px rgba(0,0,0,0.35)' }}
              >
                {entry.name}
              </h1>
            </div>
          </>
        )}
      </section>

      {entry.pull_quote && (
        <blockquote
          className="reveal mx-auto mt-12 max-w-3xl text-center"
          style={{ animationDelay: '200ms' }}
        >
          <Quote
            size={32}
            strokeWidth={1.4}
            className="mx-auto mb-4"
            style={{ color: entry.accent }}
          />
          <p
            className="font-serif text-3xl italic leading-snug text-bark md:text-4xl"
            style={{ color: entry.accent }}
          >
            {entry.pull_quote}
          </p>
        </blockquote>
      )}

      <section
        className="reveal mt-14 grid grid-cols-1 gap-12 md:grid-cols-[1fr,18rem]"
        style={{ animationDelay: '300ms' }}
      >
        <div className="prose-editorial">
          <p className="lead text-lg text-bark md:text-xl">{entry.tagline}</p>
          <div className="mt-8">
            <h2 className="font-serif text-2xl text-bark">Origin</h2>
            <p className="drop-cap mt-3">{entry.origin}</p>
          </div>
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-bark">What makes it distinct</h2>
            <p className="mt-3">{entry.distinct}</p>
          </div>
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border border-line bg-paper p-6">
            <Field label="Rice">{entry.rice}</Field>
            <Field label="Protein">{entry.protein}</Field>
            <Field label="Style">{entry.style}</Field>
            <div className="mt-4">
              <div className="kicker mb-2 !text-bark-soft">Key spices</div>
              <ul className="flex flex-wrap gap-1.5">
                {entry.spices.map((s) => (
                  <li key={s}>
                    <Tag>{s}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to={`/compare?slugs=${entry.slug}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-bark px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-saffron"
            >
              <Scale size={14} />
              Compare with…
              <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </section>

      <section className="mt-16">
        <span className="kicker">Legendary spots</span>
        <h2 className="mt-1 mb-5 font-serif text-3xl">Where to taste it</h2>
        <SpotsList spots={entry.spots} accent={entry.accent} />
      </section>

      <LineageChips slugs={entry.lineage} />

      <RelatedCards entry={entry} />

      {!showMotif && entry.image_credit && (
        <p className="mt-12 text-xs text-bark-soft/80">
          Image:{' '}
          <a
            href={entry.image_credit_url}
            target="_blank"
            rel="noopener"
            className="underline-offset-4 hover:underline"
          >
            {entry.image_credit}
          </a>
        </p>
      )}
    </article>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-3 last:border-b-0">
      <div className="kicker !text-bark-soft mb-1">{label}</div>
      <div className="text-bark">{children}</div>
    </div>
  )
}

function MotifIconBig({ slug }: { slug: string }) {
  return (
    <MotifIcon
      slug={slug}
      width={88}
      height={88}
      strokeWidth={1.4}
      style={{ color: '#fffaf0' }}
    />
  )
}
