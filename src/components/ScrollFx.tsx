import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Collection } from '../content/types'
import { prefersReducedMotion } from '../lib/device'
import { loadGsap } from '../lib/gsap'
import { CollectionCard, CollectionGrid } from './CollectionCard'

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

const canPinSideways = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches && !prefersReducedMotion()

/**
 * Collections as a pinned sideways scroll: the page holds still and the cards travel
 * across. Phones, tablets and reduced-motion users get the normal grid.
 */
export function HorizontalCollections({ collections, heading }: { collections: Collection[]; heading: ReactNode }) {
  const [sideways] = useState(canPinSideways)
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sideways || !section.current) return
    let kill = () => {}
    let cancelled = false
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const { gsap } = await loadGsap()
        if (cancelled || !section.current || !track.current) return
        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth)
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        kill = () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      },
      { rootMargin: '800px 0px' },
    )
    io.observe(section.current)
    return () => {
      cancelled = true
      io.disconnect()
      kill()
    }
  }, [sideways])

  if (!sideways) {
    return (
      <section className="bg-ink">
        <div className="px-5 pb-12 pt-20 md:px-10 md:pb-16 md:pt-28">{heading}</div>
        <CollectionGrid collections={collections} />
      </section>
    )
  }

  return (
    <section ref={section} className="relative flex h-screen flex-col justify-center overflow-hidden bg-ink">
      <div className="px-10 pb-8 pt-24">{heading}</div>
      <div ref={track} className="flex w-max gap-10 px-10 pb-6 will-change-transform">
        {collections.map((c, i) => (
          // Cards are 4:5, so their width is capped by the height left under the heading
          <div key={c.id} className="shrink-0" style={{ width: 'min(27vw, 24rem, calc((100vh - 21rem) * 0.8))' }}>
            <CollectionCard collection={c} index={i} />
          </div>
        ))}
        {/* Breathing room so the last card can reach the middle of the screen */}
        <div aria-hidden="true" className="w-[20vw] shrink-0" />
      </div>
    </section>
  )
}
