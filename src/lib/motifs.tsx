import type { SVGProps } from 'react'

type MotifProps = SVGProps<SVGSVGElement>

const base = (props: MotifProps) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export function RiceGrain(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="8" cy="9" rx="2.4" ry="4.6" transform="rotate(-22 8 9)" />
      <ellipse cx="14" cy="14" rx="2.4" ry="4.6" transform="rotate(28 14 14)" />
      <ellipse cx="17" cy="6.5" rx="1.8" ry="3.6" transform="rotate(40 17 6.5)" />
    </svg>
  )
}

export function Saffron(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3c-2 4-4 7-4 11 0 4 2 7 4 7s4-3 4-7c0-4-2-7-4-11Z" />
      <path d="M12 6v15" />
      <path d="M9 11c1.4 1 4.6 1 6 0" />
    </svg>
  )
}

export function Hilsa(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12c2-4 5-6 9-6s7 2 9 6c-2 4-5 6-9 6s-7-2-9-6Z" />
      <path d="M21 12l2-3v6l-2-3Z" />
      <circle cx="8" cy="11" r="0.6" fill="currentColor" />
      <path d="M11 12c1 0 2-.4 3-1" opacity=".55" />
    </svg>
  )
}

export function Mutton(props: MotifProps) {
  // Stylised lamb-leg roast.
  return (
    <svg {...base(props)}>
      <path d="M6 14c-1 1.5-1 3 .5 4s3 .4 3.5-1c.4 1.4 2 2 3.5 1s1.5-2.5.5-4" />
      <path d="M10 13c-1.5-1.4-1.5-4 0-5.5s4-1.5 5.5 0c1 1 1.2 3.4 2.5 4l-3 1c-1.5 1-3 1-5 .5Z" />
      <path d="M16 7l2-2" />
    </svg>
  )
}

export function Chicken(props: MotifProps) {
  // Drumstick.
  return (
    <svg {...base(props)}>
      <path d="M14.5 4c2.5 0 4.5 2 4.5 4.5 0 2-1.5 3.4-3 3.8l-1 1L9 19c-1.5 1.5-4 1-4.5-1s1-3.4 2.5-3l1-1 4.7-4.7c.4-1.5 1.8-3 3.8-3.3Z" />
      <circle cx="7" cy="17" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function Prawn(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 12c0-3 2-5 5-5h6c3 0 5 2 5 5 0 4-3 7-7 7-3 0-5-2-5-4l-2-1Z" />
      <path d="M7 7l-2-3" />
      <path d="M9 7l-1-3" />
      <circle cx="14" cy="11" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function Egg(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="12" cy="13" rx="6" ry="8" />
    </svg>
  )
}

export function GonguraLeaf(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3c-1 4-4 7-7 8 1 5 5 9 7 10 2-1 6-5 7-10-3-1-6-4-7-8Z" />
      <path d="M12 3v18" />
      <path d="M7 11l10 0" opacity=".5" />
    </svg>
  )
}

export function BananaLeaf(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 18c2-9 8-14 16-14-1 8-6 14-15 15Z" />
      <path d="M4 18c4-3 8-7 14-12" opacity=".55" />
    </svg>
  )
}

export function Bamboo(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="3" width="6" height="18" rx="2.5" />
      <path d="M9 9h6M9 14h6" />
      <path d="M5 5l3 2M5 12l3 1M19 18l-3 1" opacity=".55" />
    </svg>
  )
}

export function ClayPot(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 11c0-2.5 3-4 7-4s7 1.5 7 4v3c0 3.5-3 6-7 6s-7-2.5-7-6v-3Z" />
      <path d="M7 7c2-1 8-1 10 0" />
      <path d="M9 16h6" opacity=".55" />
    </svg>
  )
}

export function Lemon(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="12" cy="12" rx="7" ry="5.5" transform="rotate(-22 12 12)" />
      <path d="M5 6l2 2M19 18l-2-2" />
    </svg>
  )
}

export function Tamarind(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 7c4-3 11-3 14 1-1 6-5 11-12 12-3-3-3-9-2-13Z" />
      <circle cx="9" cy="13" r="0.6" fill="currentColor" />
      <circle cx="13" cy="11" r="0.6" fill="currentColor" />
      <circle cx="14" cy="15" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function Tomato(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="14" r="6" />
      <path d="M9 8c1-1 2-1.5 3-1.5s2 .5 3 1.5" />
      <path d="M12 6.5V4" />
    </svg>
  )
}

export function Mustard(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="10" r="1.6" />
      <circle cx="15" cy="9" r="1.6" />
      <circle cx="12" cy="14" r="1.6" />
      <circle cx="8" cy="16" r="1.6" />
      <circle cx="16" cy="15" r="1.6" />
    </svg>
  )
}

export function Chili(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 18c0-7 5-12 13-13-1 7-6 13-13 13Z" />
      <path d="M16 5c1-1 2-2 4-2-.5 2-1 3-2 4" />
    </svg>
  )
}

export function Rosewater(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4c-3 5-5 8-5 11a5 5 0 0010 0c0-3-2-6-5-11Z" />
      <path d="M9 14c0 2 1.5 3 3 3" opacity=".55" />
    </svg>
  )
}

export function Turmeric(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 16c4-4 9-9 13-12" />
      <path d="M9 12c1.5 1.5 4 1.5 5.5 0" />
      <path d="M6 15c1.5 1.5 4 1.5 5.5 0" />
    </svg>
  )
}

export function Seeraga(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="7" cy="14" rx="1.4" ry="3" transform="rotate(-25 7 14)" />
      <ellipse cx="12" cy="11" rx="1.4" ry="3" transform="rotate(15 12 11)" />
      <ellipse cx="17" cy="14" rx="1.4" ry="3" transform="rotate(-35 17 14)" />
      <ellipse cx="14" cy="17" rx="1.4" ry="3" transform="rotate(40 14 17)" />
    </svg>
  )
}

export function Tapioca(props: MotifProps) {
  // Stylised tapioca / cassava root.
  return (
    <svg {...base(props)}>
      <path d="M9 4c-1 3 0 6 1.5 8 2 2.6 2 4.5 1 7-1.2 3 .5 5 3 4 2-.8 3-3 2.5-5.5-.5-2 .5-4 2-5.5 1.7-1.6 2-4 0-6-1.6-1.5-4-1.6-5.5-1.5-1.5.1-3.4-.5-4.5-.5Z" />
      <path d="M11 9c1 1.5 1 3 0 4.5" opacity=".55" />
      <path d="M14 16c1 .5 2 1 2.5 2" opacity=".55" />
    </svg>
  )
}

export function CurryLeaf(props: MotifProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4 L12 21" />
      <path d="M12 7 C 9 8 7 9 6 11 C 8 11.5 10 11 12 10" />
      <path d="M12 10 C 15 9 17 9 18 11 C 16 11.5 14 11 12 12" />
      <path d="M12 13 C 9 13.5 7.5 14 6.5 16 C 8.5 16.5 10 16 12 15" />
      <path d="M12 15 C 15 14.5 16.5 15 17.5 17 C 15.5 17.5 14 17 12 17" />
    </svg>
  )
}

export const MOTIFS: Record<string, (p: MotifProps) => React.JSX.Element> = {
  rice: RiceGrain,
  saffron: Saffron,
  hilsa: Hilsa,
  mutton: Mutton,
  chicken: Chicken,
  prawn: Prawn,
  egg: Egg,
  'gongura-leaf': GonguraLeaf,
  'banana-leaf': BananaLeaf,
  bamboo: Bamboo,
  'clay-pot': ClayPot,
  lemon: Lemon,
  tamarind: Tamarind,
  tomato: Tomato,
  mustard: Mustard,
  chili: Chili,
  rosewater: Rosewater,
  turmeric: Turmeric,
  seeraga: Seeraga,
  tapioca: Tapioca,
  'curry-leaf': CurryLeaf,
}

export function MotifIcon({ slug, ...props }: { slug: string } & MotifProps) {
  const Comp = MOTIFS[slug] ?? MOTIFS.rice
  return <Comp {...props} />
}
