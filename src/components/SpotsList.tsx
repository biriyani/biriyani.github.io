import { ArrowUpRight, MapPin } from 'lucide-react'
import type { Spot } from '@/data/types'

export function SpotsList({ spots, accent }: { spots: Spot[]; accent: string }) {
  if (!spots.length) return null
  return (
    <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto pb-2">
      {spots.map((s) => {
        const inner = (
          <>
            <div
              className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-[0.16em]"
              style={{ color: accent }}
            >
              <MapPin size={12} strokeWidth={2} />
              <span>{s.city}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-xl leading-tight text-bark">{s.name}</span>
              {s.url && <ArrowUpRight size={14} strokeWidth={2} className="text-bark-soft" />}
            </div>
          </>
        )
        const baseClass =
          'snap-start rounded-2xl border border-line bg-paper px-5 py-4 min-w-[14rem] shadow-paper'
        return (
          <li key={`${s.name}-${s.city}`}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener"
                className={`${baseClass} block transition-colors hover:border-saffron`}
              >
                {inner}
              </a>
            ) : (
              <div className={baseClass}>{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
