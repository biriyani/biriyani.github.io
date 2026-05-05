import { PageHead } from '@/components/PageHead'

export function About() {
  return (
    <main className="container-page">
      <PageHead
        title="About — Biriyani"
        description="Why this exists: most of the world knows one biriyani. India knows hundreds. This is an editorial archive of regional dialects."
        url="https://biriyani.github.io/about"
      />
      <section className="reveal mx-auto max-w-2xl pt-12 pb-24 md:pt-20">
        <span className="kicker">Why this exists</span>
        <h1 className="mt-3 font-serif">
          Most of the world knows one biriyani. India knows hundreds.
        </h1>
        <div className="prose-editorial mt-8 space-y-5">
          <p>
            Travel five hundred kilometres in this country and the rice changes,
            the cuts change, the spice profile changes, even the cooking
            vessel changes. A single word — <em>biriyani</em> — covers a
            saffron-laced Awadhi dum, a black-pepper Dindigul, a kokum-tinged
            Konkan fish biriyani, a bamboo roast in coastal Andhra. They are not
            variations of one dish. They are <em>parallel</em> dishes that
            happen to share a name and a love of long-grained rice.
          </p>
          <p>
            This atlas exists to give those parallels a place to live — an
            editorial archive rather than a recipe site. Each entry is a small
            essay: what the dish is, where it came from, what makes it unmistakable,
            and which restaurants are still cooking it the way it's supposed to
            be cooked. The map is the index. The motifs are mnemonic. The
            search is for when you only remember the spice.
          </p>
          <p>
            Many of the photographs are from independent food blogs, restaurants
            on Google Maps, TripAdvisor, and Zomato — credited via hyperlink at
            the bottom of each detail page. Where a unique photo can't yet be
            sourced for a variety, the page renders an illustrated motif card
            instead — accent-coloured, ingredient-keyed, never reused.
          </p>
          <p>
            Corrections, additions, and a better photo for an entry are all
            welcome. The data file is a single JSON document; pull requests are
            the easiest way in.
          </p>
        </div>
      </section>
    </main>
  )
}
