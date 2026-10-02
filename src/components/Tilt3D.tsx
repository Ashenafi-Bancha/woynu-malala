import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Tilt3DProps = {
  children: ReactNode
  className?: string
  /** Maximum tilt in degrees */
  max?: number
  /** Show a soft light that follows the pointer */
  glare?: boolean
  /** Size the card from its content instead of filling a fixed-aspect box */
  auto?: boolean
}

const canTilt = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches

/**
 * A perspective stage that tilts toward the pointer. Children are positioned
 * absolutely and can sit at different depths with `depth(px)`.
 * Parents of depth layers must not use overflow-hidden (it flattens 3D).
 */
export function Tilt3D({ children, className = '', max = 10, glare = true, auto = false }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })
  const [scrollRx, setScrollRx] = useState(0)
  // Each card starts its idle sway at a different point, so a row of cards never moves in step
  const [swayDelay] = useState(() => -Math.random() * 8)

  // Touch screens can't hover, so there the card tilts as it scrolls through the screen.
  useEffect(() => {
    const el = ref.current
    if (!el || canTilt() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      setScrollRx(Math.max(-1, Math.min(1, offset)) * max * 1.2)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true })
        update()
      } else {
        window.removeEventListener('scroll', onScroll)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [max])

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !canTilt() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setT({ rx: (0.5 - py) * 2 * max, ry: (px - 0.5) * 2 * max, gx: px * 100, gy: py * 100, active: true })
  }

  const onLeave = () => setT({ rx: 0, ry: 0, gx: 50, gy: 50, active: false })

  return (
    <div className={`relative ${className}`} style={{ perspective: '1200px' }}>
      {/* Idle motion: the card keeps swaying gently even when nobody touches it */}
      <div className={`sway-3d ${auto ? 'relative h-full' : 'absolute inset-0'}`} style={{ animationDelay: `${swayDelay}s` }}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`${auto ? 'relative h-full' : 'absolute inset-0'} will-change-transform`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${t.rx + scrollRx}deg) rotateY(${t.ry}deg) scale(${t.active ? 1.02 : 1})`,
          transition: t.active
            ? 'transform 140ms ease-out'
            : scrollRx
              ? 'transform 200ms linear'
              : 'transform 900ms var(--ease-fashion)',
        }}
      >
        {children}
        {glare ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[20] transition-opacity duration-500"
            style={{
              opacity: t.active ? 1 : 0,
              background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255, 236, 200, 0.22), transparent 55%)`,
              transform: 'translateZ(1px)',
            }}
          />
        ) : null}
      </div>
      </div>
    </div>
  )
}

/** Inline style that lifts a layer toward the viewer inside a Tilt3D. */
export const depth = (px: number): CSSProperties => ({ transform: `translateZ(${px}px)` })
