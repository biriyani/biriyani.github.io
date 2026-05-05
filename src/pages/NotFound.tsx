import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { BIRIYANIS } from '@/data/types'
import { MotifCard } from '@/components/MotifCard'
import { PageHead } from '@/components/PageHead'

export function NotFound() {
  const picks = useMemo(() => {
    const arr = [...BIRIYANIS].sort(() => Math.random() - 0.5).slice(0, 3)
    return arr
  }, [])
  return (
    <main className="container-page">
      <PageHead
        title="Not found — Biriyani"
        description="We haven't catalogued this slug yet. The archive covers 51 dialects of biriyani across 16 Indian states — pick one."
        url="https://biriyani.github.io/404"
      />
      <section className="reveal mx-auto max-w-2xl pt-16 pb-12 text-center">
        <span className="kicker">404 — uncharted</span>
        <h1 className="mt-3 font-serif">No biriyani by that slug.</h1>
        <p className="mt-5 text-bark-soft">
          Either we haven't catalogued this one yet, or you typed a slug we don't
          serve. Either way, here are three you might cook with instead.
        </p>
      </section>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {picks.map((b) => (
          <Link
            key={b.slug}
            to={`/b/${b.slug}`}
            className="group block rounded-2xl bg-paper shadow-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            style={{ borderTop: `3px solid ${b.accent}` }}
          >
            <MotifCard entry={b} variant="card" className="!rounded-none rounded-t-2xl" />
            <div className="p-5">
              <div className="kicker" style={{ color: b.accent }}>
                {b.region}
              </div>
              <div className="mt-1 font-serif text-xl text-bark">{b.name}</div>
              <p className="mt-2 text-sm text-bark-soft">{b.tagline}</p>
            </div>
          </Link>
        ))}
      </section>
      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex rounded-full bg-saffron px-5 py-2.5 text-cream hover:bg-bark"
        >
          Back to atlas
        </Link>
      </div>
    </main>
  )
}
