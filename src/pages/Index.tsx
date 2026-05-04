import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { BIRIYANIS, REGIONS, STYLES } from '@/data/types'
import { Card } from '@/components/Card'
import { searchBiriyanis } from '@/lib/search'

// MapLibre is heavy (~370KB gzipped). Lazy-load it so detail/compare/about pages
// don't pull it.
const IndiaMap = lazy(() =>
  import('@/components/IndiaMap').then((m) => ({ default: m.IndiaMap })),
)

function MapPlaceholder() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-line bg-cream-soft shadow-paper md:h-[520px]">
      <div className="absolute inset-0 flex items-center justify-center text-bark-soft">
        <span className="kicker !text-bark-soft">Loading map…</span>
      </div>
    </div>
  )
}

export function Index() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [style, setStyle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // "/" focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(
    () => searchBiriyanis(BIRIYANIS, { region, style, query }),
    [region, style, query],
  )

  const handleRegionFromMap = (r: string | null) => {
    setRegion(r ?? '')
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main className="container-page">
      <section className="reveal pt-10 pb-12 md:pt-16 md:pb-16">
        <span className="kicker">India, grain by grain</span>
        <h1 className="mt-3 max-w-4xl font-serif">
          The visual archive of India's biriyanis,
          <span className="text-saffron"> dialect by dialect.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-bark-soft">
          Most people outside India know one biriyani. India cooks it in dozens —
          smoky dum, citrus-lit pulao, leaf-wrapped parcels, bamboo-roasted, fish-laced.
          Hover a state on the map, or type to find a variety.
        </p>
      </section>

      <section className="reveal" style={{ animationDelay: '120ms' }}>
        <Suspense fallback={<MapPlaceholder />}>
          <IndiaMap selected={region || undefined} onSelect={handleRegionFromMap} />
        </Suspense>
      </section>

      <section
        ref={gridRef}
        className="reveal mt-16"
        style={{ animationDelay: '240ms' }}
        aria-labelledby="grid-heading"
      >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="kicker">The atlas</span>
            <h2 id="grid-heading" className="mt-1 font-serif text-3xl md:text-4xl">
              {filtered.length} {filtered.length === 1 ? 'variety' : 'varieties'}
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bark-soft" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search varieties, spices, places…"
                aria-label="Search biriyanis"
                className="w-full rounded-full border border-line bg-paper py-2.5 pl-9 pr-9 text-sm placeholder:text-bark-soft/70 focus:border-saffron focus:outline-none md:w-72"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-cream-soft px-1.5 py-0.5 text-[0.65rem] text-bark-soft md:inline-block">
                /
              </kbd>
            </div>
            <Select value={region} onChange={setRegion} placeholder="All regions">
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
            <Select value={style} onChange={setStyle} placeholder="All styles">
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((b, i) => (
              <Card key={b.slug} entry={b} eager={i < 4} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-paper/60 p-10 text-center text-bark-soft">
            No biriyanis match those filters.{' '}
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setRegion('')
                setStyle('')
              }}
              className="text-saffron underline-offset-4 hover:underline"
            >
              Clear filters
            </button>
            .
          </div>
        )}
      </section>
    </main>
  )
}

function Select({
  value,
  onChange,
  placeholder,
  children,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-bark focus:border-saffron focus:outline-none"
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  )
}
