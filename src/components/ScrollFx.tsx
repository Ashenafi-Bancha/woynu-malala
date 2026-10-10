import { useEffect, useRef, type ReactNode } from 'react'
import type { Collection } from '../content/types'
import { prefersReducedMotion } from '../lib/device'
import { loadGsap } from '../lib/gsap'
import { CollectionGrid } from './CollectionCard'

/** Thin woven line (red, black, yellow) across the top of the screen that fills as the page is scrolled. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={bar} className="progress-weave h-full origin-left scale-x-0" />
    </div>
  )
}

/** Endless band of text that glides sideways. The content is repeated so the loop is seamless. */
export function Marquee({ children, reverse = false, className = '' }: { children: ReactNode; reverse?: boolean; className?: string }) {
  return (
    <div className={`flex overflow-hidden ${className}`}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={`marquee-track flex shrink-0 items-center ${reverse ? 'marquee-reverse' : ''}`}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

/**
 * Text whose words light up one after another as it scrolls through the screen.
 * Without motion (or before GSAP loads) the text is simply fully visible.
 */
export function ScrubText({ text, className = '' }: { text: string; className?: string }) {
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = el.current
    if (!node || prefersReducedMotion()) return
    let kill = () => {}
    let cancelled = false
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const { gsap } = await loadGsap()
        if (cancelled) return
        const tween = gsap.fromTo(
          node.querySelectorAll('[data-word]'),
          { opacity: 0.14 },
          { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: node, start: 'top 82%', end: 'bottom 45%', scrub: true } },
        )
        kill = () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(node)
    return () => {
      cancelled = true
      io.disconnect()
      kill()
    }
  }, [text])

  return (
    <span ref={el} className={className}>
      {text.split(/\s+/).map((word, i) => (
        <span key={i} data-word className="inline-block">
          {word}
          {' '}
        </span>
      ))}
    </span>
  )
}

/** The collections under their heading, all visible at once in a grid that wraps into rows. */
export function HorizontalCollections({ collections, heading }: { collections: Collection[]; heading: ReactNode }) {
  return (
    <section className="bg-ink">
      <div className="px-5 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">{heading}</div>
      <CollectionGrid collections={collections} />
    </section>
  )
}
