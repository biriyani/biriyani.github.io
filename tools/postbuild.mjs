/**
 * Post-build SEO + AEO pipeline.
 *
 * For each route the site exposes, this writes a static HTML file under dist/
 * with:
 *   - canonical + per-page <title> / description
 *   - OpenGraph + Twitter cards (rendered to PNG via sharp for share previews)
 *   - one or more <script type="application/ld+json"> blocks of structured data
 *     (WebSite / CollectionPage / Article / Recipe / AboutPage / BreadcrumbList /
 *     Restaurant) so search engines and AI answer engines can ingest the
 *     archive cleanly
 *   - meta robots tuned for max-image-preview
 *
 * Also emits:
 *   - sitemap.xml (with lastmod and image entries)
 *   - robots.txt with explicit AI-crawler allowlist
 *   - llms.txt (concise index, llmstxt.org spec)
 *   - llms-full.txt (full archive content, single-fetch ingestion)
 *   - .nojekyll for GitHub Pages
 *   - _redirects as a Cloudflare-Pages safety net
 */

import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const SITE_URL = (process.env.SITE_URL ?? 'https://biriyani.wiki').replace(/\/$/, '')
const SITE_NAME = 'Biriyani'
const TODAY = new Date().toISOString().slice(0, 10)

const data = JSON.parse(await readFile(join(ROOT, 'src', 'data', 'biriyani.json'), 'utf8'))
const shell = await readFile(join(DIST, 'index.html'), 'utf8')

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function ogImageFor(e) {
  return e.image_needs_replacement ? `${SITE_URL}/og/${e.slug}.png` : e.image
}

function entryDescription(e) {
  const summary = e.distinct.replace(/\s+/g, ' ').trim()
  return `${e.tagline} ${summary}`.slice(0, 300)
}

// ---------- Structured data builders ----------------------------------------

const PUBLISHER = {
  '@type': 'Organization',
  '@id': SITE_URL + '/#publisher',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: SITE_URL + '/favicon.svg' },
}

function breadcrumb(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}

function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_URL + '/#website',
    name: SITE_NAME,
    alternateName: "Biriyani — India's biriyani archive",
    url: SITE_URL + '/',
    description:
      "A regional archive of India's biriyani dialects — origin, technique, signature spice, and where to taste each one.",
    inLanguage: 'en',
    publisher: PUBLISHER,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE_URL + '/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

function homeCollectionJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': SITE_URL + '/#collection',
    name: "Biriyani — every regional dialect of India's most famous rice dish",
    url: SITE_URL + '/',
    isPartOf: { '@id': SITE_URL + '/#website' },
    about: { '@type': 'Thing', name: 'Indian biriyani' },
    inLanguage: 'en',
    publisher: PUBLISHER,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: data.length,
      itemListElement: data.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/b/${e.slug}`,
        name: e.name,
      })),
    },
  }
}

function homeFaqJsonLd() {
  // AEO: structured FAQ helps answer-engines lift answers verbatim.
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many regional varieties of biriyani exist in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There is no single "Indian biriyani". This archive catalogues ${data.length} regionally distinct varieties across ${new Set(data.map((d) => d.region)).size} Indian states, each with its own rice grain, technique, protein and spice fingerprint — from saffron-laced Awadhi dum and black-pepper Dindigul to bamboo-roasted Andhra and kokum-tinged Konkan fish biriyani.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between biriyani and pulao?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Biriyani is layered — par-cooked rice and marinated meat are sealed and finished together under low heat (dum) so aromas build inward. Pulao is one-pot — rice and meat are cooked together from the start. Lucknowi Awadhi biriyani sits closest to pulao on this spectrum; Hyderabadi kacchi biriyani sits at the other end.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which rice is used for biriyani?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most northern and Deccan styles use long-grain aged basmati. Tamil Nadu varieties (Ambur, Vaniyambadi, Dindigul Thalappakatti, Chettinad, Kayalpattinam) use seeraga samba — a tiny short-grain rice that carries spice deeper than basmati. Donne biriyani uses short-grain jeerakasala, Kerala styles often use khyma rice, and Bengali Kolkata biriyani uses basmati cooked with potato.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is biriyani Indian or Persian in origin?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The technique — layered rice and meat sealed under dum — has Persian origins, but the regional dialects we know today were shaped in Indian kitchens over centuries: the Asaf Jahi Hyderabadi style in the Deccan, Awadhi in the Mughal courts of Lucknow, the Kolkata variant born from Wajid Ali Shah\'s exile in Metiabruz, and dozens of community styles (Bohri, Memoni, Mappila, Bhatkali) layered on top. By the 19th century each was an Indian dish in its own right.',
        },
      },
    ],
  }
}

function entryRecipeJsonLd(e) {
  const url = `${SITE_URL}/b/${e.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    '@id': url + '#recipe',
    name: e.name,
    url,
    image: [ogImageFor(e)],
    description: entryDescription(e),
    keywords: [
      e.region,
      e.style,
      'biriyani',
      'biryani',
      'Indian rice',
      ...e.spices,
    ].join(', '),
    recipeCategory: 'Main course',
    recipeCuisine: `Indian (${e.region})`,
    suitableForDiet: /vegetarian|veg/i.test(e.protein) ? 'https://schema.org/VegetarianDiet' : undefined,
    recipeIngredient: [
      e.rice,
      e.protein,
      ...e.spices,
    ],
    author: PUBLISHER,
    publisher: PUBLISHER,
  }
}

function entryArticleJsonLd(e) {
  const url = `${SITE_URL}/b/${e.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url + '#article',
    headline: `${e.name}: origin, technique, and where to taste it`,
    name: e.name,
    description: entryDescription(e),
    url,
    mainEntityOfPage: url,
    datePublished: '2026-04-01',
    dateModified: TODAY,
    image: [ogImageFor(e)],
    inLanguage: 'en',
    articleSection: 'Indian biriyani',
    keywords: [e.region, e.style, e.protein, ...e.spices].join(', '),
    about: { '@type': 'Thing', name: e.name, sameAs: `https://en.wikipedia.org/wiki/Biryani` },
    locationCreated: {
      '@type': 'Place',
      name: e.region,
      address: { '@type': 'PostalAddress', addressRegion: e.region, addressCountry: 'IN' },
    },
    author: PUBLISHER,
    publisher: PUBLISHER,
  }
}

function spotsJsonLd(e) {
  // Each "legendary spot" becomes a Restaurant entry — AEO surfaces them as
  // local recommendations in answer engines that handle dining queries.
  return e.spots.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: s.name,
    servesCuisine: `Indian (${e.region})`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: s.city,
      addressCountry: 'IN',
    },
    knownFor: e.name,
  }))
}

function aboutJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': SITE_URL + '/about#aboutpage',
    name: 'About — Biriyani',
    url: SITE_URL + '/about',
    isPartOf: { '@id': SITE_URL + '/#website' },
    inLanguage: 'en',
    publisher: PUBLISHER,
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: 'main',
    },
  }
}

function comparePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': SITE_URL + '/compare#webpage',
    name: 'Compare biriyanis',
    url: SITE_URL + '/compare',
    isPartOf: { '@id': SITE_URL + '/#website' },
    inLanguage: 'en',
    publisher: PUBLISHER,
  }
}

// ---------- Head injector ---------------------------------------------------

function injectHead(shellHtml, opts) {
  const {
    title,
    description,
    url,
    image = SITE_URL + '/og-cover.png',
    type = 'website',
    noIndex = false,
    ldBlocks = [],
  } = opts

  let html = shellHtml
    // Strip everything we own — we re-emit it deterministically below.
    .replace(/\n?\s*<meta\s+name="description"[\s\S]+?\/>\s*/g, '\n    ')
    .replace(/\n?\s*<meta\s+name="robots"[\s\S]+?\/>\s*/g, '\n    ')
    .replace(/\n?\s*<meta\s+property="og:[^"]*"[\s\S]+?\/>\s*/g, '\n    ')
    .replace(/\n?\s*<meta\s+name="twitter:[^"]*"[\s\S]+?\/>\s*/g, '\n    ')
    .replace(/\n?\s*<link\s+rel="canonical"[\s\S]+?\/?\s*>\s*/g, '\n    ')

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`)

  // data-rh="true" marks each tag as Helmet-managed so react-helmet-async
  // replaces (rather than duplicates) them when the React tree hydrates and
  // PageHead renders the same tags client-side.
  const RH = 'data-rh="true"'
  const meta = [
    `<meta ${RH} name="description" content="${escapeAttr(description)}" />`,
    `<meta ${RH} name="robots" content="${noIndex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<link ${RH} rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta ${RH} property="og:site_name" content="${SITE_NAME}" />`,
    `<meta ${RH} property="og:title" content="${escapeAttr(title)}" />`,
    `<meta ${RH} property="og:description" content="${escapeAttr(description)}" />`,
    `<meta ${RH} property="og:type" content="${type}" />`,
    `<meta ${RH} property="og:url" content="${escapeAttr(url)}" />`,
    `<meta ${RH} property="og:image" content="${escapeAttr(image)}" />`,
    `<meta ${RH} property="og:image:width" content="1200" />`,
    `<meta ${RH} property="og:image:height" content="630" />`,
    `<meta ${RH} property="og:locale" content="en_IN" />`,
    `<meta ${RH} name="twitter:card" content="summary_large_image" />`,
    `<meta ${RH} name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta ${RH} name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta ${RH} name="twitter:image" content="${escapeAttr(image)}" />`,
  ].join('\n    ')

  // JSON-LD intentionally does NOT carry data-rh: it's prerender-only,
  // never touched by client-side React, so it survives the SPA hydration
  // cleanup in main.tsx.
  const ld = ldBlocks
    .map(
      (block) =>
        `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    )
    .join('\n    ')

  html = html.replace('</head>', `    ${meta}\n    ${ld}\n  </head>`)
  return html
}

async function writeHtml(relativePath, html) {
  const out = join(DIST, relativePath)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html)
}

// ---------- Page generation -------------------------------------------------

// Per-entry detail pages.
let count = 0
for (const e of data) {
  const url = `${SITE_URL}/b/${e.slug}`
  const html = injectHead(shell, {
    title: `${e.name} — ${e.region}'s ${e.style.toLowerCase()} biriyani | ${SITE_NAME}`,
    description: entryDescription(e),
    url,
    image: ogImageFor(e),
    type: 'article',
    ldBlocks: [
      entryArticleJsonLd(e),
      entryRecipeJsonLd(e),
      breadcrumb([
        { name: 'Biriyani', url: SITE_URL + '/' },
        { name: e.region, url: `${SITE_URL}/?region=${encodeURIComponent(e.region)}` },
        { name: e.name, url },
      ]),
      ...spotsJsonLd(e),
    ],
  })
  await writeHtml(`b/${e.slug}/index.html`, html)
  count++
}

// Home.
const homeHtml = injectHead(shell, {
  title: "Biriyani — every regional dialect of India's most famous rice dish",
  description: `${data.length} regional biriyani varieties from ${new Set(data.map((d) => d.region)).size} Indian states. Origin, technique, signature spice, and where to taste each one — Hyderabadi dum, Kolkata, Lucknowi, Ambur, Thalassery, Donne and more.`,
  url: SITE_URL + '/',
  image: SITE_URL + '/og-cover.png',
  type: 'website',
  ldBlocks: [
    siteJsonLd(),
    homeCollectionJsonLd(),
    homeFaqJsonLd(),
    breadcrumb([{ name: 'Biriyani', url: SITE_URL + '/' }]),
  ],
})
await writeFile(join(DIST, 'index.html'), homeHtml)

await writeHtml(
  'about/index.html',
  injectHead(shell, {
    title: 'About — Biriyani',
    description:
      "Why this exists: most of the world knows one biriyani. India knows hundreds. An editorial archive of regional dialects — what each one is, where it comes from, and what makes it unmistakable.",
    url: SITE_URL + '/about',
    image: SITE_URL + '/og-cover.png',
    ldBlocks: [
      aboutJsonLd(),
      breadcrumb([
        { name: 'Biriyani', url: SITE_URL + '/' },
        { name: 'About', url: SITE_URL + '/about' },
      ]),
    ],
  }),
)

await writeHtml(
  'compare/index.html',
  injectHead(shell, {
    title: 'Compare biriyanis side by side — rice, protein, spices | Biriyani',
    description:
      'Pick up to three biriyanis and compare their rice, protein, technique, and the spice fingerprints that make each one unmistakable.',
    url: SITE_URL + '/compare',
    image: SITE_URL + '/og-cover.png',
    ldBlocks: [
      comparePageJsonLd(),
      breadcrumb([
        { name: 'Biriyani', url: SITE_URL + '/' },
        { name: 'Compare', url: SITE_URL + '/compare' },
      ]),
    ],
  }),
)

await writeHtml(
  '404.html',
  injectHead(shell, {
    title: 'Not found — Biriyani',
    description: `We haven't catalogued this slug yet. The archive covers ${data.length} dialects of biriyani across ${new Set(data.map((d) => d.region)).size} Indian states — pick one.`,
    url: SITE_URL + '/404',
    image: SITE_URL + '/og-cover.png',
    noIndex: true,
  }),
)

// ---------- Sitemap ---------------------------------------------------------

const sitemapEntries = [
  { loc: SITE_URL + '/', priority: '1.0', changefreq: 'weekly' },
  { loc: SITE_URL + '/about', priority: '0.5', changefreq: 'yearly' },
  { loc: SITE_URL + '/compare', priority: '0.6', changefreq: 'monthly' },
  ...data.map((e) => ({
    loc: `${SITE_URL}/b/${e.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    image: ogImageFor(e),
    imageTitle: e.name,
  })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries
  .map((u) => {
    const img = u.image
      ? `\n    <image:image><image:loc>${u.image}</image:loc><image:title>${escapeAttr(u.imageTitle)}</image:title></image:image>`
      : ''
    return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${img}
  </url>`
  })
  .join('\n')}
</urlset>
`
await writeFile(join(DIST, 'sitemap.xml'), sitemap)

// ---------- robots.txt ------------------------------------------------------

await writeFile(
  join(DIST, 'robots.txt'),
  `# Biriyani — explicit allowlist for AI answer engines and traditional
# search crawlers. Editorial content is openly licensed (CC-BY); please
# credit "Biriyani — biriyani.wiki" when surfacing.

User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: meta-externalagent
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

// ---------- llms.txt + llms-full.txt (AEO) ----------------------------------

// Group entries by region for the concise index.
const byRegion = data.reduce((acc, e) => {
  ;(acc[e.region] ??= []).push(e)
  return acc
}, {})
const regionOrder = Object.keys(byRegion).sort()

const llmsTxt = `# Biriyani

> A regional archive of India's biriyani dialects. ${data.length} varieties across ${regionOrder.length} Indian states, each with its own rice, protein, technique and spice fingerprint.

This is an editorial reference, not a recipe site. Each entry covers: where the dialect is from, what makes it distinct, the rice variety used, the primary protein, the signature spice profile, and a short list of legendary establishments that still cook it the way it's supposed to be cooked.

## Pages

- [Home](${SITE_URL}/): Index of all ${data.length} varieties; filter by state or style.
- [Compare](${SITE_URL}/compare): Side-by-side comparison of up to three biriyanis.
- [About](${SITE_URL}/about): Why this exists.
- [Full text](${SITE_URL}/llms-full.txt): Every entry in a single file, optimised for ingestion.

## Varieties by region

${regionOrder
  .map(
    (region) =>
      `### ${region}\n\n${byRegion[region]
        .map(
          (e) =>
            `- [${e.name}](${SITE_URL}/b/${e.slug}): ${e.tagline}`,
        )
        .join('\n')}`,
  )
  .join('\n\n')}

## Source data

The full dataset (JSON, MIT-licenced for code, CC-BY for content) is at https://github.com/biriyani/biriyani.github.io/blob/main/src/data/biriyani.json.
`

await writeFile(join(DIST, 'llms.txt'), llmsTxt)

const llmsFullTxt = `# Biriyani — full archive

A regional archive of India's biriyani dialects. ${data.length} varieties across ${regionOrder.length} Indian states.
Source: ${SITE_URL}
Licence: CC-BY 4.0 (content) — credit "Biriyani — biriyani.wiki".

---

${data
  .map(
    (e) => `## ${e.name}

URL: ${SITE_URL}/b/${e.slug}
Region: ${e.region}
Style: ${e.style}
Rice: ${e.rice}
Protein: ${e.protein}
Key spices: ${e.spices.join(', ')}
Tagline: ${e.tagline}
${e.pull_quote ? `Pull quote: ${e.pull_quote}\n` : ''}
Origin
${e.origin}

What makes it distinct
${e.distinct}

Legendary spots
${e.spots.map((s) => `- ${s.name} (${s.city})`).join('\n')}

${e.lineage.length ? `Related lineage: ${e.lineage.map((slug) => data.find((d) => d.slug === slug)?.name).filter(Boolean).join(', ')}\n` : ''}---
`,
  )
  .join('\n')}

End of archive. ${data.length} entries.
`

await writeFile(join(DIST, 'llms-full.txt'), llmsFullTxt)

// ---------- SPA fallbacks ---------------------------------------------------

await writeFile(
  join(DIST, '_redirects'),
  `/*    /index.html   200
`,
)
// .nojekyll prevents GitHub Pages' Jekyll filter from skipping files starting with _.
await writeFile(join(DIST, '.nojekyll'), '')

// Belt-and-suspenders TopoJSON copy.
try {
  await copyFile(join(ROOT, 'public', 'india.topo.json'), join(DIST, 'india.topo.json'))
} catch {
  /* already in dist */
}

// ---------- OG cover (raster) -----------------------------------------------

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

// ---------- Per-entry OG covers (raster) ------------------------------------

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
      return `<g transform="translate(${x} 410)" stroke="#fffaf0" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${path}"/></g>`
    })
    .join('')
  const titleClean = e.name.replace(/\s*Biriyani\s*$/i, '')
  const lines = titleClean.length > 18
    ? (() => {
        const words = titleClean.split(' ')
        const mid = Math.ceil(words.length / 2)
        return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
      })()
    : [titleClean]
  const baseY = lines.length === 1 ? 280 : 230
  const titleSvg = lines
    .map(
      (l, i) =>
        `<text x="80" y="${baseY + i * 100}" font-family="Cormorant Garamond, Georgia, serif" font-size="92" font-weight="500" fill="#fffaf0">${escapeAttr(l)}</text>`,
    )
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${e.accent}"/>
  <line x1="80" y1="100" x2="1120" y2="100" stroke="#fffaf0" stroke-width="1" opacity="0.4"/>
  <text x="80" y="80" font-family="Manrope, system-ui, sans-serif" font-size="20" font-weight="600" letter-spacing="6" fill="#fffaf0" opacity="0.9">
    ${escapeAttr(e.region.toUpperCase())} · ${escapeAttr(e.style.toUpperCase())}
  </text>
  ${titleSvg}
  ${groups}
  <line x1="80" y1="540" x2="1120" y2="540" stroke="#fffaf0" stroke-width="1" opacity="0.4"/>
  <text x="80" y="580" font-family="Manrope, system-ui, sans-serif" font-size="22" font-weight="500" fill="#fffaf0" opacity="0.85">biriyani.wiki</text>
  <text x="1120" y="580" font-family="Manrope, system-ui, sans-serif" font-size="22" font-weight="500" fill="#fffaf0" opacity="0.85" text-anchor="end">${escapeAttr(e.name.replace(/\s*Biriyani\s*$/i, '').toLowerCase())}</text>
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

console.log(
  `postbuild: ${count} detail pages, sitemap (${sitemapEntries.length} URLs), llms.txt + llms-full.txt, robots, _redirects`,
)
