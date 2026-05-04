import type { Biriyani } from '@/data/types'

export function searchBiriyanis(
  list: Biriyani[],
  filters: { region: string; style: string; query: string },
): Biriyani[] {
  const q = filters.query.trim().toLowerCase()
  return list.filter((b) => {
    if (filters.region && b.region !== filters.region) return false
    if (filters.style && b.style !== filters.style) return false
    if (!q) return true
    const haystack = [
      b.name,
      b.tagline,
      b.region,
      b.style,
      b.rice,
      b.protein,
      b.origin,
      b.distinct,
      ...b.spices,
      ...b.spots.map((s) => `${s.name} ${s.city}`),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}
