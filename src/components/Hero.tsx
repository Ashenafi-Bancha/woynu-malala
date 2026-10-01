import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { imageFor } from '../content/images'
import { brand } from '../content/site'
import { useI18n } from '../i18n'
import { canRender3D, remember3DFallback, whenIdle } from '../lib/device'
import { loadGsap } from '../lib/gsap'
import { BrandName } from './BrandName'
import { ButtonLink } from './Button'
import { ClothFallback } from './hero/ClothFallback'

// Three.js is a separate chunk, fetched only on capable devices once the page is idle.
const HeroCloth = lazy(() => import('./hero/HeroCloth'))

/** If WebGL fails to start (or the 3D chunk fails to load), fall back to the still cloth. */
class ClothBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } }
const ease = [0.22, 1, 0.36, 1] as const
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}
// The place line and the name are not animated: index.html already paints them before any
// JavaScript runs, so they must stay put when React takes over. The lines below them and
// the buttons then arrive one after another.

/** Give the page a few quiet seconds before the 3D download starts competing for the phone. */
const START_3D_AFTER_MS = 3000

export function Hero() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const text = useRef<HTMLDivElement>(null)
  const scroll = useRef(0)
  const [use3D, setUse3D] = useState(false)
  const [ready3D, setReady3D] = useState(false)
  const [active, setActive] = useState(true)
  const studioPhoto = imageFor('hero/hero')

  // Load the 3D cloth only where it will run well, and only after the page has settled.
  useEffect(() => {
    if (!canRender3D()) return
    let timer = 0
    const cancelIdle = whenIdle(() => {
      timer = window.setTimeout(() => setUse3D(true), START_3D_AFTER_MS)
    })
    return () => {
      cancelIdle()
      window.clearTimeout(timer)
    }
  }, [])

  // Stop rendering frames when the hero is off screen or the tab is hidden.
  useEffect(() => {
    const el = section.current
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

  // Scroll: the cloth lifts away and the text drifts up and fades.
  useEffect(() => {
    if (reduced || !section.current) return
    let revert = () => {}
    let cancelled = false
    // GSAP only drives scroll effects, so it is fetched on the visitor's first scroll.
    const load = async () => {
      const { gsap, ScrollTrigger } = await loadGsap()
      if (cancelled || !section.current) return
      const ctx = gsap.context(() => {
        const range = { trigger: section.current, start: 'top top', end: 'bottom top' }
        ScrollTrigger.create({ ...range, onUpdate: (self) => (scroll.current = self.progress) })
        gsap.to(text.current, { yPercent: -12, opacity: 0.1, ease: 'none', scrollTrigger: { ...range, scrub: true } })
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

  const tooSlow = () => {
    remember3DFallback()
    setUse3D(false)
    setReady3D(false)
  }

  return (
    <section ref={section} className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* A studio photo saved as images/hero/hero.jpg sits softly behind everything */}
      {studioPhoto ? (
        <img
          src={studioPhoto}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute right-[-10%] top-1/2 hidden h-[80vh] w-[60vw] -translate-y-1/2 rounded-full bg-gold/10 blur-[120px] lg:block"
      />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-12 px-5 pb-16 pt-28 md:px-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* The cloth: full-bleed behind the text on phones, its own column on desktop */}
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:order-2 lg:h-[min(80vh,760px)]">
          <ClothFallback
            className={`absolute inset-x-[16%] bottom-[12%] top-[16%] transition-opacity duration-1000 lg:inset-x-[14%] lg:bottom-[8%] lg:top-[8%] ${
              ready3D ? 'opacity-0' : 'opacity-70 lg:opacity-100'
            }`}
          />
          {use3D ? (
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${ready3D ? 'opacity-75 lg:opacity-100' : 'opacity-0'}`}
            >
              <ClothBoundary onError={tooSlow}>
                <Suspense fallback={null}>
                  <HeroCloth scroll={scroll} active={active} onReady={() => setReady3D(true)} onTooSlow={tooSlow} />
                </Suspense>
              </ClothBoundary>
            </div>
          ) : null}
          {/* Keeps the text readable over the cloth on phones */}
          <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/45 to-ink/90 lg:hidden" />
        </div>

        <div ref={text} className="relative z-[4] lg:order-1">
          <m.div
            variants={container}
            initial={reduced ? false : 'hidden'}
            animate="show"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <p className="text-[11px] uppercase tracking-[0.42em] text-gold">{t('brand.place')}</p>
            <div className="mt-6">
              <BrandName as="h1" size="xl" align="responsive" />
            </div>
            <div className="gold-rule mt-8 w-40" />
            <m.p
              variants={item}
              lang="am"
              className="mt-6 font-ethiopic text-2xl font-semibold leading-snug text-gold sm:text-3xl md:text-4xl"
            >
              {brand.amharicSlogan}
            </m.p>
            <m.p variants={item} className="mt-4 max-w-lg font-serif text-xl italic leading-snug text-ivory/80 md:text-2xl">
              {t('brand.statement')}
            </m.p>
            <m.div variants={item} className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              <ButtonLink to="/collections">{t('hero.explore')}</ButtonLink>
              <ButtonLink to="/contact" variant="ghost">
                {t('hero.contact')}
              </ButtonLink>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
