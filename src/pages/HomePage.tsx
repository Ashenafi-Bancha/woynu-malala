import { lazy, startTransition, Suspense, useEffect, useState } from 'react'
import { Hero } from '../components/Hero'
import { Seo } from '../components/Seo'
import { whenIdle } from '../lib/device'

const HomeSections = lazy(() => import('./HomeSections'))

// After the first visit the sections render straight away, so going "back" to the home
// page can restore the scroll position.
let sectionsShownBefore = false

export function HomePage() {
  const [showSections, setShowSections] = useState(sectionsShownBefore)

  // First load: get the hero on screen, then render the rest in small slices so the
  // phone stays responsive (a transition lets React pause between chunks of work).
  useEffect(() => {
    if (showSections) return
    return whenIdle(() => {
      sectionsShownBefore = true
      startTransition(() => setShowSections(true))
    }, 1200)
  }, [showSections])

  return (
    <>
      <Seo path="/" />
      <Hero />
      {showSections ? (
        <Suspense fallback={<div className="min-h-screen bg-ink" />}>
          <HomeSections />
        </Suspense>
      ) : (
        // Holds the page height so the footer is not briefly visible under the hero
        <div className="min-h-screen bg-ink" />
      )}
    </>
  )
}
