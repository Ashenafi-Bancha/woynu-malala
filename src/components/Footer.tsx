import { Link } from 'react-router-dom'
import { brand, footerNav, phoneDisplay, social } from '../content/site'
import { LanguageToggle, useI18n } from '../i18n'
import { FollowUs } from './FollowUs'
import { navKey } from './Navbar'

import { BrandName } from './BrandName'
import { Logo } from './Logo'

export function Footer() {
  const year = new Date().getFullYear()
  const { t, lang } = useI18n()
  return (
    <footer className="border-t border-ivory/10 bg-ink px-5 py-16 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="relative mb-7 h-24 w-24">
            <span aria-hidden="true" className="brand-ring absolute -inset-2.5 rounded-full border border-dashed border-gold/60" />
            <span aria-hidden="true" className="brand-ring-reverse absolute -inset-5 rounded-full border border-gold/15" />
            <Logo className="h-24 w-24" />
          </div>
          <BrandName as="p" size="md" descriptor={false} />
          {lang === 'en' ? (
            <p lang="am" className="mt-4 font-ethiopic text-sm text-ivory/80">{brand.amharicName}</p>
          ) : null}
          <p lang="am" className="mt-4 font-ethiopic text-lg font-semibold text-gold">{brand.amharicSlogan}</p>
          <p className="mt-3 text-sm text-ivory/70">{t('brand.tagline')}</p>
          <p className="mt-1 text-sm text-ivory/70">{t('brand.location')}</p>
          <LanguageToggle className="mt-6" />
        </div>
        <nav className="grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.22em] text-ivory/80">
          {footerNav.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-gold">
              {t(navKey[item.to])}
            </Link>
          ))}
        </nav>
        <div>
          <FollowUs />
          <div className="mt-8 space-y-3 text-[11px] uppercase tracking-[0.22em] text-ivory/80">
            <a href={social.phone.href} className="block hover:text-gold">
              {t('contact.call')} · {phoneDisplay}
            </a>
            <Link to="/contact" className="block hover:text-gold">
              {t('contact.visit')}
            </Link>
          </div>
          <p className="pt-4 text-[10px] normal-case tracking-normal text-stone">
            {t('common.socialNote')}
          </p>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-7xl text-[10px] uppercase tracking-[0.22em] text-stone">
        © {year} {t('brand.name')}. {t('common.rights')}
      </p>
    </footer>
  )
}
