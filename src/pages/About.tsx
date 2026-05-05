import { ArrowUpRight } from 'lucide-react'
import { PageHead } from '@/components/PageHead'

const REPO = 'https://github.com/biriyani/biriyani.github.io'
const DATA_FILE = `${REPO}/blob/main/src/data/biriyani.json`
const NEW_ISSUE = `${REPO}/issues/new`
const IMAGES_TO_REPLACE = `${REPO}/blob/main/IMAGES_TO_REPLACE.md`

function GithubMark({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.13v3.16c0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/>
    </svg>
  )
}

export function About() {
  return (
    <main className="container-page">
      <PageHead
        title="About — Biriyani"
        description="Why this exists: most of the world knows one biriyani. India knows hundreds. An editorial archive of regional dialects — what each one is, where it comes from, and what makes it unmistakable."
        url="https://biriyani.wiki/about"
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
            This archive exists to give those parallels a place to live — an
            editorial reference rather than a recipe site. Each entry is a small
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
        </div>

        <section className="mt-14 rounded-2xl border border-line bg-paper p-7">
          <span className="kicker">Contribute</span>
          <h2 className="mt-2 font-serif text-2xl text-bark">
            Got a correction, a better photo, or a dialect we missed?
          </h2>
          <p className="mt-3 text-bark-soft">
            The whole archive lives on GitHub as a single JSON file. No forms,
            no email — open an issue or send a pull request and it lands here
            on the next deploy.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={REPO}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-bark px-4 py-2 text-sm font-medium text-cream hover:bg-saffron"
            >
              <GithubMark size={14} />
              View on GitHub
              <ArrowUpRight size={14} strokeWidth={2.2} />
            </a>
            <a
              href={DATA_FILE}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-cream-soft px-4 py-2 text-sm text-bark hover:border-saffron"
            >
              Browse the data file
              <ArrowUpRight size={12} strokeWidth={2.2} />
            </a>
            <a
              href={NEW_ISSUE}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-cream-soft px-4 py-2 text-sm text-bark hover:border-saffron"
            >
              Open an issue
              <ArrowUpRight size={12} strokeWidth={2.2} />
            </a>
            <a
              href={IMAGES_TO_REPLACE}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-cream-soft px-4 py-2 text-sm text-bark hover:border-saffron"
            >
              Help us replace generic photos
              <ArrowUpRight size={12} strokeWidth={2.2} />
            </a>
          </div>
        </section>

        <hr className="my-12 border-line" />

        <p className="text-bark-soft">
          A project by{' '}
          <a
            href="https://samooh.com/?ref=biriyani.wiki"
            target="_blank"
            rel="noopener"
            className="font-medium text-bark underline underline-offset-4 decoration-saffron decoration-2"
          >
            Samooh
          </a>{' '}
          — a community for Indian builders.
        </p>
      </section>
    </main>
  )
}
