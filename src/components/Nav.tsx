import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Dices } from 'lucide-react'
import { BIRIYANIS } from '@/data/types'

export function Nav() {
  const navigate = useNavigate()
  const surprise = () => {
    const pick = BIRIYANIS[Math.floor(Math.random() * BIRIYANIS.length)]
    navigate(`/b/${pick.slug}`)
  }
  return (
    <header className="container-page flex items-center justify-between gap-2 py-5 sm:py-7">
      <Link to="/" className="font-serif text-xl tracking-tight text-bark sm:text-2xl">
        Biriyani
      </Link>
      <nav className="flex items-center gap-0.5 text-sm sm:gap-1">
        <NavItem to="/">Index</NavItem>
        <NavItem to="/compare">Compare</NavItem>
        <NavItem to="/about">About</NavItem>
        <button
          type="button"
          onClick={surprise}
          className="ml-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-saffron p-2 text-cream transition-colors hover:bg-bark sm:ml-2 sm:px-3.5 sm:py-1.5 sm:text-sm sm:font-medium"
          aria-label="Open a random biriyani"
        >
          <Dices size={14} strokeWidth={2.2} />
          <span className="hidden sm:inline">Surprise me</span>
        </button>
      </nav>
    </header>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `rounded-full px-2 py-1 text-[0.78rem] transition-colors sm:px-3 sm:py-1.5 sm:text-sm ${
          isActive ? 'bg-cream-soft text-bark' : 'text-bark-soft hover:text-bark'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Footer() {
  return (
    <footer className="container-page mt-24 border-t border-line py-8 text-xs text-bark-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          A project by{' '}
          <a
            href="https://samooh.com/?ref=biriyani.wiki"
            target="_blank"
            rel="noopener"
            className="font-medium text-bark underline-offset-4 hover:underline"
          >
            Samooh
          </a>{' '}
          — a community for Indian builders.
        </p>
        <p className="opacity-70">
          State boundaries:{' '}
          <a
            href="https://github.com/datameet/maps"
            className="underline-offset-4 hover:underline"
            target="_blank"
            rel="noopener"
          >
            DataMeet
          </a>{' '}
          · CC-BY 4.0
        </p>
      </div>
    </footer>
  )
}
