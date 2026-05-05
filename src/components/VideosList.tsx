import { Play } from 'lucide-react'
import type { Video } from '@/data/types'
import { youtubeThumb } from '@/lib/youtube'

export function VideosList({ videos, accent }: { videos: Video[]; accent: string }) {
  if (!videos.length) return null
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => {
        const thumb = youtubeThumb(v.url)
        return (
          <li key={v.url}>
            <a
              href={v.url}
              target="_blank"
              rel="noopener"
              className="group block overflow-hidden rounded-2xl border border-line bg-paper shadow-paper transition-colors hover:border-saffron"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-bark/10">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={v.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-bark-soft">
                    <Play size={28} strokeWidth={1.6} />
                  </div>
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-bark/85 text-cream shadow-card-hover transition-transform group-hover:scale-105"
                    style={{ borderColor: accent }}
                  >
                    <Play size={18} strokeWidth={2.2} fill="currentColor" />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div
                  className="mb-1 text-[0.7rem] uppercase tracking-[0.16em]"
                  style={{ color: accent }}
                >
                  {v.channel ? v.channel : 'Watch'}
                </div>
                <p className="font-serif text-lg leading-snug text-bark">{v.title}</p>
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
