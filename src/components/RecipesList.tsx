import { ArrowUpRight, ChefHat } from 'lucide-react'
import type { Recipe } from '@/data/types'

export function RecipesList({ recipes, accent }: { recipes: Recipe[]; accent: string }) {
  if (!recipes.length) return null
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {recipes.map((r) => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener"
            className="group block h-full rounded-2xl border border-line bg-paper p-5 shadow-paper transition-colors hover:border-saffron"
          >
            <div
              className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.16em]"
              style={{ color: accent }}
            >
              <ChefHat size={12} strokeWidth={2} />
              <span>Recipe{r.source ? ` · ${r.source}` : ''}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="font-serif text-lg leading-snug text-bark">{r.title}</span>
              <ArrowUpRight size={14} strokeWidth={2} className="mt-1 text-bark-soft group-hover:text-saffron" />
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
}
