# Biriyani

Most people outside India know one biriyani. India cooks in dozens of dialects.

**Biriyani** is a visual archive of regional, community, and city-specific biriyani traditions across India, built to be browsed like an editorial atlas, not a spreadsheet.

## Run locally

1. Clone this repo.
2. Start any static server from the project root:
   ```bash
   python3 -m http.server 8000
   ```
3. Open `http://localhost:8000`.

No build step. No framework. Just HTML, CSS, JS, and a single JSON dataset.

## Structure

- `index.html` — manifesto + filterable visual index
- `biriyani.html` — slug-driven detail view
- `about.html` — why this project exists
- `data/biriyani.json` — the archive dataset
- `css/style.css` — visual system
- `js/main.js` — index rendering + filters
- `js/detail.js` — detail rendering

## Notes

- All pages are static and GitHub Pages-friendly.
- Images are sourced from Wikimedia Commons with attribution in the dataset.
- Where a variety lacked a precise free image, a clearly marked representative proxy is used.
