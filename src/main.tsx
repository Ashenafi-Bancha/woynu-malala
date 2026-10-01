import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n'
import './index.css'

function start() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>,
  )
}

// index.html already contains a static copy of the hero text. Give the browser one frame
// to paint it before React takes over, so visitors see the page before the app boots.
// (The timeout covers background tabs, where animation frames do not fire.)
let started = false
const startOnce = () => {
  if (started) return
  started = true
  start()
}
requestAnimationFrame(() => setTimeout(startOnce, 0))
setTimeout(startOnce, 400)
