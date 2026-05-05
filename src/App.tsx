import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
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

export default function App() {
  return (
    <>
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
