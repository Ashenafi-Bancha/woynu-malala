import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { hasFinePointer, prefersReducedMotion } from '../lib/device'

// Site-wide interaction effects, shared by phones and computers:
//   – a brief glow and sparks wherever the visitor taps or clicks
//   – buttons that lean toward the mouse (computers)
//   – a soft fade from one page to the next
//   – a glowing "back to top" button that fills as the page is scrolled

const SPARKS = 7
const COVER_MS = 260

/** Glow + sparks at the point of every tap or click. */
function useTapBurst(layer: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const onDown = (e: PointerEvent) => {
      const host = layer.current
      // Never let a fast run of taps pile up elements
      if (!host || host.childElementCount > 5) return
      const burst = document.createElement('span')
      burst.className = 'tap-burst'
      burst.style.left = `${e.clientX}px`
      burst.style.top = `${e.clientY}px`
      const turn = Math.random() * 360
      for (let i = 0; i < SPARKS; i++) {
        const spark = document.createElement('i')
        spark.style.setProperty('--angle', `${turn + (360 / SPARKS) * i}deg`)
        spark.style.setProperty('--reach', `${34 + Math.random() * 30}px`)
        burst.appendChild(spark)
      }
      host.appendChild(burst)
      window.setTimeout(() => burst.remove(), 750)
    }
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => window.removeEventListener('pointerdown', onDown)
  }, [layer])
}

/** Computers: buttons lean toward the mouse while it is over them. */
function useMagneticButtons() {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    let pulled: HTMLElement | null = null
    const release = () => {
      pulled?.style.removeProperty('--mx')
      pulled?.style.removeProperty('--my')
      pulled = null
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const button = (e.target as Element | null)?.closest?.<HTMLElement>('.btn-fx') ?? null
      if (button !== pulled) release()
      if (button) {
        const r = button.getBoundingClientRect()
        button.style.setProperty('--mx', `${((e.clientX - (r.left + r.width / 2)) * 0.22).toFixed(1)}px`)
        button.style.setProperty('--my', `${((e.clientY - (r.top + r.height / 2)) * 0.32).toFixed(1)}px`)
        pulled = button
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', release)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', release)
      release()
    }
  }, [])
}

/**
 * Page-to-page transition. A click on an internal link first fades the page out to the dark
 * page colour, then opens the new page; the veil in Layout then fades away to reveal it.
 */
function usePageCover(cover: React.RefObject<HTMLDivElement | null>) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // The new page has arrived: drop the cover at once (Layout's veil is already in its place)
  useEffect(() => {
    const el = cover.current
    if (!el) return
    el.style.transition = 'none'
    el.classList.remove('is-on')
    const frame = requestAnimationFrame(() => el.style.removeProperty('transition'))
    return () => cancelAnimationFrame(frame)
  }, [pathname, cover])

  useEffect(() => {
    if (prefersReducedMotion()) return
    let timer = 0
    let safety = 0
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]')
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return
      if (url.pathname.startsWith('/api/') || /\.[a-z0-9]+$/i.test(url.pathname)) return

      // React Router's own link handler sees the event as handled and stands back
      e.preventDefault()
      const el = cover.current
      if (!el || el.classList.contains('is-on')) return
      el.classList.add('is-on')
      window.clearTimeout(timer)
      window.clearTimeout(safety)
      timer = window.setTimeout(() => navigate(url.pathname + url.search + url.hash), COVER_MS)
      // If the next page never arrives, don't leave the screen covered
      safety = window.setTimeout(() => el.classList.remove('is-on'), 6000)
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.clearTimeout(timer)
      window.clearTimeout(safety)
    }
  }, [navigate, cover])
}

/** Round button, bottom right: its gold ring fills with scroll progress; tap to glide to the top. */
function BackToTop() {
  const { t } = useI18n()
  const ring = useRef<SVGCircleElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      ring.current?.style.setProperty('stroke-dashoffset', String(1 - progress))
      setShown(window.scrollY > 500)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button
      type="button"
      aria-label={t('common.toTop')}
      tabIndex={shown ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
      className={`to-top fixed bottom-5 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-ink/85 text-gold backdrop-blur-sm transition duration-500 md:bottom-8 md:right-8 ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        <circle
          ref={ring}
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          strokeLinecap="round"
        />
      </svg>
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M12 19V5m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

export function Interactions() {
  const layer = useRef<HTMLDivElement>(null)
  const cover = useRef<HTMLDivElement>(null)
  useTapBurst(layer)
  useMagneticButtons()
  usePageCover(cover)

  return (
    <>
      <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[75] overflow-hidden" />
      <div ref={cover} aria-hidden="true" className="page-cover" />
      <BackToTop />
    </>
  )
}
