import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { imageFor } from '../content/images'
import { brand } from '../content/site'
import { useI18n } from '../i18n'
import { canRender3D, hasFinePointer, remember3DFallback, whenIdle } from '../lib/device'
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

/**
 * How long after the page is idle the 3D scene starts. Computers start almost at once;
 * phones get a couple of quiet seconds first, so the download doesn't compete with the page.
 */
/** Phones: the two buttons share one row, so they are set a little tighter */
const compact = 'max-lg:px-2 max-lg:tracking-[0.14em]'

const start3DAfterMs = () => (hasFinePointer() ? 300 : 2200)

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

  // From lg up the cloth sits beside the text; below that it has the top zone to itself
  const [beside, setBeside] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const update = () => setBeside(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Load the 3D cloth only where it will run well, and only after the page has settled.
  useEffect(() => {
    if (!canRender3D()) return
    let timer = 0
    const cancelIdle = whenIdle(() => {
      timer = window.setTimeout(() => setUse3D(true), start3DAfterMs())
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
    // Phones stack the hero in three zones under the header: the 3D cloth on its own,
    // then the name and slogan, then the buttons and the scroll cue. From lg up the cloth
    // fills the hero and the text sits to its left.
    <section ref={section} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink lg:block">
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

      {/* Zone 1: the 3D cloth. On phones nothing is drawn over it. */}
      <div className="relative mt-16 h-[30svh] shrink-0 lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
        {/* Phones: a breathing gold glow behind the cloth */}
        <div aria-hidden="true" className="hero-glow absolute inset-x-[8%] inset-y-[10%] rounded-full bg-gold/40 blur-[60px] lg:hidden" />
        <ClothFallback
          className={`absolute inset-x-[26%] inset-y-[6%] transition-opacity duration-1000 lg:inset-y-[14%] lg:left-[58%] lg:right-[10%] ${
            ready3D ? 'opacity-0' : 'opacity-100'
          }`}
        />
        {use3D ? (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready3D ? 'opacity-100' : 'opacity-0'}`}>
            <ClothBoundary onError={tooSlow}>
              <Suspense fallback={null}>
                <HeroCloth
                  scroll={scroll}
                  beside={beside}
                  active={active}
                  onReady={() => setReady3D(true)}
                  onTooSlow={tooSlow}
                />
              </Suspense>
            </ClothBoundary>
          </div>
        ) : null}
        {/* Desktop: a soft fade from the left keeps the text readable over the scene */}
        <div className="absolute inset-0 hidden bg-linear-to-r from-ink via-ink/55 to-transparent lg:block" />
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
            <p className="text-[11px] uppercase tracking-[0.42em] text-gold">{t('brand.place')}</p>
            <div className="mt-4 lg:mt-6">
              <BrandName as="h1" size="xl" align="responsive" />
            </div>
            <div className="gold-rule mt-6 w-40 lg:mt-8" />
            <m.p
              variants={item}
              lang="am"
              className="mt-5 font-ethiopic text-2xl font-semibold leading-snug text-gold sm:text-3xl md:text-4xl lg:mt-6"
            >
              {brand.amharicSlogan}
            </m.p>
            <m.p variants={item} className="mt-3 max-w-lg font-serif text-xl italic leading-snug text-ivory/80 md:text-2xl lg:mt-4">
              {t('brand.statement')}
            </m.p>

            {/* Zone 3: what to do next */}
            <m.div variants={item} className="mt-auto grid w-full grid-cols-2 gap-3 pt-7 lg:mt-10 lg:flex lg:w-auto lg:pt-0">
              <ButtonLink to="/collections" className={compact}>
                {t('hero.explore')}
              </ButtonLink>
              <ButtonLink to="/contact" variant="ghost" className={compact}>
                {t('hero.contact')}
              </ButtonLink>
            </m.div>
            <m.div variants={item} className="mt-5 flex flex-col items-center gap-2 lg:mt-12 lg:flex-row lg:gap-4">
              <span aria-hidden="true" className="scroll-cue" />
              <span className="text-[10px] uppercase tracking-[0.34em] text-ivory/60">{t('hero.scroll')}</span>
            </m.div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
