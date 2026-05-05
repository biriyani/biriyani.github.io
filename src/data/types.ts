export type Spot = { name: string; city: string; url?: string }
export type Recipe = { title: string; source?: string; url: string }
export type Video = { title: string; channel?: string; url: string }
export type Reading = { title: string; source?: string; url: string }

export type Biriyani = {
  slug: string
  name: string
  region: string
  style: string
  tagline: string
  origin: string
  distinct: string
  rice: string
  protein: string
  spices: string[]
  spots: Spot[]
  recipes?: Recipe[]
  videos?: Video[]
  further_reading?: Reading[]
  image: string
  image_credit: string
  image_credit_url: string
  accent: string
  motifs: string[]
  lineage: string[]
  pull_quote?: string
  image_needs_replacement: boolean
}

import data from './biriyani.json'

export const BIRIYANIS: Biriyani[] = (data as Biriyani[]).slice().sort((a, b) =>
  a.name.localeCompare(b.name),
)

export function bySlug(slug: string): Biriyani | undefined {
  return BIRIYANIS.find((b) => b.slug === slug)
}

export function regionToken(region: string): string {
  const map: Record<string, string> = {
    'Telangana': 'telangana',
    'Andhra Pradesh': 'andhra',
    'Tamil Nadu': 'tamilnadu',
    'Kerala': 'kerala',
    'Karnataka': 'karnataka',
    'Maharashtra': 'maharashtra',
    'West Bengal': 'bengal',
    'Uttar Pradesh': 'up',
    'Delhi': 'delhi',
    'Bihar': 'bihar',
    'Odisha': 'odisha',
    'Assam': 'assam',
    'Jammu and Kashmir': 'kashmir',
    'Goa': 'goa',
    'Gujarat': 'gujarat',
    'Madhya Pradesh': 'mp',
    'Punjab': 'punjab',
    'Rajasthan': 'rajasthan',
  }
  return map[region] ?? 'saffron'
}

export const REGIONS = Array.from(new Set(BIRIYANIS.map((b) => b.region))).sort()
export const STYLES = Array.from(new Set(BIRIYANIS.map((b) => b.style))).sort()

export function regionCounts(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const b of BIRIYANIS) counts[b.region] = (counts[b.region] ?? 0) + 1
  return counts
}
