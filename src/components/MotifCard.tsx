import type { Biriyani } from '@/data/types'
import { MotifIcon } from '@/lib/motifs'
import { cn } from '@/lib/utils'

type Variant = 'card' | 'hero' | 'mini'

const sizes: Record<Variant, { box: string; iconBox: string; iconSize: number; titleSize: string }> = {
  card: {
    box: 'aspect-[4/3] p-5 gap-3',
    iconBox: 'gap-3',
    iconSize: 38,
    titleSize: 'text-2xl',
  },
  hero: {
    box: 'aspect-[16/8] p-10 gap-6',
    iconBox: 'gap-7',
    iconSize: 92,
    titleSize: 'text-5xl md:text-6xl',
  },
  mini: {
    box: 'aspect-[4/3] p-3 gap-2',
    iconBox: 'gap-2',
    iconSize: 22,
    titleSize: 'text-base',
  },
}

export function MotifCard({
  entry,
  variant = 'card',
  className,
}: {
  entry: Biriyani
  variant?: Variant
  className?: string
}) {
  const cfg = sizes[variant]
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl flex flex-col justify-between',
        cfg.box,
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${entry.accent} 0%, ${entry.accent}cc 60%, ${entry.accent}99 100%)`,
        color: '#fffaf0',
      }}
      aria-label={`Illustration motif representing ${entry.name}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 18%, rgba(255,255,255,.55), transparent 32%), radial-gradient(circle at 82% 78%, rgba(0,0,0,.35), transparent 36%)',
        }}
      />
      <div className={cn('flex items-end justify-start relative', cfg.iconBox)}>
        {entry.motifs.slice(0, 3).map((m) => (
          <MotifIcon
            key={m}
            slug={m}
            width={cfg.iconSize}
            height={cfg.iconSize}
            style={{ color: '#fffaf0', opacity: 0.9 }}
          />
        ))}
      </div>
      <div className="relative">
        <div
          className="font-sans text-[0.62rem] tracking-[0.22em] uppercase opacity-80 mb-1"
          style={{ color: '#fffaf0' }}
        >
          {entry.region}
        </div>
        <div
          className={cn('font-serif leading-[1.05]', cfg.titleSize)}
          style={{ color: '#fffaf0' }}
        >
          {entry.name.replace(/\s*Biriyani\s*$/i, '')}
        </div>
      </div>
    </div>
  )
}

export function MotifBadge({ motifs, color }: { motifs: string[]; color?: string }) {
  return (
    <div
      className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-cream/90 px-2 py-1.5 backdrop-blur-sm shadow-paper"
      style={{ color: color ?? 'var(--color-saffron)' }}
    >
      {motifs.slice(0, 3).map((m) => (
        <MotifIcon key={m} slug={m} width={14} height={14} strokeWidth={1.7} />
      ))}
    </div>
  )
}
