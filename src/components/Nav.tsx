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
    <header className="container-page flex items-center justify-between py-7">
      <Link to="/" className="font-serif text-2xl tracking-tight text-bark">
        Biri<span className="text-saffron">yani</span>
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        <NavItem to="/">Index</NavItem>
        <NavItem to="/compare">Compare</NavItem>
        <NavItem to="/about">About</NavItem>
        <button
          type="button"
          onClick={surprise}
          className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-saffron px-3.5 py-1.5 text-sm font-medium text-cream transition-colors hover:bg-bark"
          aria-label="Open a random biriyani"
        >
          <Dices size={14} strokeWidth={2.2} />
          <span>Surprise me</span>
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
        `rounded-full px-3 py-1.5 transition-colors ${
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
          — a community for Indian builders.{' '}
          <Link to="/about" className="underline-offset-4 hover:underline">
            About the project
          </Link>
          .
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
