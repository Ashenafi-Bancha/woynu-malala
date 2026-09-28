import { Suspense } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { brand } from '../content/site'
import { useI18n } from '../i18n'

export function Layout() {
  const { pathname } = useLocation()
  const { t } = useI18n()
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main key={pathname} className="page-enter min-h-screen">
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
    </>
  )
}
