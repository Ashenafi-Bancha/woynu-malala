import { useEffect, useRef, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  mask?: boolean
  /** Rise in with a 3D tilt instead of a flat fade */
  tilt?: boolean
}

export function Reveal({ children, className = '', delay = 0, mask = false, tilt = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('is-visible')
        // Left through the bottom of the screen: reset, so it plays again on the way back down.
        // (Leaving through the top keeps it shown, which avoids flicker at the top edge.)
        else if (entry.boundingClientRect.top > 0) el.classList.remove('is-visible')
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${tilt ? 'reveal-3d' : 'reveal'} ${mask ? 'mask-reveal' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
