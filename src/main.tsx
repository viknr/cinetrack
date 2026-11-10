import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const resetMarker = 'cinetrack-reset-v1-complete'
if (window.localStorage.getItem(resetMarker) !== 'true') {
  for (const key of Object.keys(window.localStorage)) {
    if (key.startsWith('cinetrack')) window.localStorage.removeItem(key)
  }
  window.localStorage.setItem(resetMarker, 'true')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
