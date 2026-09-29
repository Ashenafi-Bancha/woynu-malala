import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '../content/site'
import { LanguageToggle, useI18n } from '../i18n'
import type { Key } from '../i18n/strings'
import { BrandName } from './BrandName'
import { Logo } from './Logo'

export const navKey: Record<string, Key> = {
  '/collections': 'nav.collections',
  '/lookbook': 'nav.lookbook',
  '/story': 'nav.story',
  '/culture': 'nav.culture',
  '/custom': 'nav.custom',
  '/journal': 'nav.journal',
  '/contact': 'nav.contact',
  '/craftsmanship': 'nav.craftsmanship',
  '/woynu-ai': 'nav.woynuAi',
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { t } = useI18n()
  const home = location.pathname === '/'

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = !home || scrolled || open

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`relative z-50 flex items-center justify-between gap-3 px-4 py-3 transition duration-500 md:px-10 md:py-5 ${
          solid ? 'bg-ink/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <Link to="/" aria-label={t('brand.name')} className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <Logo className="h-9 w-9 shrink-0 text-gold md:h-11 md:w-11" />
          <BrandName size="sm" />
        </Link>
        <nav className="hidden items-center gap-6 xl:flex xl:gap-8" aria-label="Primary">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap text-[11px] uppercase tracking-[0.28em] transition ${
                  isActive ? 'text-gold' : 'text-ivory/80 hover:text-gold'
                }`
              }
            >
              {t(navKey[item.to])}
            </NavLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          {/* Always visible so phone users can switch language without opening the menu */}
          <LanguageToggle />
          <button
            type="button"
            className="min-h-11 px-2 text-[11px] uppercase tracking-[0.28em] text-ivory xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t('nav.close') : t('nav.menu')}
          </button>
        </div>
      </div>
      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-6 pb-12 pt-24 xl:hidden"
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {[...nav, { to: '/craftsmanship', label: 'Craftsmanship' }].map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-baseline gap-4 border-b border-ivory/10 py-4 font-serif text-3xl italic transition ${
                    isActive ? 'text-gold' : 'text-ivory'
                  }`
                }
              >
                <span className="font-sans text-[10px] not-italic tracking-[0.2em] text-gold/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t(navKey[item.to])}
              </NavLink>
            ))}
          </nav>
          <p className="mt-10 text-[11px] uppercase tracking-[0.3em] text-gold">{t('brand.tagline')}</p>
        </div>
      ) : null}
    </header>
  )
}
