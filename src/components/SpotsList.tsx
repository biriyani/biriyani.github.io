import { MapPin } from 'lucide-react'
import type { Spot } from '@/data/types'

export function SpotsList({ spots, accent }: { spots: Spot[]; accent: string }) {
  if (!spots.length) return null
  return (
    <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto pb-2">
      {spots.map((s) => (
        <li
          key={`${s.name}-${s.city}`}
          className="snap-start rounded-2xl border border-line bg-paper px-5 py-4 min-w-[14rem] shadow-paper"
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-[0.16em]" style={{ color: accent }}>
            <MapPin size={12} strokeWidth={2} />
            <span>{s.city}</span>
          </div>
          <div className="font-serif text-xl leading-tight text-bark">{s.name}</div>
        </li>
      ))}
    </ul>
  )
}
