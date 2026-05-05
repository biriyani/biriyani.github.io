import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

// Strip prerendered SEO tags so react-helmet-async owns the head once React
// mounts. The static HTML keeps these tags for crawlers (which never run this
// script); SPA users get a clean, single set of tags after hydration.
document.head.querySelectorAll('[data-rh="true"]').forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
