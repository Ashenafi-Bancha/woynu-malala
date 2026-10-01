import { startTransition, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n'
import './index.css'

// Loaded by the small bootstrap script in index.html, after the static hero has painted.
// Rendering inside a transition lets React work in short slices, so the first render
// does not freeze a slow phone; the static hero stays on screen until it is ready.
const root = createRoot(document.getElementById('root')!)
startTransition(() => {
  root.render(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>,
  )
})
