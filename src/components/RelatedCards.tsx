import { BIRIYANIS, type Biriyani } from '@/data/types'
import { Card } from './Card'

export function RelatedCards({ entry }: { entry: Biriyani }) {
  const siblings = BIRIYANIS.filter(
    (b) => b.region === entry.region && b.slug !== entry.slug,
  ).slice(0, 3)
  if (!siblings.length) return null
  return (
    <section className="mt-16 border-t border-line pt-12">
      <span className="kicker">Also from {entry.region}</span>
      <h3 className="mt-2 mb-6 font-serif text-3xl">More dialects from the same kitchen</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {siblings.map((b) => (
          <Card key={b.slug} entry={b} />
        ))}
      </div>
    </section>
  )
}
