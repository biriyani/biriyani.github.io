/**
 * Post-build:
 *  - Generates per-route HTML files in dist/ with proper <title>, description, and
 *    OpenGraph / Twitter card tags so detail URLs preview correctly when shared.
 *    Crawlers (Twitter, iMessage, WhatsApp, Facebook) read the head; users still
 *    get the SPA bundle which hydrates client-side.
 *  - Writes sitemap.xml and robots.txt.
 *  - Writes _redirects so Cloudflare Pages serves the SPA shell on unknown
 *    paths (defence-in-depth — we generate static files for every known route).
 */

import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const SITE_URL = process.env.SITE_URL ?? 'https://biriyani.pages.dev'

const data = JSON.parse(await readFile(join(ROOT, 'src', 'data', 'biriyani.json'), 'utf8'))
const shell = await readFile(join(DIST, 'index.html'), 'utf8')

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function injectMeta(shellHtml, { title, description, url, image, type = 'website' }) {
  // Strip every existing meta tag we own — description, OpenGraph, Twitter — so each
  // generated page has exactly one of each. Source index.html may have these
  // tags split across multiple lines, hence the [\s\S]+? non-greedy match.
  let html = shellHtml
    .replace(/\n?\s*<meta\s+name="description"[\s\S]+?\/>\s*/g, '\n    ')
    .replace(/\n?\s*<meta\s+property="og:[^"]*"[\s\S]+?\/>\s*/g, '\n    ')
    .replace(/\n?\s*<meta\s+name="twitter:[^"]*"[\s\S]+?\/>\s*/g, '\n    ')

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`)

  const meta = [
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    image ? `<meta property="og:image" content="${escapeAttr(image)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    image ? `<meta name="twitter:image" content="${escapeAttr(image)}" />` : '',
  ]
    .filter(Boolean)
    .join('\n    ')

  html = html.replace('</head>', `    ${meta}\n  </head>`)
  return html
}

async function writeHtml(relativePath, html) {
  const out = join(DIST, relativePath)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html)
}

// 1) Per-entry detail pages.
let count = 0
for (const e of data) {
  const url = `${SITE_URL}/b/${e.slug}`
  const description = e.tagline + ' — ' + e.distinct.replace(/\s+/g, ' ').slice(0, 160)
  // OG image: motif-card entries get a per-entry PNG rendered below; entries with
  // their own photo use that directly.
  const image = e.image_needs_replacement
    ? `${SITE_URL}/og/${e.slug}.png`
    : e.image
  const html = injectMeta(shell, {
    title: `${e.name} — Biriyani Atlas`,
    description,
    url,
    image,
    type: 'article',
  })
  await writeHtml(`b/${e.slug}.html`, html)
  count++
}

// 2) Static routes — overwrite dist/index.html with cleaner home metadata,
//    then write about and compare with their own.
const home = injectMeta(shell, {
  title: "Biriyani Atlas — a visual archive of India's biriyanis",
  description:
    "India cooks biriyani in dozens of dialects. The Atlas maps them — region, technique, signature spice, the restaurants still doing it right.",
  url: SITE_URL + '/',
  image: SITE_URL + '/og-cover.png',
  type: 'website',
})
await writeFile(join(DIST, 'index.html'), home)

await writeHtml(
  'about.html',
  injectMeta(shell, {
    title: 'About — Biriyani Atlas',
    description:
      "Why this exists: most of the world knows one biriyani. India knows hundreds. The Atlas is an editorial archive of regional dialects.",
    url: SITE_URL + '/about',
    image: SITE_URL + '/og-cover.png',
  }),
)

await writeHtml(
  'compare.html',
  injectMeta(shell, {
    title: 'Compare biriyanis — Biriyani Atlas',
    description:
      'Pick up to three biriyanis and compare them side by side: rice, protein, technique, and which spices are unique to each dialect.',
    url: SITE_URL + '/compare',
    image: SITE_URL + '/og-cover.png',
  }),
)

await writeHtml(
  '404.html',
  injectMeta(shell, {
    title: 'Not found — Biriyani Atlas',
    description:
      "We haven't catalogued this slug yet. The Atlas covers 51 dialects of biriyani across 16 Indian states — pick one.",
    url: SITE_URL + '/404',
  }),
)

// 3) sitemap.xml + robots.txt
const urls = [
  { loc: SITE_URL + '/', priority: '1.0' },
  { loc: SITE_URL + '/about', priority: '0.5' },
  { loc: SITE_URL + '/compare', priority: '0.6' },
  ...data.map((e) => ({ loc: `${SITE_URL}/b/${e.slug}`, priority: '0.8' })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(join(DIST, 'sitemap.xml'), sitemap)

await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

// 4) Cloudflare Pages SPA fallback for unknown paths.
//    (Known routes already have static HTML, but this catches typos and future routes.)
await writeFile(
  join(DIST, '_redirects'),
  `/*    /index.html   200
`,
)

// 5) Copy the source TopoJSON if it didn't make it via public/ (Vite handles this,
//    but include as belt-and-suspenders).
try {
  await copyFile(join(ROOT, 'public', 'india.topo.json'), join(DIST, 'india.topo.json'))
} catch {
  /* already in dist */
}

// 6) Render the site OG cover SVG → PNG (Twitter / iMessage need raster).
try {
  const svg = await readFile(join(ROOT, 'public', 'og-cover.svg'))
  await sharp(svg, { density: 220 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(join(DIST, 'og-cover.png'))
  console.log('  rendered og-cover.png')
} catch (err) {
  console.warn('  og-cover render failed:', err?.message)
}

// 7) Per-entry OG cards for entries that render as motif fallbacks (no real photo
//    available yet). We render an SVG with the entry's accent + name + motifs to PNG
//    so share-previews look distinctive even before a real photo is curated.
const motifGlyph = {
  rice: 'M 60 15 Q 50 25 60 60 Q 70 25 60 15',
  saffron: 'M 60 15 C 45 35 45 60 60 75 C 75 60 75 35 60 15 Z',
  mutton: 'M 30 60 Q 50 30 90 50 L 70 80 Q 40 80 30 60 Z',
  chicken: 'M 30 70 L 80 25 Q 95 25 90 45 L 50 80 Q 30 85 30 70 Z',
  hilsa: 'M 20 60 Q 60 25 95 60 Q 60 95 20 60 Z',
  prawn: 'M 30 50 Q 50 30 80 45 Q 100 70 70 80 Q 40 75 30 50 Z',
  egg: 'M 60 20 C 80 20 90 50 90 70 C 90 90 30 90 30 70 C 30 50 40 20 60 20',
  'gongura-leaf': 'M 60 20 Q 30 50 30 75 Q 60 95 90 75 Q 90 50 60 20',
  'banana-leaf': 'M 25 75 Q 50 25 95 25 Q 80 80 25 75 Z',
  bamboo: 'M 50 10 L 70 10 L 70 90 L 50 90 Z M 50 35 L 70 35 M 50 60 L 70 60',
  'clay-pot': 'M 30 50 C 30 35 90 35 90 50 L 90 80 C 90 95 30 95 30 80 Z',
  lemon: 'M 30 50 Q 60 25 90 50 Q 90 75 60 80 Q 30 75 30 50',
  tamarind: 'M 30 30 Q 60 20 90 50 Q 80 90 40 90 Q 25 60 30 30',
  tomato: 'M 30 60 A 30 30 0 1 0 90 60 A 30 30 0 1 0 30 60',
  mustard: 'M 35 35 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 M 65 50 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 M 45 75 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0',
  chili: 'M 30 80 Q 50 50 90 25 Q 75 60 30 80',
  rosewater: 'M 60 20 Q 35 60 35 80 Q 60 95 85 80 Q 85 60 60 20',
  turmeric: 'M 25 75 Q 50 50 90 25 M 45 60 Q 55 65 60 60 M 30 70 Q 40 75 45 70',
  seeraga: 'M 35 60 Q 30 75 38 80 Q 46 78 42 65 M 60 50 Q 55 65 63 70 Q 71 68 67 55 M 80 65 Q 75 80 83 85 Q 91 83 87 70',
}

function entryOgSvg(e) {
  const motifs = e.motifs.slice(0, 3)
  const groups = motifs
    .map((m, i) => {
      const path = motifGlyph[m] ?? motifGlyph.rice
      const x = 80 + i * 130
      return `<g transform="translate(${x} 380)" stroke="#fffaf0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${path}"/></g>`
    })
    .join('')
  const titleClean = e.name.replace(/\s*Biriyani\s*$/i, '')
  // Wrap title across two lines if it's long.
  const lines = titleClean.length > 18
    ? (() => {
        const words = titleClean.split(' ')
        const mid = Math.ceil(words.length / 2)
        return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
      })()
    : [titleClean]
  const titleSvg = lines
    .map(
      (l, i) =>
        `<text x="80" y="${250 + i * 95}" font-family="Cormorant Garamond, Georgia, serif" font-size="92" font-weight="500" fill="#fffaf0">${escapeAttr(l)}</text>`,
    )
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${e.accent}"/>
      <stop offset="100%" stop-color="${e.accent}cc"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="#000" opacity="0.06"/>
  <text x="80" y="170" font-family="Manrope, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="6" fill="#fffaf0" opacity="0.85">
    ${escapeAttr(e.region.toUpperCase())} · ${escapeAttr(e.style.toUpperCase())}
  </text>
  ${titleSvg}
  ${groups}
  <text x="1120" y="570" font-family="Manrope, system-ui, sans-serif" font-size="22" font-weight="500" fill="#fffaf0" opacity="0.8" text-anchor="end">biriyani atlas</text>
</svg>`
}

await mkdir(join(DIST, 'og'), { recursive: true })
let ogCount = 0
for (const e of data) {
  if (!e.image_needs_replacement) continue
  try {
    const svg = entryOgSvg(e)
    await sharp(Buffer.from(svg), { density: 200 })
      .resize(1200, 630)
      .png({ compressionLevel: 9 })
      .toFile(join(DIST, 'og', `${e.slug}.png`))
    ogCount++
  } catch (err) {
    console.warn(`  ${e.slug} OG render failed:`, err?.message)
  }
}
console.log(`  rendered ${ogCount} per-entry OG motif covers`)

console.log(`postbuild: ${count} detail pages, sitemap with ${urls.length} URLs, _redirects, robots.txt`)
