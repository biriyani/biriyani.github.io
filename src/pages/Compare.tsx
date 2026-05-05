import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { BIRIYANIS, bySlug, type Biriyani } from '@/data/types'
import { MotifCard } from '@/components/MotifCard'
import { PageHead } from '@/components/PageHead'

const MAX = 3

export function Compare() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('slugs') ?? ''
  const slugs = raw ? raw.split(',').filter(Boolean).slice(0, MAX) : []
  const entries = slugs.map(bySlug).filter(Boolean) as Biriyani[]

  const setSlugs = (next: string[]) => {
    if (next.length) setParams({ slugs: next.join(',') })
    else setParams({})
  }
  const remove = (slug: string) => setSlugs(slugs.filter((s) => s !== slug))
  const add = (slug: string) => setSlugs([...slugs, slug].slice(0, MAX))

  // Spice uniqueness map: spice -> count of columns containing it
  const spiceCounts = useMemo(() => {
    const map = new Map<string, number>()
    entries.forEach((e) =>
      e.spices.forEach((s) => map.set(s, (map.get(s) ?? 0) + 1)),
    )
    return map
  }, [entries])

  return (
    <main className="container-page">
      <PageHead
        title="Compare biriyanis side by side — rice, protein, spices | Biriyani"
        description="Pick up to three biriyanis and compare their rice, protein, technique, and the spice fingerprints that make each one unmistakable."
        url="https://biriyani.wiki/compare"
      />
      <section className="reveal pt-10 pb-8">
        <span className="kicker">The comparison view</span>
        <h1 className="mt-3 font-serif">Three biriyanis, side by side.</h1>
        <p className="mt-4 max-w-2xl text-bark-soft">
          Pick up to three varieties to compare rice, protein, technique, and the
          spice fingerprints that set them apart. Spices appearing in only one
          column are dotted in that column's accent — that's where the dialect
          shows.
        </p>
      </section>

      <section className="reveal grid grid-cols-1 gap-6 md:grid-cols-3" style={{ animationDelay: '120ms' }}>
        {[0, 1, 2].map((i) => {
          const entry = entries[i]
          if (!entry) return <AddColumn key={`empty-${i}`} taken={slugs} onAdd={add} />
          return <Column key={entry.slug} entry={entry} spiceCounts={spiceCounts} onRemove={remove} />
        })}
      </section>

      <p className="mt-12 text-xs text-bark-soft/80">
        Pick a biriyani in the index and click <em>Compare with…</em> on any
        detail page to seed the comparison.
      </p>
    </main>
  )
}

function Column({
  entry,
  spiceCounts,
  onRemove,
}: {
  entry: Biriyani
  spiceCounts: Map<string, number>
  onRemove: (slug: string) => void
}) {
  return (
    <article
      className="rounded-2xl border border-line bg-paper p-5 shadow-paper"
      style={{ borderTop: `4px solid ${entry.accent}` }}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="kicker" style={{ color: entry.accent }}>
            {entry.region}
          </div>
          <h2 className="font-serif text-2xl leading-tight text-bark">
            <Link to={`/b/${entry.slug}`} className="hover:underline underline-offset-4">
              {entry.name.replace(/\s*Biriyani\s*$/i, '')}
            </Link>
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onRemove(entry.slug)}
          className="rounded-full border border-line p-1.5 text-bark-soft hover:border-saffron hover:text-saffron"
          aria-label={`Remove ${entry.name} from comparison`}
        >
          <X size={14} />
        </button>
      </header>

      <div className="aspect-[4/3] overflow-hidden rounded-xl">
        {entry.image_needs_replacement ? (
          <MotifCard entry={entry} variant="card" className="!rounded-none h-full" />
        ) : (
          <img
            src={entry.image}
            alt={entry.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      <p className="mt-4 text-sm text-bark-soft">{entry.tagline}</p>

      <Row label="Style">{entry.style}</Row>
      <Row label="Rice">{entry.rice}</Row>
      <Row label="Protein">{entry.protein}</Row>

      <div className="mt-3 border-t border-line pt-3">
        <div className="kicker mb-2 !text-bark-soft">Key spices</div>
        <ul className="flex flex-wrap gap-1.5">
          {entry.spices.map((s) => {
            const unique = (spiceCounts.get(s) ?? 0) === 1
            return (
              <li key={s}>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream-soft px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.14em] text-bark-soft"
                  title={unique ? 'Unique to this column' : undefined}
                >
                  {unique && (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: entry.accent }}
                    />
                  )}
                  {s}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-4 border-t border-line pt-3 text-sm text-bark-soft">
        <span className="kicker !text-bark-soft block mb-1.5">Distinct</span>
        {entry.distinct}
      </div>
    </article>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3 text-sm">
      <span className="kicker !text-bark-soft">{label}</span>
      <span className="text-right text-bark">{children}</span>
    </div>
  )
}

function AddColumn({ taken, onAdd }: { taken: string[]; onAdd: (slug: string) => void }) {
  const available = BIRIYANIS.filter((b) => !taken.includes(b.slug))
  return (
    <div className="rounded-2xl border-2 border-dashed border-line bg-paper/40 p-5">
      <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
        <Plus size={20} className="text-bark-soft" />
        <p className="text-sm text-bark-soft">Add a biriyani</p>
        <select
          className="w-full max-w-[14rem] rounded-full border border-line bg-paper px-3 py-2 text-sm"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) onAdd(e.target.value)
          }}
          aria-label="Pick a biriyani to add"
        >
          <option value="">Choose…</option>
          {available.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
