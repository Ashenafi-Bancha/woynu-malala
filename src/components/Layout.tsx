import { LazyMotion } from 'motion/react'
import { Suspense, useEffect } from 'react'
import { Link, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Interactions } from './Interactions'
import { Navbar } from './Navbar'
import { ScrollProgress } from './ScrollFx'
import { brand } from '../content/site'
import { useI18n } from '../i18n'
import { hasFinePointer, prefersReducedMotion, whenIdle } from '../lib/device'

const loadMotionFeatures = () => import('../lib/motionFeatures').then((m) => m.default)

export function Layout() {
  const { pathname } = useLocation()
  const { t } = useI18n()

  // Smooth wheel scrolling for mouse and trackpad users. Touch devices keep the browser's
  // own scrolling, which is smoother and cheaper on mid-range phones.
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    let destroy = () => {}
    let cancelled = false
    const cancelIdle = whenIdle(async () => {
      const { default: Lenis } = await import('lenis')
      if (cancelled) return
      const lenis = new Lenis({ autoRaf: true, duration: 1.05 })
      document.documentElement.classList.add('lenis-active')
      destroy = () => {
        lenis.destroy()
        document.documentElement.classList.remove('lenis-active')
      }
    })
    return () => {
      cancelled = true
      cancelIdle()
      destroy()
    }
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: brand.name,
    slogan: brand.tagline,
    description: brand.statement,
    url: brand.siteUrl,
    areaServed: 'Wolaita, Ethiopia',
  }

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ScrollProgress />
      <Interactions />
      <Navbar />
      {/* A new curtain element per page plays the sweep on every navigation */}
      <div key={`curtain-${pathname}`} aria-hidden="true" className="page-curtain" />
      <main key={pathname} className="page-enter relative min-h-screen">
        {pathname !== '/' ? (
          // Sits in the space each page already leaves under the fixed header
          <Link
            to="/"
            className="absolute left-4 top-[4.4rem] z-30 inline-flex min-h-9 items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-ivory/70 transition hover:text-gold md:left-10 md:top-24"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M19 12H5m0 0 6-6m-6 6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t('nav.backHome')}
          </Link>
        ) : null}
        <Suspense
          fallback={
            <div className="grid min-h-screen place-items-center text-[11px] uppercase tracking-[0.35em] text-gold">
              {t('common.loading')}
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </LazyMotion>
  )
}
