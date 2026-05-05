# How to add media to a biriyani

Every entry in `src/data/biriyani.json` can carry three optional media
arrays in addition to the existing `spots`. Sections render only when the
array exists and has at least one item — leave a field off and that
section disappears from the page.

```jsonc
{
  "slug": "hyderabadi-dum",
  "name": "Hyderabadi Dum Biriyani",
  // … existing fields …

  // Spots can now carry an optional URL — Google Maps, restaurant site,
  // Zomato listing, anything. Old spots without a url keep working.
  "spots": [
    { "name": "Shadab", "city": "Hyderabad", "url": "https://maps.app.goo.gl/abc" },
    { "name": "Bawarchi", "city": "Hyderabad" }
  ],

  // External recipes worth following — only `title` and `url` are
  // required. Source/author is nice but optional.
  "recipes": [
    {
      "title": "Hyderabadi Mutton Biryani",
      "source": "Veg Recipes of India",
      "url": "https://www.vegrecipesofindia.com/hyderabadi-mutton-biryani-recipe/"
    }
  ],

  // YouTube (or any video host) links. The site auto-extracts the
  // YouTube thumbnail from the URL — no need to fetch it yourself.
  "videos": [
    {
      "title": "Authentic Hyderabadi Dum Biryani",
      "channel": "Sanjeev Kapoor Khazana",
      "url": "https://www.youtube.com/watch?v=…"
    }
  ],

  // Long-form articles, history pieces, restaurant write-ups.
  "further_reading": [
    {
      "title": "The Lost History of Hyderabadi Biriyani",
      "source": "Vir Sanghvi",
      "url": "https://…"
    }
  ]
}
```

## Required vs optional

| Field on item | `spots` | `recipes` | `videos` | `further_reading` |
| --- | --- | --- | --- | --- |
| `name` / `title` | ✓ | ✓ | ✓ | ✓ |
| `url` | optional | ✓ | ✓ | ✓ |
| `city` / `source` / `channel` | ✓ city / — | optional source | optional channel | optional source |

## YouTube thumbnails

Paste any of these URL shapes — the site picks the right ID automatically:

- `https://www.youtube.com/watch?v=ID`
- `https://youtu.be/ID`
- `https://www.youtube.com/embed/ID`
- `https://www.youtube.com/shorts/ID`

The thumbnail comes from `https://i.ytimg.com/vi/ID/hqdefault.jpg`.

## What happens after you save

`npm run build` (or just push — the GitHub Actions workflow runs it) will:

- Render the new sections on the detail page (`/b/<slug>`)
- Add `VideoObject` JSON-LD per video and `Recipe` JSON-LD per recipe so
  search engines and AI answer engines can ingest them
- Add the new spots / recipes / videos / further-reading to
  `/llms-full.txt` for one-fetch LLM ingestion

## Quick add via GitHub UI

1. Open <https://github.com/biriyani/biriyani.github.io/edit/main/src/data/biriyani.json>
2. Find the entry by slug
3. Paste your media block under the existing fields
4. Commit straight to `main` — the deploy runs in ~90 seconds

That's the whole flow. No forms, no extra files.
