import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { canRender3D, hasFinePointer, remember3DFallback, whenIdle } from '../lib/device'
import type { PageSceneVariant } from './hero/PageScene'

// three.js, React Three Fiber and Vanta live in their own chunks, fetched only on
// capable devices once the page is idle.
const PageScene = lazy(() => import('./hero/PageScene'))
const VantaWaves = lazy(() => import('./hero/VantaWaves'))

export type BackdropScene = PageSceneVariant | 'waves'

/** If WebGL fails to start (or the 3D chunk fails to load), show nothing instead of crashing. */
export class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

type Backdrop3DProps = {
  scene?: BackdropScene
  /** Image URLs for the `ring` scene */
  photos?: string[]
  /** Positioning for the backdrop box; defaults to filling its (relative) parent */
  className?: string
  /** Set false when the page already darkens the area behind its text */
  overlay?: boolean
}

/**
 * A living 3D scene behind a page's opening. Low-end phones, data-saver and
 * reduced-motion visitors keep the plain dark header.
 */
export function Backdrop3D({ scene = 'ribbons', photos, className = 'absolute inset-0', overlay = true }: Backdrop3DProps) {
  const box = useRef<HTMLDivElement>(null)
  const [use3D, setUse3D] = useState(false)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (!canRender3D()) return
    let timer = 0
    const cancelIdle = whenIdle(() => {
      timer = window.setTimeout(() => setUse3D(true), hasFinePointer() ? 150 : 1200)
    })
    return () => {
      cancelIdle()
      window.clearTimeout(timer)
    }
  }, [])

  // Stop rendering frames when the scene is off screen or the tab is hidden.
  useEffect(() => {
    const el = box.current
    if (!el) return
    let inView = true
    const update = () => setActive(inView && document.visibilityState === 'visible')
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const tooSlow = () => {
    remember3DFallback()
    setUse3D(false)
    setReady(false)
  }

  return (
    <div ref={box} aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      {use3D ? (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <SceneBoundary onError={tooSlow}>
            <Suspense fallback={null}>
              {scene === 'waves' ? (
                <VantaWaves onReady={() => setReady(true)} />
              ) : (
                <PageScene variant={scene} photos={photos} active={active} onReady={() => setReady(true)} onTooSlow={tooSlow} />
              )}
            </Suspense>
          </SceneBoundary>
        </div>
      ) : null}
      {/* Keeps the title readable and melts the scene into the page below */}
      {overlay ? (
        <>
          <div className="absolute inset-0 bg-linear-to-b from-ink/75 via-ink/65 to-ink lg:bg-linear-to-r lg:from-ink lg:via-ink/60 lg:to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-ink" />
        </>
      ) : null}
    </div>
  )
}
