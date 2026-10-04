import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { imageFor } from '../content/images'
import { brand } from '../content/site'
import { useI18n } from '../i18n'
import { hasFinePointer } from '../lib/device'
import { loadGsap } from '../lib/gsap'
import { BrandName } from './BrandName'
import { ButtonLink } from './Button'
import { Emblem } from './Emblem'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } }
const ease = [0.22, 1, 0.36, 1] as const
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}
// The emblem and the name are not animated in: index.html already paints
// them before any JavaScript runs, so they must stay put when React takes over. The lines
// below them and the buttons then arrive one after another.

/** The hero shows only the second half of the slogan ("ባህላችንን በውበት!"); the name already stands above it */
const heroSlogan = brand.amharicSlogan.split('—').pop()!.trim()

export function Hero() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const text = useRef<HTMLDivElement>(null)
  const emblem = useRef<HTMLDivElement>(null)
  const studioPhoto = imageFor('hero/hero')

  // Computers: the emblem tilts toward the mouse.
  useEffect(() => {
    const el = emblem.current
    if (reduced || !el || !hasFinePointer()) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      el.style.setProperty('--tilt-y', `${((e.clientX / window.innerWidth) * 2 - 1) * 14}deg`)
      el.style.setProperty('--tilt-x', `${-((e.clientY / window.innerHeight) * 2 - 1) * 10}deg`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  // Scroll: the emblem turns and shrinks away, and the text drifts up and fades.
  useEffect(() => {
    if (reduced || !section.current) return
    let revert = () => {}
    let cancelled = false
    // GSAP only drives scroll effects, so it is fetched on the visitor's first scroll.
    const load = async () => {
      const { gsap } = await loadGsap()
      if (cancelled || !section.current) return
      const ctx = gsap.context(() => {
        const scrollTrigger = { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(emblem.current?.firstElementChild ?? null, { scale: 0.72, rotate: 24, opacity: 0.25, ease: 'none', scrollTrigger })
        gsap.to(text.current, { yPercent: -12, opacity: 0.1, ease: 'none', scrollTrigger })
      }, section)
      revert = () => ctx.revert()
    }
    window.addEventListener('scroll', load, { once: true, passive: true })
    return () => {
      cancelled = true
      window.removeEventListener('scroll', load)
      revert()
    }
  }, [reduced])

  return (
    // Phones stack the hero in three zones under the header: the logo emblem on its own,
    // then the name and slogan, then the buttons and the scroll cue. From lg up the emblem
    // sits to the right of the text.
    <section ref={section} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink lg:block">
      {/* A studio photo saved as images/hero/hero.jpg sits softly behind everything */}
      {studioPhoto ? (
        <img
          src={studioPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      ) : null}

      {/* Zone 1: the logo emblem. Nothing is drawn over it. */}
      <div className="hero-emblem-zone relative mt-16 flex h-[30svh] shrink-0 items-center justify-center lg:absolute lg:inset-y-0 lg:left-[54%] lg:right-[4%] lg:mt-0 lg:h-auto">
        <div ref={emblem} className="hero-emblem-tilt">
          {/* The scroll animation moves this wrapper, so it never fights the mouse tilt or the float */}
          <div className="h-full w-full">
            <Emblem className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 pb-6 pt-3 md:px-12 lg:grid lg:min-h-[100svh] lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:pb-16 lg:pt-28">
        <div ref={text} className="relative z-[4] flex flex-1 flex-col lg:block">
          <m.div
            variants={container}
            initial={reduced ? false : 'hidden'}
            animate="show"
            className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Zone 2: who we are */}
            <BrandName as="h1" size="xl" align="responsive" />
            <div className="gold-rule mt-6 w-40 lg:mt-8" />
            <m.p
              variants={item}
              lang="am"
              className="mt-5 font-ethiopic text-2xl font-semibold leading-snug text-gold sm:text-3xl md:text-4xl lg:mt-6"
            >
              {heroSlogan}
            </m.p>
            <m.p variants={item} className="mt-3 max-w-lg font-serif text-xl italic leading-snug text-ivory/80 md:text-2xl lg:mt-4">
              {t('brand.statement')}
            </m.p>

            {/* Zone 3: what to do next */}
            {/* Phones: full-width buttons, one under the other */}
            <m.div variants={item} className="mt-auto flex w-full flex-col gap-3 pt-6 lg:mt-10 lg:w-auto lg:flex-row lg:pt-0">
              <ButtonLink to="/collections">{t('hero.explore')}</ButtonLink>
              <ButtonLink to="/contact" variant="ghost" className="btn-border-run">
                {t('hero.contact')}
              </ButtonLink>
            </m.div>
            <m.div variants={item} className="mt-4 flex flex-col items-center gap-2 lg:mt-12 lg:flex-row lg:gap-4">
              <span aria-hidden="true" className="scroll-cue" />
              <span className="text-[10px] uppercase tracking-[0.34em] text-ivory/60">{t('hero.scroll')}</span>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
