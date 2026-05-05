import { Link } from 'react-router-dom'
import type { Biriyani } from '@/data/types'
import { MotifBadge, MotifCard } from './MotifCard'
import { cn } from '@/lib/utils'

export function Card({ entry, eager = false }: { entry: Biriyani; eager?: boolean }) {
  const showMotif = entry.image_needs_replacement
  return (
    <Link
      to={`/b/${entry.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-paper shadow-paper transition-[transform,box-shadow] duration-300 isolate',
        'hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-saffron focus-visible:outline-offset-4',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-soft">
        {showMotif ? (
          <MotifCard entry={entry} variant="card" className="!rounded-none h-full" />
        ) : (
          <img
            src={entry.image}
            alt={entry.name}
            loading={eager ? 'eager' : 'lazy'}
            className="h-full w-full object-cover"
          />
        )}
        {!showMotif && <MotifBadge motifs={entry.motifs} color={entry.accent} />}
      </div>
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{ background: entry.accent }}
      />
      <div className="flex flex-1 flex-col gap-2 p-5 text-center sm:text-left">
        <div className="kicker" style={{ color: entry.accent }}>
          {entry.region}
        </div>
        <h3 className="font-serif text-2xl leading-[1.1] text-bark">
          {entry.name.replace(/\s*Biriyani\s*$/i, '')}
        </h3>
        <p className="text-sm text-bark-soft leading-snug">{entry.tagline}</p>
        <div className="mt-auto flex flex-wrap justify-center gap-1.5 pt-3 sm:justify-start">
          <Tag>{entry.style}</Tag>
        </div>
      </div>
    </Link>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-cream-soft px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.14em] text-bark-soft">
      {children}
    </span>
  )
}
