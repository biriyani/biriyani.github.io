#!/usr/bin/env python3
"""Generate IMAGES_TO_REPLACE.md from biriyani.json — a fillable checklist for entries
currently flagged image_needs_replacement: true."""

import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data" / "biriyani.json"
OUT = ROOT / "IMAGES_TO_REPLACE.md"

# Restaurant suggestions per slug — places known for that variety. These are
# starting points for the user to find images on Google Maps / TripAdvisor / Zomato.
HINTS: dict[str, list[str]] = {
    "sofiyani-biriyani":             ["Hotel Shadab Hyderabad", "Pista House Hyderabad (Sofiyani special)"],
    "kozhikode-biriyani":            ["Paragon Restaurant Kozhikode", "Rahmath Hotel Kozhikode", "Sagar Restaurant Calicut"],
    "bohri-biriyani":                ["The Bohri Kitchen Mumbai", "Bohri Bhandar"],
    "cuttack-biriyani":              ["Hotel Royal Cuttack", "Truptee Cuttack"],
    "surti-bohri-biriyani":          ["Jaman Ghar Surat", "Sankalp Surat"],
    "gongura-mutton-biriyani":       ["Hotel Bawarchi Hyderabad gongura special", "Olive Bistro Hyderabad"],
    "bhatkali-navayathi-biriyani":   ["Hotel Anjuman Bhatkal", "Shabri Bhatkal"],
    "patna-biriyani":                ["Pind Balluchi Patna", "Mainland China Patna biryani special"],
    "kayalpattinam-biriyani":        ["Salim Hotel Kayalpattinam", "Star Biryani Kayalpattinam"],
    "kolhapuri-biriyani":            ["Padma Guest House Kolhapur", "Hotel Subray Kolhapur"],
    "old-delhi-biriyani":            ["Karim's Jama Masjid", "Al Jawahar Jama Masjid"],
    "mapilla-biriyani":              ["Calicut Paragon mapilla special", "Zain's Hotel Calicut"],
    "malvani-biriyani":              ["Sindhudurg Malvani Restaurant", "Hotel Tarkarli"],
    "nizamuddin-biriyani":           ["Ghalib Kabab Corner Nizamuddin", "Karim's Nizamuddin"],
    "kochi-kayees-biriyani":         ["Kayees Rahmathullah Cafe Mattancherry"],
    "memoni-biriyani":               ["Memon Bhojanalay Mumbai", "Bismillah Hotel Mumbai"],
    "kampuri-biriyani":              ["Khorikaa Guwahati", "Heritage Khorikaa"],
    "hyderabadi-dum":                ["Paradise Biryani Hyderabad", "Bawarchi Hyderabad"],
    "hyderabadi-pakki":              ["Hotel Shah Ghouse Hyderabad", "Pista House Hyderabad"],
    "ulavacharu-biriyani":           ["Ulavacharu Restaurant Vijayawada", "Ulavacharu Banjara Hills"],
    "beary-biriyani":                ["Hotel Maharaja Mangalore", "Ideal Cafe Mangalore"],
    "chettinad-biriyani":            ["Annalakshmi Karaikudi", "Bangala Karaikudi"],
    "kashmiri-yakhni-biriyani":      ["Ahdoo's Srinagar", "Mughal Darbar Srinagar"],
    "kizhi-biriyani":                ["Aroma Restaurant Coimbatore kizhi", "Sri Ananda Bhavan kizhi parotta"],
    "tehri-biriyani":                ["Tunday Kababi Lucknow tehri", "Ram Asrey Lucknow"],
    "military-hotel-mutton-biriyani":["SLN Military Hotel Bangalore", "Shivaji Military Hotel Jayanagar"],
    "rampuri-biriyani":              ["Rampur Hazari Lal Rampur", "Hotel Manzar Rampur"],
    "ilish-biriyani":                ["Oh! Calcutta Kolkata", "Bhojohori Manna Kolkata"],
    "goan-fish-biriyani":            ["Mum's Kitchen Panjim", "Ritz Classic Panjim"],
    "thalassery-biriyani":           ["Paris Restaurant Thalassery", "MVK Thalassery"],
    "lalla-ki-biriyani":             ["Lalla Biryani Aminabad Lucknow", "Idris Biryani Lucknow"],
    "santare-ki-biriyani":           ["Karim Hotel Old Delhi (santare special)", "Al Jawahar Jama Masjid"],
    "matka-peer-biriyani":           ["Matka Peer Dargah Pragati Maidan", "Karim's near Matka Peer"],
}


def main() -> None:
    entries = json.loads(DATA.read_text())
    by_slug = {e["slug"]: e for e in entries}
    flagged = [e for e in entries if e.get("image_needs_replacement")]
    flagged.sort(key=lambda e: (e["region"], e["name"]))

    # Group by current shared image so the user sees who shares with whom.
    groups = defaultdict(list)
    for e in flagged:
        groups[e["image"]].append(e["slug"])

    lines: list[str] = []
    lines.append("# Images to replace")
    lines.append("")
    lines.append(
        f"There are **{len(flagged)} entries** currently using a generic / shared photo. "
        "The detail pages render an illustrated motif card for these until a real photo lands."
    )
    lines.append("")
    lines.append("## How to contribute an image")
    lines.append("")
    lines.append("Any source is fine — Google Maps, TripAdvisor, Zomato, restaurant Instagram, "
                 "indie food blogs. We always credit with a hyperlink. Paste the URL into the "
                 "block below the entry and ping the maintainer to merge.")
    lines.append("")
    lines.append("```")
    lines.append("- image: <full URL to image>")
    lines.append("- image_credit: <e.g. \"Photo by Nag's Place via Zomato\">")
    lines.append("- image_credit_url: <link to the page where the image was sourced>")
    lines.append("```")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Per-entry checklist (grouped by shared photo)")
    lines.append("")
    for shared, slugs in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        if len(slugs) > 1:
            shared_short = shared.split("/")[-1]
            lines.append(f"### Shared currently: `{shared_short}` (×{len(slugs)})")
        else:
            lines.append(f"### One-off (currently a representative image)")
        lines.append("")
        for slug in slugs:
            e = by_slug[slug]
            hint = HINTS.get(slug)
            lines.append(f"#### `{slug}` — {e['name']} ({e['region']})")
            lines.append(f"_{e['tagline']}_")
            if hint:
                lines.append(f"Try: {' · '.join(hint)}")
            lines.append("")
            lines.append("```")
            lines.append("- image:")
            lines.append("- image_credit:")
            lines.append("- image_credit_url:")
            lines.append("```")
            lines.append("")

    OUT.write_text("\n".join(lines))
    print(f"Wrote {OUT.relative_to(ROOT)} — {len(flagged)} entries flagged across {len(groups)} groups")


if __name__ == "__main__":
    main()
