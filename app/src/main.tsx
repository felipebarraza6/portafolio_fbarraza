import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Restaura rutas limpias redirigidas por public/404.html en GitHub Pages antes de montar BrowserRouter.
;(function restoreSpaRoute() {
  const params = new URLSearchParams(window.location.search)
  const redirectedPath = params.get('p')
  if (!redirectedPath) return
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  const normalizedPath = redirectedPath.startsWith('/') ? redirectedPath : `/${redirectedPath}`
  const originalQuery = params.get('q')
  const search = originalQuery ? `?${originalQuery}` : ''
  window.history.replaceState(null, '', `${base}${normalizedPath}${search}${window.location.hash}`)
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
