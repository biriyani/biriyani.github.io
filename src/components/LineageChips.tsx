import { Link } from 'react-router-dom'
import { GitBranch } from 'lucide-react'
import { BIRIYANIS } from '@/data/types'

export function LineageChips({ slugs }: { slugs: string[] }) {
  if (!slugs.length) return null
  const items = slugs
    .map((s) => BIRIYANIS.find((b) => b.slug === s))
    .filter(Boolean) as Array<{ slug: string; name: string; region: string; accent: string }>
  if (!items.length) return null
  return (
    <section className="mt-10 border-t border-line pt-8">
      <div className="mb-3 flex items-center gap-2 text-bark-soft">
        <GitBranch size={14} />
        <span className="kicker !text-bark-soft">Related lineage</span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((b) => (
          <li key={b.slug}>
            <Link
              to={`/b/${b.slug}`}
              className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm transition-colors hover:border-saffron"
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: b.accent }}
              />
              <span className="font-medium text-bark">{b.name.replace(/\s*Biriyani\s*$/i, '')}</span>
              <span className="text-bark-soft text-xs">· {b.region}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
