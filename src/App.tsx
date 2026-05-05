import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { Footer, Nav } from '@/components/Nav'
import { Index } from '@/pages/Index'
import { Detail } from '@/pages/Detail'
import { Compare } from '@/pages/Compare'
import { About } from '@/pages/About'
import { NotFound } from '@/pages/NotFound'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void
  }
}

function GAPageView() {
  const location = useLocation()
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
  }, [location])
  return null
}

// Reset the window scroll on every forward navigation (PUSH/REPLACE) so
// detail pages always open from the top — including links from the
// "Also from {region}" trio at the bottom of another detail page. POP
// (browser back/forward) keeps its native scroll-restoration. Hash links
// also pass through so anchor jumps still work.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    if (navType === 'POP') return
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash, navType])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <GAPageView />
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/b/:slug" element={<Detail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
