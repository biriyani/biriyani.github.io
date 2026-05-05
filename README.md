# Biriyani

> Most of the world knows one biriyani. India knows hundreds.

A visual archive of India's biriyani dialects — the saffron-laced Awadhi dum,
the black-pepper Dindigul, the kokum-tinged Konkan fish biriyani, the bamboo
roast in coastal Andhra. Each is a parallel dish that happens to share a name
and a love of long-grained rice. This site catalogues them: where they came
from, what makes each unmistakable, the spices and rice and technique, and
which restaurants are still cooking them the way they're supposed to be cooked.

51 varieties · 16 regions · 3 cooking traditions intersecting all of them.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (editorial type system, regional accent palette)
- React Router (`/`, `/b/:slug`, `/compare`, `/about`, `*` 404)
- mapcn / MapLibre GL — the India-by-states hero map
- TopoJSON via `topojson-client` for the state geometry
- `sharp` for build-time OG image generation

Static-only output (no server). Code-split on the heavy MapLibre bundle so
detail/compare/about pages stay lightweight.

## Develop

```bash
npm install
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # tsc → vite build → tools/postbuild.mjs
npm run preview      # serve the production build locally
```

The build pipeline:

1. `tsc -b` type-check
2. `vite build` → `dist/`
3. `tools/postbuild.mjs` — generates one `dist/b/<slug>.html` per entry with
   per-page OG/Twitter meta tags, renders a per-entry OG cover PNG for each
   `image_needs_replacement: true` entry, writes `sitemap.xml`, `robots.txt`,
   `_redirects`, and a site-wide `og-cover.png`.

## Data

`src/data/biriyani.json` is the single source of truth. Each entry:

```jsonc
{
  "slug": "hyderabadi-dum",
  "name": "Hyderabadi Dum Biriyani",
  "region": "Telangana",
  "style": "Dum",
  "tagline": "Smoky saffron, sealed pot, no shortcuts.",
  "origin": "...",
  "distinct": "...",
  "rice": "Aged basmati, long grain",
  "protein": "Mutton or chicken",
  "spices": ["saffron", "fried onions", "..."],
  "spots": [{ "name": "Shadab", "city": "Hyderabad" }],
  "image": "https://...",
  "image_credit": "...",
  "image_credit_url": "...",
  "accent": "#c25a17",
  "motifs": ["saffron", "mutton", "rice"],
  "lineage": ["hyderabadi-kacchi", "kalyani-biriyani"],
  "pull_quote": "Aroma builds inward instead of escaping.",
  "image_needs_replacement": false
}
```

`tools/extend_data.py` is the one-shot script that seeded `accent`, `motifs`,
`lineage`, `pull_quote`, and `image_needs_replacement` across all 51 entries.

## Contributing an image

`IMAGES_TO_REPLACE.md` lists the 33 entries currently using a generic / shared
photo. They render an illustrated motif card on the site (so nothing looks
duplicated), and a per-entry motif PNG for share-previews.

To swap a real photo in, paste the URL into the block under that entry — any
source is fine: Google Maps, TripAdvisor, Zomato, restaurant Instagram, indie
food blogs. We always credit with a hyperlink.

```
- image: <full URL to image>
- image_credit: Photo by <photographer> via <site>
- image_credit_url: <link to the page where the image was sourced>
```

Then merge into `src/data/biriyani.json` and flip `image_needs_replacement` to
`false` for that slug. Re-run `npm run build` and the per-entry OG card will
auto-rebuild.

## Deploying

**GitHub Pages with custom domain `biriyani.wiki`** (current). The workflow at
`.github/workflows/deploy.yml` builds on push to `main` and publishes `dist/`.
`public/CNAME` pins the custom domain. Repo Settings → Pages → "Build and
deployment" source = `GitHub Actions`.

Routes are served from directory-style paths: `/`, `/b/<slug>`, `/compare`,
`/about`. Each has a real `index.html` with per-page canonical, OG/Twitter
tags, and JSON-LD so direct links preview correctly when shared and rank
cleanly in search. Unknown paths fall through to `/404.html`, which is the
SPA shell — React's `<NotFound>` renders.

**Cloudflare Pages** (also supported, drop-in). Connect the repo in the
Cloudflare dashboard, build command `npm run build`, output dir `dist`. The
`_redirects` file written by `postbuild.mjs` handles the SPA fallback there.

## SEO / AEO

The postbuild step bakes in:

- canonical link + per-page meta description on every route
- OpenGraph + Twitter card metadata; per-entry OG cover PNGs auto-rendered
  via `sharp`
- JSON-LD structured data: `WebSite`, `CollectionPage`, `FAQPage` on `/`;
  `Article` + `Recipe` + `BreadcrumbList` + `Restaurant`(per spot) on
  `/b/<slug>`; `AboutPage` on `/about`; `WebPage` on `/compare`
- `sitemap.xml` with `lastmod`, `changefreq`, and image entries
- `robots.txt` with explicit allowlist for AI answer-engines (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, etc.)
- `/llms.txt` (concise, llmstxt.org spec) and `/llms-full.txt` (full
  archive content, single-fetch ingestion for LLMs)

## Credits

State boundaries: [DataMeet](https://github.com/datameet/maps) and Anuj Arya's
[bubble_maps](https://github.com/Anujarya300/bubble_maps) — CC-BY 4.0.

Per-entry food photographs: credited inline on each detail page via the
`image_credit` and `image_credit_url` fields.

Map runtime: [mapcn](https://github.com/AnmolSaini16/mapcn) (MIT) wrapping
[MapLibre GL](https://maplibre.org/) (BSD-3-Clause).

## Licence

Code: MIT. Editorial copy and curation: CC-BY 4.0 — credit "Biriyani".
Photographs are licensed individually by source; see each entry's credit line.
