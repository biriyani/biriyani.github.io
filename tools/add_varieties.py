#!/usr/bin/env python3
"""One-shot: append 15 new biriyani varieties to src/data/biriyani.json and
update lineage on existing siblings."""

import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "src" / "data" / "biriyani.json"

PLACEHOLDER_IMG = "https://upload.wikimedia.org/wikipedia/commons/4/49/Biryani.JPG"
PLACEHOLDER_CRED = "Photo via Wikimedia Commons (placeholder — to be replaced)"
PLACEHOLDER_CRED_URL = "https://commons.wikimedia.org/wiki/File:Biryani.JPG"


def E(**kw):
    """Build an entry, supplying defaults for the boilerplate fields."""
    kw.setdefault("image", PLACEHOLDER_IMG)
    kw.setdefault("image_credit", PLACEHOLDER_CRED)
    kw.setdefault("image_credit_url", PLACEHOLDER_CRED_URL)
    kw.setdefault("image_needs_replacement", True)
    return kw


NEW_ENTRIES = [
    # 1. Punjab — Amritsari
    E(
        slug="amritsari-biriyani",
        name="Amritsari Biriyani",
        region="Punjab",
        style="Tandoor-touched",
        tagline="Tandoor smoke layered into rice — Punjab's dhaba reading of biriyani.",
        origin=(
            "Amritsar's biriyani rides on the city's dhaba culture and the tandoor: chicken or mutton "
            "is part-roasted in the tandoor before being layered with rice and finished on dum. Less "
            "codified than Lucknowi or Hyderabadi, it's a GT-Road biriyani — built for appetite, "
            "ghee-heavy, smoky from the moment it hits the pot."
        ),
        distinct=(
            "The tandoor pre-roast gives the meat a dry, smoky edge other dum styles don't carry. "
            "Whole spices and a heavy ghee tadka push it closer to a Punjabi pulao with attitude than "
            "to a sealed-handi biriyani."
        ),
        rice="Aged basmati, long grain",
        protein="Chicken or mutton",
        spices=["green cardamom", "clove", "cinnamon", "bay leaf", "ghee", "kashmiri chili", "fried onions"],
        spots=[
            {"name": "Beera Chicken House", "city": "Amritsar"},
            {"name": "Surjit Food Plaza", "city": "Amritsar"},
            {"name": "Crystal Restaurant", "city": "Amritsar"},
        ],
        accent="#a85c2e",
        motifs=["chicken", "saffron", "rice"],
        lineage=["lalla-ki-biriyani", "old-delhi-biriyani"],
        pull_quote="The biriyani that walks out of a tandoor.",
    ),

    # 2. Rajasthan — Jungli Maas
    E(
        slug="jungli-maas-biriyani",
        name="Jungli Maas Biriyani",
        region="Rajasthan",
        style="Royal hunting",
        tagline="Three ingredients, one fire — Rajput hunting-table minimalism.",
        origin=(
            "Jungli maas began as a Rajput hunting-camp dish — meat, Mathania red chillies, salt, "
            "and ghee, cooked over open fire because that's all a hunting party carried. The biriyani "
            "version layers that minimalism with rice and finishes on dum. Heritage hotels in Jaisalmer "
            "and Rohet kept it alive once the hunting culture wound down."
        ),
        distinct=(
            "No onion, no tomato, no warm spice — just chilli, ghee, and meat. The biriyani tastes of "
            "fire and chilli rather than masala, and the rice carries the meat's drippings without "
            "ornament."
        ),
        rice="Aged basmati",
        protein="Mutton (originally game)",
        spices=["mathania chili", "ghee", "rock salt", "garlic"],
        spots=[
            {"name": "Suryagarh", "city": "Jaisalmer"},
            {"name": "Rohet Garh", "city": "Rohet"},
            {"name": "Khimsar Fort", "city": "Khimsar"},
        ],
        accent="#9d2a3a",
        motifs=["chili", "mutton", "rice"],
        lineage=[],
        pull_quote="Three ingredients. One fire. No apologies.",
    ),

    # 3. Andhra — Rayalaseema
    E(
        slug="rayalaseema-biriyani",
        name="Rayalaseema Biriyani",
        region="Andhra Pradesh",
        style="Mess-style spicy",
        tagline="The chilli belt's working-day biriyani — Guntur heat, mess scale.",
        origin=(
            "The Rayalaseema belt — Anantapur, Kurnool, Kadapa, Chittoor — cooks biriyani at the volume "
            "scale of mess kitchens and highway dhabas, with the chilli-forward profile that defines "
            "the region's food. Different from coastal Andhra's gongura and ulavacharu styles, this is "
            "dry-roasted Guntur chilli, oil, and mutton."
        ),
        distinct=(
            "Locally grown Guntur chillies are dry-roasted into the masala paste, not powdered — heat "
            "with smoky depth. The rice is shorter, the gravy is reduced, and refined oil takes ghee's "
            "seat: a working-day biriyani built for appetite."
        ),
        rice="Sona masuri (short grain)",
        protein="Mutton",
        spices=["guntur chili", "dry-roasted coriander", "fennel", "ginger-garlic", "curry leaves", "oil", "mint"],
        spots=[
            {"name": "RR Durbar", "city": "Kurnool"},
            {"name": "Hotel Bheemas", "city": "Anantapur"},
            {"name": "Bay Leaf", "city": "Kurnool"},
        ],
        accent="#b03828",
        motifs=["chili", "mutton", "rice"],
        lineage=["gongura-mutton-biriyani", "ulavacharu-biriyani"],
        pull_quote="Guntur chillies, dry-roasted into the rice itself.",
    ),

    # 4. Karnataka — Mangalorean
    E(
        slug="mangalorean-biriyani",
        name="Mangalorean Biriyani",
        region="Karnataka",
        style="Coastal Karnataka",
        tagline="Curry leaves first, then the chicken — Mangalore's ghee-roast register.",
        origin=(
            "Mangalore's biriyani draws on the region's ghee-roast masala — kashmiri chillies, fried "
            "curry leaves, garlic, and coriander seed — applied to chicken or mutton and layered with "
            "khyma or basmati rice. The Bunt and Mangalorean Catholic restaurant tradition (Hotel "
            "Narayana, Giri Manjas) anchored it in a public idiom from the 1960s onward."
        ),
        distinct=(
            "Fried curry leaves are folded through the rice — smell-first cooking. The masala carries "
            "kokum or vinegar tang on some preparations, marking it apart from Bhatkali's tomato-and-"
            "chilli style."
        ),
        rice="Khyma or basmati",
        protein="Chicken or mutton",
        spices=["kashmiri chili", "curry leaves", "fried onions", "coriander", "ginger-garlic", "ghee", "kokum"],
        spots=[
            {"name": "Hotel Narayana", "city": "Mangalore"},
            {"name": "Giri Manjas", "city": "Mangalore"},
            {"name": "Machali", "city": "Mangalore"},
        ],
        accent="#b85a2a",
        motifs=["chicken", "curry-leaf", "rice"],
        lineage=["bhatkali-navayathi-biriyani", "beary-biriyani"],
        pull_quote="Curry leaves first, then the chicken.",
    ),

    # 5. Karnataka — Dharwad mess
    E(
        slug="dharwad-biriyani",
        name="Dharwad Biriyani",
        region="Karnataka",
        style="North-Karnataka mess",
        tagline="Almost-chocolate masala, mess-hall scale.",
        origin=(
            "Hubli–Dharwad's mess culture cooks biriyani for working-class appetites, distinct from "
            "Bangalore's military-hotel idiom. Mutton-forward and masala-heavy, with a coarser ground "
            "spice mix that gives it a darker tone than Donne or city-Bangalore styles."
        ),
        distinct=(
            "A heavier hand on dry-roasted dhania and kashmiri chili gives Dharwad biriyani its almost-"
            "chocolate-coloured masala. Served at small-town messes through North Karnataka, often with "
            "raita and a thin onion salan."
        ),
        rice="Sona masuri",
        protein="Mutton",
        spices=["kashmiri chili", "dry-roasted coriander", "cumin", "fried onions", "mint", "garam masala"],
        spots=[
            {"name": "Naveen Mess", "city": "Hubli"},
            {"name": "Mahesh Lunch Home", "city": "Hubli"},
            {"name": "Hotel Eshwari", "city": "Dharwad"},
        ],
        accent="#b85a2a",
        motifs=["mutton", "rice", "chili"],
        lineage=["military-hotel-mutton-biriyani", "donne-biriyani"],
        pull_quote="Almost-chocolate masala, mess-hall scale.",
    ),

    # 6. Tamil Nadu — Madurai
    E(
        slug="madurai-biriyani",
        name="Madurai Biriyani",
        region="Tamil Nadu",
        style="Seeraga Samba",
        tagline="More pepper than chilli; more meat than rice.",
        origin=(
            "Madurai's biriyani-kadai tradition fixes the dish in the temple city's hotel and mess "
            "culture. Mutton-heavy and ghee-forward, cooked in seeraga samba — closer to Dindigul than "
            "Ambur in spice register, but with its own Madurai-Muslim community fingerprint that Konar "
            "Mess and Sri Hari Mess have served the same way for decades."
        ),
        distinct=(
            "A higher mutton-to-rice ratio than the Vellore styles, more black pepper than chilli, and "
            "a final tadka of curry leaves and ghee. Order it at Konar Mess and you'll see the proportions."
        ),
        rice="Seeraga samba",
        protein="Mutton",
        spices=["black pepper", "fennel", "cardamom", "clove", "ghee", "curry leaves", "mint"],
        spots=[
            {"name": "Konar Mess", "city": "Madurai"},
            {"name": "Sri Hari Mess", "city": "Madurai"},
            {"name": "Anjappar (original)", "city": "Madurai"},
        ],
        accent="#c98c1a",
        motifs=["seeraga", "mutton", "curry-leaf"],
        lineage=["ambur-biriyani", "dindigul-thalappakatti", "chettinad-biriyani"],
        pull_quote="More pepper than chilli; more meat than rice.",
    ),

    # 7. Kerala — Kannur
    E(
        slug="kannur-biriyani",
        name="Kannur Biriyani",
        region="Kerala",
        style="Malabar (north)",
        tagline="A port-city Malabar with the heat dialled up.",
        origin=(
            "Kannur's biriyani sits in the wider Malabar tradition but with a port-city Muslim-community "
            "hand that runs slightly hotter than Thalassery. Hotel Andros and MVK have served it for "
            "fifty-plus years; the kaima/jeerakasala rice is shared, the masala isn't."
        ),
        distinct=(
            "A fish-and-meat hybrid is common here — chicken or mutton biriyani with a side of mathi "
            "(sardine) curry isn't unusual. The masala leans on coriander seed and shallot more than "
            "the Thalassery sweet-spice register."
        ),
        rice="Khyma / jeerakasala",
        protein="Chicken or mutton",
        spices=["shallot", "coriander", "fennel", "cardamom", "fried cashews", "raisins", "ghee"],
        spots=[
            {"name": "Hotel Andros", "city": "Kannur"},
            {"name": "MVK Restaurant", "city": "Kannur"},
            {"name": "Pranavam", "city": "Kannur"},
        ],
        accent="#1d6e4a",
        motifs=["rice", "chicken", "saffron"],
        lineage=["thalassery-biriyani", "kozhikode-biriyani", "mapilla-biriyani"],
        pull_quote="A port-city Malabar with the heat dialled up.",
    ),

    # 8. Kerala — Beef
    E(
        slug="kerala-beef-biriyani",
        name="Kerala Beef Biriyani",
        region="Kerala",
        style="Cross-community",
        tagline="Beef, coconut oil, curry leaves — Kerala's everyday answer.",
        origin=(
            "Beef has been a working-class everyday meat across Kerala's Christian, Mappila, and Hindu "
            "Ezhava communities for generations. The biriyani version layers slow-cooked beef — coconut "
            "oil, curry leaves, kashmiri chillies, garam masala — with kaima rice. Found from "
            "Trivandrum thattukadas to Christian wedding kitchens in Kottayam."
        ),
        distinct=(
            "Cooked in coconut oil and finished with a curry-leaf tadka, served by communities that "
            "don't share much else. Less mint than Malabar styles; more savoury than aromatic."
        ),
        rice="Khyma / jeerakasala",
        protein="Beef",
        spices=["coconut oil", "curry leaves", "kashmiri chili", "fennel", "coriander", "garam masala", "shallot"],
        spots=[
            {"name": "Rahmaniya Hotel", "city": "Kollam"},
            {"name": "Indian Coffee House", "city": "Thiruvananthapuram"},
            {"name": "Hotel Bismi", "city": "Kozhikode"},
        ],
        accent="#1d6e4a",
        motifs=["mutton", "curry-leaf", "rice"],
        lineage=["thalassery-biriyani", "mapilla-biriyani"],
        pull_quote="Coconut oil, curry leaves, beef — Kerala's everyday answer.",
    ),

    # 9. Bihar — Champaran handi
    E(
        slug="champaran-handi-biriyani",
        name="Champaran Handi Biriyani",
        region="Bihar",
        style="Clay-pot ahuna",
        tagline="Sealed clay, mustard smoke, no rush.",
        origin=(
            "The clay-pot ahuna-meat tradition of Champaran (West Bihar) — meat slow-cooked in a sealed "
            "earthenware handi over coal, with mustard oil, garlic, and dry chillies — has been folded "
            "into a biriyani format over the last fifteen years. Champaran Meat House outlets across "
            "Patna and Delhi popularised it in the 2010s."
        ),
        distinct=(
            "Mustard oil and the sealed clay handi do most of the work — the meat steams in its own "
            "juices for hours, picking up smoke off the pot's lid before the rice is layered on top."
        ),
        rice="Aged basmati",
        protein="Mutton",
        spices=["mustard oil", "dry red chili", "garlic", "garam masala", "bay leaf", "smoked clove"],
        spots=[
            {"name": "Champaran Meat House", "city": "Patna"},
            {"name": "Champaran Handi Mutton", "city": "Patna"},
            {"name": "Bihari Bites", "city": "Patna"},
        ],
        accent="#a87320",
        motifs=["clay-pot", "mutton", "mustard"],
        lineage=["patna-biriyani", "matka-peer-biriyani"],
        pull_quote="Sealed clay, mustard smoke, no rush.",
    ),

    # 10. Telangana — Hyderabadi keema
    E(
        slug="hyderabadi-keema-biriyani",
        name="Hyderabadi Keema Biriyani",
        region="Telangana",
        style="Dum (keema)",
        tagline="Less drama, more depth — the same dum, in mince.",
        origin=(
            "The keema variant of Hyderabadi dum applies the same Asaf Jahi technique to minced mutton "
            "instead of bone-in cuts. Cafe Bahar and Mehfil have kept it on the menu for generations — "
            "usually as a Friday special, when home cooks turn keema into a one-pot meal with rice."
        ),
        distinct=(
            "Minced meat saturates the rice differently from chunks — masala spreads more evenly and "
            "the texture is softer throughout. Less drama, more depth."
        ),
        rice="Aged basmati, long grain",
        protein="Minced mutton",
        spices=["saffron", "fried onions", "green cardamom", "clove", "mint", "ghee", "kewra"],
        spots=[
            {"name": "Cafe Bahar", "city": "Hyderabad"},
            {"name": "Mehfil", "city": "Hyderabad"},
            {"name": "Pista House", "city": "Hyderabad"},
        ],
        accent="#c25a17",
        motifs=["mutton", "rice", "saffron"],
        lineage=["hyderabadi-dum", "hyderabadi-kacchi"],
        pull_quote="The same dum, in mince — softer, evener, just as serious.",
    ),

    # 11. Kerala — Kappa biriyani
    E(
        slug="kappa-biriyani",
        name="Kappa Biriyani",
        region="Kerala",
        style="Tapioca-meat layered",
        tagline="Tapioca where the rice should be — and somehow still biriyani.",
        origin=(
            "Kappa biriyani layers seasoned tapioca with spiced beef or chicken instead of rice — a "
            "Kerala interior tradition that started as a thattukada/late-night dish in central Kerala "
            "(Kottayam, Pala). By the 2010s it was on menus in Kollam and Trivandrum restaurants too."
        ),
        distinct=(
            "There's no rice. Mashed tapioca takes the role, flavoured with green chilli, shallot, and "
            "curry leaves. The biriyani framing is loose, but the layering, the spiced meat, and the "
            "whole-pot service are kept."
        ),
        rice="Mashed tapioca (replaces rice)",
        protein="Beef or chicken",
        spices=["green chili", "shallot", "curry leaves", "mustard seed", "coconut oil", "turmeric"],
        spots=[
            {"name": "Hotel Pala Beef Stall", "city": "Pala"},
            {"name": "Salkara Restaurant", "city": "Kollam"},
            {"name": "Casanova Restaurant", "city": "Kottayam"},
        ],
        accent="#1d6e4a",
        motifs=["tapioca", "mutton", "curry-leaf"],
        lineage=["kerala-beef-biriyani", "thalassery-biriyani"],
        pull_quote="Tapioca where the rice should be — and somehow still biriyani.",
    ),

    # 12. Maharashtra — Tawa biriyani
    E(
        slug="tawa-biriyani",
        name="Tawa Biriyani",
        region="Maharashtra",
        style="Mumbai street finish",
        tagline="No dum, no sealing — the heat is the point.",
        origin=(
            "Mumbai's tawa biriyani is a street-level innovation — par-cooked rice and pre-cooked meat "
            "are tossed and finished on a wide flat tawa instead of being sealed under dum. Bohra and "
            "Memon street stations in Bhendi Bazaar and Crawford Market codified the format from the "
            "1980s onward."
        ),
        distinct=(
            "No dum, no sealing — the tawa's open heat caramelises masala onto rice in real time. The "
            "result is more direct, more charred, and built for street-pace service: ten minutes, plate "
            "up, next."
        ),
        rice="Aged basmati (par-cooked)",
        protein="Chicken or mutton",
        spices=["kashmiri chili", "garam masala", "fried onions", "ghee", "mint", "coriander", "fresh chili"],
        spots=[
            {"name": "Bademiya", "city": "Mumbai (Colaba)"},
            {"name": "Sarvi", "city": "Mumbai (Nagpada)"},
            {"name": "Suleman Usman tawa stations", "city": "Mumbai (Bhendi Bazaar)"},
        ],
        accent="#b04a26",
        motifs=["chicken", "rice", "chili"],
        lineage=["bombay-biriyani", "bohri-biriyani"],
        pull_quote="No dum, no sealing — the heat is the point.",
    ),

    # 13. Maharashtra — Jain biriyani
    E(
        slug="jain-biriyani",
        name="Jain Biriyani",
        region="Maharashtra",
        style="Jain / Marwari",
        tagline="No onion, no garlic, no roots — and yet, all the aroma.",
        origin=(
            "Jain biriyani took shape in Mumbai's Marwari and Jain restaurant kitchens — Soam, Status, "
            "Shree Thaker Bhojanalay — to serve a community that excludes onion, garlic, and root "
            "vegetables. Paneer, jackfruit, and mixed vegetables stand in for the meat; whole spices "
            "and ghee carry the aroma."
        ),
        distinct=(
            "Without onion-garlic, the masala has to be built from whole spices, hing, and ginger "
            "substitutes. The result leans sweet-spice, with saffron and dry fruits doing more heavy "
            "lifting than chilli."
        ),
        rice="Aged basmati",
        protein="Paneer, jackfruit, mixed veg (no onion, garlic, or roots)",
        spices=["saffron", "cardamom", "clove", "cinnamon", "ghee", "dry fruits", "hing", "mint"],
        spots=[
            {"name": "Soam", "city": "Mumbai"},
            {"name": "Status", "city": "Mumbai"},
            {"name": "Shree Thaker Bhojanalay", "city": "Mumbai"},
        ],
        accent="#b04a26",
        motifs=["rice", "saffron", "lemon"],
        lineage=["bombay-biriyani", "surti-bohri-biriyani"],
        pull_quote="No onion, no garlic, no roots — and yet, all the aroma.",
    ),

    # 14. Delhi — Tandoori chicken biriyani
    E(
        slug="tandoori-chicken-biriyani",
        name="Tandoori Chicken Biriyani",
        region="Delhi",
        style="Modern restaurant",
        tagline="Smoke from the tandoor, masala from the handi.",
        origin=(
            "A 1970s–80s Delhi restaurant invention — whole tandoor-charred chicken pieces folded into "
            "a finished biriyani and sealed for a final dum. Moti Mahal's tandoori legacy and the "
            "Connaught Place restaurant boom of that era pushed it onto every Mughlai menu in North "
            "India."
        ),
        distinct=(
            "The chicken's been tandoor-charred before it ever meets rice — so the biriyani carries "
            "actual smoke, not just spice. Less codified than Awadhi or Hyderabadi, but instantly "
            "recognisable."
        ),
        rice="Aged basmati",
        protein="Tandoor-roasted chicken",
        spices=["kashmiri chili", "yogurt marinade", "ginger-garlic", "garam masala", "fenugreek", "fried onions", "mint"],
        spots=[
            {"name": "Moti Mahal", "city": "Delhi (Daryaganj)"},
            {"name": "Karim's", "city": "Delhi (Jama Masjid)"},
            {"name": "Embassy Restaurant", "city": "Delhi (CP)"},
        ],
        accent="#a8462e",
        motifs=["chicken", "chili", "rice"],
        lineage=["old-delhi-biriyani", "nizamuddin-biriyani"],
        pull_quote="Smoke from the tandoor, masala from the handi.",
    ),

    # 15. Delhi — Afghani biriyani
    E(
        slug="afghani-biriyani",
        name="Afghani Biriyani",
        region="Delhi",
        style="Modern restaurant",
        tagline="Cream, cashew, saffron — the biriyani that walks like a pulao.",
        origin=(
            "A modern Delhi-Punjab restaurant style — cream, cashew paste, dry fruits, mild spice — "
            "served as Afghani though distantly related to actual Kabuli pulao. Rose to prominence at "
            "Khyber and Kabul Restaurant, and rode the late-1980s North Indian restaurant boom onto "
            "every wedding menu in the country."
        ),
        distinct=(
            "Cashew-and-cream base instead of fried-onion masala — colour pales toward ivory, spice "
            "retreats, and dry fruits do most of the foreground work. More creamy pulao than dum "
            "biriyani, but it's what menus call it."
        ),
        rice="Aged basmati",
        protein="Chicken (most common) or mutton",
        spices=["cashew paste", "cream", "cardamom", "mace", "saffron", "raisins", "almonds", "mild chili"],
        spots=[
            {"name": "Khyber", "city": "Mumbai / Delhi"},
            {"name": "Kabul Restaurant", "city": "Delhi"},
            {"name": "Afghan Darbar", "city": "Old Delhi"},
        ],
        accent="#a8462e",
        motifs=["chicken", "rice", "rosewater"],
        lineage=["old-delhi-biriyani", "lucknowi-awadhi-biriyani"],
        pull_quote="Cream, cashew, saffron — the biriyani that walks like a pulao.",
    ),
]


# Bidirectional lineage updates: existing slugs that should reference new siblings.
LINEAGE_UPDATES = {
    "lalla-ki-biriyani":              ["amritsari-biriyani"],
    "old-delhi-biriyani":             ["amritsari-biriyani", "tandoori-chicken-biriyani", "afghani-biriyani"],
    "nizamuddin-biriyani":            ["tandoori-chicken-biriyani", "afghani-biriyani"],
    "lucknowi-awadhi-biriyani":       ["afghani-biriyani"],
    "gongura-mutton-biriyani":        ["rayalaseema-biriyani"],
    "ulavacharu-biriyani":            ["rayalaseema-biriyani"],
    "bhatkali-navayathi-biriyani":    ["mangalorean-biriyani"],
    "beary-biriyani":                 ["mangalorean-biriyani"],
    "military-hotel-mutton-biriyani": ["dharwad-biriyani"],
    "donne-biriyani":                 ["dharwad-biriyani"],
    "ambur-biriyani":                 ["madurai-biriyani"],
    "dindigul-thalappakatti":         ["madurai-biriyani"],
    "chettinad-biriyani":             ["madurai-biriyani"],
    "thalassery-biriyani":            ["kannur-biriyani", "kerala-beef-biriyani", "kappa-biriyani"],
    "kozhikode-biriyani":             ["kannur-biriyani"],
    "mapilla-biriyani":                ["kannur-biriyani", "kerala-beef-biriyani"],
    "patna-biriyani":                 ["champaran-handi-biriyani"],
    "matka-peer-biriyani":            ["champaran-handi-biriyani"],
    "hyderabadi-dum":                 ["hyderabadi-keema-biriyani"],
    "hyderabadi-kacchi":              ["hyderabadi-keema-biriyani"],
    "bombay-biriyani":                ["tawa-biriyani", "jain-biriyani"],
    "bohri-biriyani":                 ["tawa-biriyani"],
    "surti-bohri-biriyani":           ["jain-biriyani"],
}


def main():
    entries = json.loads(DATA.read_text())
    by_slug = {e["slug"]: e for e in entries}

    new_slugs = {e["slug"] for e in NEW_ENTRIES}
    skipped = []
    for ne in NEW_ENTRIES:
        if ne["slug"] in by_slug:
            skipped.append(ne["slug"])
            continue
        entries.append(ne)

    # Update lineage on existing entries (unique-merge so re-runs are idempotent).
    for slug, additions in LINEAGE_UPDATES.items():
        target = by_slug.get(slug)
        if not target:
            print(f"  WARN: lineage target {slug!r} not found")
            continue
        existing = target.setdefault("lineage", [])
        for sib in additions:
            if sib not in existing:
                existing.append(sib)

    DATA.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n")
    print(f"Total entries now: {len(entries)}")
    print(f"  added: {len(NEW_ENTRIES) - len(skipped)}")
    if skipped:
        print(f"  skipped (already present): {skipped}")
    print(f"  lineage updates applied to: {len(LINEAGE_UPDATES)} existing entries")


if __name__ == "__main__":
    main()
