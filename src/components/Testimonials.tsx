import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import { testimonials } from '../content/site'
import { useI18n } from '../i18n'
import { SplitTitle, headingClass } from './SplitTitle'

const AUTO_ADVANCE_MS = 7000

/** Animated testimonial slider. Pauses on hover/focus and never auto-advances for reduced-motion users. */
export function Testimonials() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = testimonials.length
  const item = testimonials[index]
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count)

  useEffect(() => {
    if (reduced || paused || count < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [reduced, paused, count])

  const arrow =
    'grid h-12 w-12 place-items-center rounded-full border border-ivory/30 text-ivory transition hover:border-gold hover:text-gold'

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('testimonials.title')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden bg-ink-soft px-5 py-20 text-center md:px-10 md:py-28"
    >
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('testimonials.kicker')}</p>
      <h2 className={`mt-5 ${headingClass} text-4xl sm:text-5xl md:text-6xl`}>
        <SplitTitle text={t('testimonials.title')} />
      </h2>

      <div className="mx-auto mt-12 flex min-h-[15rem] max-w-3xl items-center justify-center" aria-live={paused ? 'polite' : 'off'}>
        <AnimatePresence mode="wait">
          <m.blockquote
            key={item.id}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span aria-hidden="true" className="block font-serif text-7xl leading-none text-gold/60">
              “
            </span>
            <p className="font-serif text-2xl italic leading-relaxed text-ivory/90 md:text-3xl">{item.quote}</p>
            <footer className="mt-6 text-[11px] uppercase tracking-[0.28em] text-ivory/60">
              {item.name} · {item.detail}
            </footer>
          </m.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        <button type="button" onClick={() => go(-1)} aria-label={t('testimonials.prev')} className={arrow}>
          ←
        </button>
        <div className="flex gap-2">
          {testimonials.map((x, i) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1} / ${count}`}
              aria-current={i === index}
              className="grid h-11 w-6 place-items-center"
            >
              <span className={`h-px transition-all duration-500 ${i === index ? 'w-6 bg-gold' : 'w-3 bg-ivory/30'}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label={t('testimonials.next')} className={arrow}>
          →
        </button>
      </div>

      {testimonials.some((x) => x.placeholder) ? (
        <p className="mt-8 text-xs text-ivory/40">{t('testimonials.placeholderNote')}</p>
      ) : null}
    </section>
  )
}
