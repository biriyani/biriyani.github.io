#!/usr/bin/env python3
"""One-shot script to extend biriyani.json with accent / motifs / lineage / pull_quote / image_needs_replacement."""

import json
import re
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "src" / "data" / "biriyani.json"

REGION_ACCENTS = {
    "Telangana":          "#c25a17",
    "Andhra Pradesh":     "#b03828",
    "Tamil Nadu":         "#c98c1a",
    "Kerala":             "#1d6e4a",
    "Karnataka":          "#b85a2a",
    "Maharashtra":        "#b04a26",
    "West Bengal":        "#8b5a2b",
    "Uttar Pradesh":      "#a04257",
    "Delhi":              "#a8462e",
    "Bihar":              "#a87320",
    "Odisha":             "#8c4a1e",
    "Assam":              "#4a7340",
    "Jammu and Kashmir":  "#6e4566",
    "Goa":                "#b56a2c",
    "Gujarat":            "#b8364a",
    "Madhya Pradesh":     "#97481c",
}

# Per-entry motif overrides for entries with distinctive ingredients/techniques.
MOTIF_OVERRIDES = {
    "kizhi-biriyani":            ["banana-leaf", "rice", "chicken"],
    "bamboo-biriyani":           ["bamboo", "rice", "chicken"],
    "matka-peer-biriyani":       ["clay-pot", "rice", "saffron"],
    "mla-potlam-biriyani":       ["clay-pot", "rice", "mutton"],
    "degh-ki-biriyani":          ["clay-pot", "rice", "saffron"],
    "ulavacharu-biriyani":       ["rice", "mutton", "tamarind"],
    "gongura-mutton-biriyani":   ["gongura-leaf", "mutton", "rice"],
    "santare-ki-biriyani":       ["lemon", "rice", "chicken"],
    "achaari-biriyani":          ["lemon", "rice", "mutton"],
    "ilish-biriyani":            ["hilsa", "rice", "mustard"],
    "goan-fish-biriyani":        ["hilsa", "rice", "lemon"],
    "kashmiri-yakhni-biriyani":  ["saffron", "mutton", "rice"],
    "bhopali-yakhni-biriyani":   ["saffron", "mutton", "rice"],
    "lucknowi-awadhi-biriyani":  ["saffron", "rice", "rosewater"],
    "rampuri-biriyani":          ["saffron", "mutton", "rice"],
    "metiabruz-biriyani":        ["saffron", "egg", "rice"],
    "kolkata-biriyani":          ["egg", "rice", "saffron"],
    "tehri-biriyani":            ["rice", "turmeric", "saffron"],
    "hyderabadi-dum-biriyani":   ["saffron", "mutton", "rice"],
    "hyderabadi-dum":            ["saffron", "mutton", "rice"],
    "hyderabadi-kacchi":         ["saffron", "mutton", "rice"],
    "hyderabadi-pakki":          ["saffron", "chicken", "rice"],
    "kalyani-biriyani":          ["mutton", "rice", "tamarind"],
    "sofiyani-biriyani":         ["saffron", "chicken", "rice"],
    "donne-biriyani":            ["banana-leaf", "rice", "mutton"],
    "ambur-biriyani":            ["seeraga", "rice", "mutton"],
    "vaniyambadi-biriyani":      ["seeraga", "rice", "mutton"],
    "dindigul-thalappakatti":    ["seeraga", "rice", "mutton"],
    "chettinad-biriyani":        ["seeraga", "rice", "chicken"],
    "kayalpattinam-biriyani":    ["seeraga", "rice", "chicken"],
    "thalassery-biriyani":       ["rice", "chicken", "saffron"],
    "kozhikode-biriyani":        ["rice", "chicken", "saffron"],
    "mapilla-biriyani":          ["rice", "chicken", "saffron"],
    "kochi-kayees-biriyani":     ["rice", "chicken", "saffron"],
    "travancore-biriyani":       ["rice", "chicken", "saffron"],
    "beary-biriyani":            ["rice", "chicken", "lemon"],
    "bhatkali-navayathi-biriyani":["rice", "chicken", "saffron"],
    "military-hotel-mutton-biriyani":["mutton", "rice", "tamarind"],
    "kolhapuri-biriyani":        ["mutton", "rice", "chili"],
    "malvani-biriyani":          ["hilsa", "rice", "lemon"],
    "bombay-biriyani":           ["rice", "chicken", "tomato"],
    "bohri-biriyani":            ["rice", "mutton", "tomato"],
    "memoni-biriyani":           ["rice", "mutton", "tomato"],
    "sindhi-biriyani":           ["rice", "mutton", "tomato"],
    "surti-bohri-biriyani":      ["rice", "mutton", "tomato"],
    "moradabadi-biriyani":       ["rice", "chicken", "saffron"],
    "old-delhi-biriyani":        ["rice", "chicken", "saffron"],
    "nizamuddin-biriyani":       ["rice", "chicken", "saffron"],
    "patna-biriyani":            ["rice", "chicken", "tamarind"],
    "cuttack-biriyani":          ["rice", "chicken", "tamarind"],
    "kampuri-biriyani":          ["rice", "chicken", "tamarind"],
    "lalla-ki-biriyani":         ["rice", "mutton", "saffron"],
}

# Sparse, historically grounded lineage links (entries that culturally descend from / share roots with each other).
LINEAGE = {
    "hyderabadi-kacchi":            ["hyderabadi-dum", "hyderabadi-pakki"],
    "hyderabadi-pakki":             ["hyderabadi-dum", "hyderabadi-kacchi"],
    "hyderabadi-dum":               ["hyderabadi-kacchi", "hyderabadi-pakki", "kalyani-biriyani"],
    "kalyani-biriyani":             ["hyderabadi-dum"],
    "sofiyani-biriyani":            ["hyderabadi-dum"],
    "mla-potlam-biriyani":          ["hyderabadi-dum"],
    "ambur-biriyani":               ["vaniyambadi-biriyani", "dindigul-thalappakatti"],
    "vaniyambadi-biriyani":         ["ambur-biriyani"],
    "dindigul-thalappakatti":       ["ambur-biriyani", "vaniyambadi-biriyani"],
    "thalassery-biriyani":          ["kozhikode-biriyani", "mapilla-biriyani"],
    "kozhikode-biriyani":           ["thalassery-biriyani", "mapilla-biriyani"],
    "mapilla-biriyani":             ["thalassery-biriyani", "kozhikode-biriyani"],
    "kochi-kayees-biriyani":        ["thalassery-biriyani"],
    "travancore-biriyani":          ["thalassery-biriyani"],
    "beary-biriyani":               ["bhatkali-navayathi-biriyani", "thalassery-biriyani"],
    "bhatkali-navayathi-biriyani":  ["beary-biriyani"],
    "kolkata-biriyani":             ["lucknowi-awadhi-biriyani", "metiabruz-biriyani"],
    "metiabruz-biriyani":           ["lucknowi-awadhi-biriyani", "kolkata-biriyani"],
    "ilish-biriyani":               ["kolkata-biriyani"],
    "lucknowi-awadhi-biriyani":     ["rampuri-biriyani", "kolkata-biriyani"],
    "rampuri-biriyani":             ["lucknowi-awadhi-biriyani"],
    "moradabadi-biriyani":          ["lucknowi-awadhi-biriyani"],
    "nizamuddin-biriyani":          ["old-delhi-biriyani"],
    "old-delhi-biriyani":           ["nizamuddin-biriyani"],
    "bhopali-yakhni-biriyani":      ["kashmiri-yakhni-biriyani", "lucknowi-awadhi-biriyani"],
    "kashmiri-yakhni-biriyani":     ["bhopali-yakhni-biriyani"],
    "memoni-biriyani":              ["bohri-biriyani", "sindhi-biriyani"],
    "bohri-biriyani":               ["memoni-biriyani", "surti-bohri-biriyani"],
    "surti-bohri-biriyani":         ["bohri-biriyani"],
    "sindhi-biriyani":              ["memoni-biriyani"],
    "ulavacharu-biriyani":          ["gongura-mutton-biriyani"],
    "gongura-mutton-biriyani":      ["ulavacharu-biriyani"],
}

# 33 entries currently sharing photos with at least one other entry (from data audit).
NEEDS_REPLACEMENT = {
    "sofiyani-biriyani", "kozhikode-biriyani", "bohri-biriyani", "cuttack-biriyani", "surti-bohri-biriyani",
    "gongura-mutton-biriyani", "bhatkali-navayathi-biriyani", "patna-biriyani",
    "kayalpattinam-biriyani", "kolhapuri-biriyani", "old-delhi-biriyani",
    "mapilla-biriyani", "malvani-biriyani", "nizamuddin-biriyani",
    "kochi-kayees-biriyani", "memoni-biriyani", "kampuri-biriyani",
    "hyderabadi-dum", "hyderabadi-pakki",
    "ulavacharu-biriyani", "beary-biriyani",
    "chettinad-biriyani", "kashmiri-yakhni-biriyani",
    "kizhi-biriyani", "tehri-biriyani",
    "military-hotel-mutton-biriyani", "rampuri-biriyani",
    "ilish-biriyani", "goan-fish-biriyani",
    # The following entries currently use shared "Indian biriyani" images that are
    # representative rather than variety-specific — flagging for replacement too.
    "thalassery-biriyani", "lalla-ki-biriyani", "santare-ki-biriyani",
    "matka-peer-biriyani",
}

# Curated pull quotes lifted/condensed from origin/distinct.
PULL_QUOTES = {
    "hyderabadi-dum":              "Aroma builds inward instead of escaping.",
    "hyderabadi-kacchi":           "Timing had to be exact, long before commercial kitchens.",
    "hyderabadi-pakki":            "Cooked rice meets cooked meat — a measured, dignified sealing.",
    "kalyani-biriyani":            "The bachelor's biriyani — buffalo, tomato, and the rush of a Hyderabadi café morning.",
    "sofiyani-biriyani":           "Pale, perfumed, almost ghostly — a biriyani that whispers.",
    "ulavacharu-biriyani":         "Horse gram broth turns the rice the colour of dark monsoon earth.",
    "gongura-mutton-biriyani":     "Sour gongura cuts into the mutton like a slap of summer.",
    "ambur-biriyani":              "Short-grain seeraga samba carries spice the way long grain never can.",
    "vaniyambadi-biriyani":        "Born in tanneries, perfected in roadside dhabas.",
    "dindigul-thalappakatti":      "Black peppercorns where you'd expect chilli.",
    "chettinad-biriyani":          "Stone-ground spice paste, no pretence of subtlety.",
    "thalassery-biriyani":         "Khyma rice, fried cashews, raisins — Malabar's coastal opulence.",
    "kozhikode-biriyani":          "Built on a Sayyid lineage and Calicut's spice-trader nose.",
    "mapilla-biriyani":            "The Mappila community's house style — softer rice, softer spice.",
    "kizhi-biriyani":              "Wrapped, knotted, opened at the table like a gift.",
    "donne-biriyani":              "Served in palm-leaf cups; eaten by hand at military mess hours.",
    "bhatkali-navayathi-biriyani": "Tomatoes, green chillies, no warm spices — a coastal kind of heat.",
    "military-hotel-mutton-biriyani":"Khaki-shirted cooks in Bangalore's lunchtime trenches.",
    "kolhapuri-biriyani":          "Dark masala, scorched onions, the bite of Kolhapur's famous chillies.",
    "kolkata-biriyani":            "The potato is not a substitute. It's the point.",
    "metiabruz-biriyani":          "Cooked for an exiled king who refused to abandon his table.",
    "ilish-biriyani":              "Hilsa and rice — the Bengali sacrament, layered.",
    "lucknowi-awadhi-biriyani":    "Pulao masquerading as biriyani, in the gentlest possible way.",
    "rampuri-biriyani":            "The Rohilla court's slow dum — citrus-scented, almost transparent.",
    "moradabadi-biriyani":         "Brass-shop alleys, pyaaz ka raita, no fuss.",
    "old-delhi-biriyani":          "Cooked through the night for the morning Friday rush.",
    "nizamuddin-biriyani":         "Plates pass over shrine walls — biriyani as offering.",
    "patna-biriyani":              "Mughal lineage softened by Magadhi rice traditions.",
    "cuttack-biriyani":            "Odisha's coastal Muslim kitchens, dialed down on spice.",
    "kampuri-biriyani":            "Assam's quiet variant — fewer spices, more rice, more rice.",
    "kashmiri-yakhni-biriyani":    "Yakhni stock instead of fried-onion masala — austere and aromatic.",
    "goan-fish-biriyani":          "Coconut, kokum, fish — a biriyani that tastes like the Konkan.",
    "bamboo-biriyani":             "Cooked inside green bamboo over a wood fire.",
    "matka-peer-biriyani":         "Clay-pot biriyani sold at a Sufi shrine in Old Delhi.",
    "santare-ki-biriyani":         "Orange peel and orange juice in the rice — Delhi winter, condensed.",
    "achaari-biriyani":            "Pickle masala folded in — sharper and brighter than dum.",
    "bhopali-yakhni-biriyani":     "Bhopal's begum kitchens: yakhni, kewra, an unhurried hand.",
    "lalla-ki-biriyani":           "Chowk Bazaar, Lucknow — the city's working-class lunch.",
    "memoni-biriyani":             "Tomato-forward, fiery — the Memon community's Bombay-via-Karachi style.",
    "bohri-biriyani":              "Eaten from the thaal, communally, with the neighbourhood.",
    "surti-bohri-biriyani":        "Tangier than its Bombay cousin — Surat's tomato hand is heavier.",
    "sindhi-biriyani":              "Brought across the border, kept across generations.",
    "tehri-biriyani":              "Vegetarian biriyani in the Awadhi register — quietly confident.",
    "bombay-biriyani":             "Tomato, mint, potato, and the city's restless street energy.",
    "malvani-biriyani":            "Konkan coast: kokum, coconut, fish — biriyani by the sea.",
    "mla-potlam-biriyani":         "A muslin pouch holds raw spices over the rice as it cooks.",
    "degh-ki-biriyani":            "Wedding deghs, a hundred plates at a time, slow heat under sealed lids.",
    "kayalpattinam-biriyani":      "Tamil Nadu's coastal Muslim style — coconut, seeraga, sea breeze.",
    "kochi-kayees-biriyani":       "A 1957 hotel in Mattancherry built a city's lunchtime habit.",
    "travancore-biriyani":         "Pukka style: meat and rice cooked separately, layered late.",
}


def main() -> None:
    entries = json.loads(DATA.read_text())
    for entry in entries:
        slug = entry["slug"]
        region = entry["region"]
        entry.setdefault("accent", REGION_ACCENTS.get(region, "#bf6f24"))
        entry.setdefault("motifs", MOTIF_OVERRIDES.get(slug, ["rice", "saffron", "mutton"]))
        entry.setdefault("lineage", LINEAGE.get(slug, []))
        if slug in PULL_QUOTES:
            entry.setdefault("pull_quote", PULL_QUOTES[slug])
        entry.setdefault("image_needs_replacement", slug in NEEDS_REPLACEMENT)
    DATA.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n")
    print(f"Updated {len(entries)} entries")
    flagged = sum(1 for e in entries if e.get("image_needs_replacement"))
    quoted = sum(1 for e in entries if "pull_quote" in e)
    print(f"  flagged for image replacement: {flagged}")
    print(f"  with pull_quote: {quoted}")


if __name__ == "__main__":
    main()
