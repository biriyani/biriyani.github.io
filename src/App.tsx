import { Route, Routes } from 'react-router-dom'
import { Footer, Nav } from '@/components/Nav'
import { Index } from '@/pages/Index'
import { Detail } from '@/pages/Detail'
import { Compare } from '@/pages/Compare'
import { About } from '@/pages/About'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  return (
    <>
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
