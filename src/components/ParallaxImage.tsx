import { useEffect, useRef } from 'react'
import type { MediaAsset } from '../content/types'
import { loadGsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/device'

type ParallaxImageProps = {
  media: MediaAsset
  className?: string
  /** How far the image drifts, as a percentage of its own height */
  strength?: number
}

/**
 * A wide image that drifts slowly as the page scrolls. The image is taller than its
 * frame, so the drift never exposes an edge. Static for reduced-motion users.
 */
export function ParallaxImage({ media, className = 'h-[46vh] md:h-[62vh]', strength = 12 }: ParallaxImageProps) {
  const frame = useRef<HTMLDivElement>(null)
  const image = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el = frame.current
    if (!el || prefersReducedMotion()) return
    let revert = () => {}
    let cancelled = false
    // GSAP is fetched only when the image is about to scroll into view.
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const { gsap } = await loadGsap()
        if (cancelled || !image.current) return
        const tween = gsap.fromTo(
          image.current,
          { yPercent: -strength },
          { yPercent: strength, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        revert = () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
      revert()
    }
  }, [strength])

  return (
    <div ref={frame} className={`relative overflow-hidden bg-ink-soft ${className}`}>
      <img
        ref={image}
        src={media.src}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover will-change-transform ${
          media.placeholder ? 'opacity-70 saturate-50' : ''
        }`}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-ink via-transparent to-ink" />
    </div>
  )
}
