import { useCallback, useEffect, useRef, useState } from 'react'
import { looks } from '../content/site'
import { Seo } from '../components/Seo'
import { SplitTitle, headingClass } from '../components/SplitTitle'
import { useI18n } from '../i18n'

const DRAG_DEG_PER_PX = 0.25

const mod = (n: number, m: number) => ((n % m) + m) % m

/** Card width scales with the viewport so the ring fits on phones. */
function useCardWidth() {
  const calc = () => (typeof window === 'undefined' ? 260 : Math.round(Math.min(260, window.innerWidth * 0.52)))
  const [w, setW] = useState(calc)
  useEffect(() => {
    const onResize = () => setW(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}

export function LookbookPage() {
  const { t, c } = useI18n()
  const n = looks.length
  const step = 360 / n
  const cardW = useCardWidth()
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / n)) + 36

  // `turn` is unbounded so the ring always rotates the short way round.
  const [turn, setTurn] = useState(0)
  const [dragDx, setDragDx] = useState(0)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const index = mod(turn, n)
  const look = looks[index]

  const next = useCallback(() => setTurn((t) => t + 1), [])
  const prev = useCallback(() => setTurn((t) => t - 1), [])
  const goTo = (i: number) => {
    let d = mod(i - index, n)
    if (d > n / 2) d -= n
    setTurn((t) => t + d)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (!drag.current.moved && Math.abs(dx) > 4) {
      // Only capture once it's a real drag, so plain clicks still reach the cards
      drag.current.moved = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    if (drag.current.moved) setDragDx(dx)
  }
  const onPointerUp = () => {
    if (!drag.current) return
    const steps = Math.round((dragDx * DRAG_DEG_PER_PX) / step)
    if (steps) setTurn((t) => t - steps)
    setDragDx(0)
    // Keep `moved` briefly so the click that ends a drag doesn't select a card
    setTimeout(() => (drag.current = null), 0)
  }

  const rotation = -turn * step + dragDx * DRAG_DEG_PER_PX
  const dragging = dragDx !== 0

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-ink pt-20">
      <Seo
        title="Lookbook"
        path="/lookbook"
        description="Woynu Malala Lookbook — a digital fashion magazine of heritage and contemporary looks."
      />

      {/* Blurred backdrop of the active look */}
      {looks.map((l, i) => (
        <img
          key={l.id}
          src={l.image.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl transition-opacity duration-1000"
          style={{ opacity: i === index ? 0.35 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-b from-ink/80 via-ink/40 to-ink" />

      <div className="relative z-[2] flex min-h-[calc(100svh-5rem)] flex-col">
        <header className="px-5 pt-10 text-center md:px-12">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('lookbook.kicker')}</p>
          <h1 className={`mt-3 ${headingClass} text-5xl md:text-7xl`}>
            <SplitTitle text={t('lookbook.title')} />
          </h1>
        </header>

        {/* 3D ring */}
        <div
          className="relative flex-1 cursor-grab touch-pan-y select-none active:cursor-grabbing"
          style={{ perspective: '1600px', minHeight: cardW * 1.75 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="region"
          aria-roledescription="carousel"
          aria-label="Lookbook"
        >
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[78%] h-24 -translate-x-1/2 rounded-[50%] bg-gold/20 blur-3xl"
            style={{ width: cardW * 2.4 }}
          />
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: cardW,
              height: cardW * 1.25,
              marginLeft: -cardW / 2,
              marginTop: (-cardW * 1.25) / 2,
              transformStyle: 'preserve-3d',
              transform: `translateZ(${-radius}px) rotateY(${rotation}deg)`,
              transition: dragging ? 'none' : 'transform 1s var(--ease-fashion)',
            }}
          >
            {looks.map((l, i) => {
              // Angle of this card relative to the front, in -180..180
              const rel = mod(i * step + rotation + 180, 360) - 180
              const facing = 1 - Math.min(Math.abs(rel) / 180, 1)
              const active = i === index
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    if (drag.current?.moved) return
                    goTo(i)
                  }}
                  aria-label={`${l.number}: ${c(l.title)}`}
                  aria-current={active}
                  className="absolute inset-0 overflow-hidden bg-ink-soft text-left shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
                  style={{
                    transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                    opacity: 0.25 + facing * 0.75,
                    filter: `brightness(${0.45 + facing * 0.55})`,
                    transition: dragging ? 'none' : 'opacity 1s, filter 1s',
                  }}
                >
                  <img
                    src={l.image.src}
                    alt={l.image.alt}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
                  <span
                    className={`absolute inset-2 border transition duration-700 ${active ? 'border-gold/70' : 'border-ivory/10'}`}
                  />
                  <span className="absolute bottom-4 left-4 font-serif text-lg italic text-ivory">{l.number}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active look details */}
        <div className="px-5 pb-10 text-center md:px-12" aria-live="polite">
          <div key={look.id} className="page-enter">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold">
              {look.number} · {c(look.collectionTitle)}
            </p>
            <h2 className="mt-3 font-serif text-4xl font-light italic text-gold md:text-6xl">{c(look.title)}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-ivory/60">{look.note}</p>
          </div>

          <div className="mx-auto mt-8 flex max-w-xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label={t('lookbook.prev')}
              className="grid h-12 w-12 place-items-center rounded-full border border-ivory/30 text-ivory transition hover:border-gold hover:text-gold"
            >
              ←
            </button>
            <div className="flex gap-2" aria-label="Looks">
              {looks.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  aria-label={l.number}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className={`h-px transition-all duration-500 ${i === index ? 'w-10 bg-gold' : 'w-5 bg-ivory/30 hover:bg-ivory/60'}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label={t('lookbook.next')}
              className="grid h-12 w-12 place-items-center rounded-full border border-ivory/30 text-ivory transition hover:border-gold hover:text-gold"
            >
              →
            </button>
          </div>
          <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-ivory/40">
            {t('lookbook.hint')}
          </p>
        </div>
      </div>
    </div>
  )
}
