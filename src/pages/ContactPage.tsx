import type { ReactNode } from 'react'
import { pageImages } from '../content/media'
import { phoneDisplay, phoneInternational, social } from '../content/site'
import { ButtonLink } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { Tilt3D, depth } from '../components/Tilt3D'
import { useI18n } from '../i18n'

function ContactCard({ label, index, children }: { label: string; index: number; children: ReactNode }) {
  return (
    <Reveal tilt delay={index * 90}>
      <Tilt3D auto max={10}>
        <div className="relative h-full border border-ivory/10 bg-ink-soft p-7 shadow-[0_40px_70px_-40px_rgba(0,0,0,0.95)] md:p-9">
          <span className="text-3d block font-serif text-5xl font-bold italic" style={depth(40)}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-gold">{label}</p>
          <div className="mt-3 text-ivory/85">{children}</div>
        </div>
      </Tilt3D>
    </Reveal>
  )
}

const actionLink =
  'mt-6 inline-flex min-h-11 items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-gold transition hover:text-gold-bright'

export function ContactPage() {
  const { t } = useI18n()
  return (
    <div>
      <Seo
        title="Contact"
        path="/contact"
        description="Call or WhatsApp 0923 400 278, or visit Woynu Malala Cultural Cloth Design and Decor in Wolaita Sodo, Ethiopia."
      />
      <PageHeader
        kicker={t('contact.kicker')}
        title={t('home.contactTitle')}
        intro={t('home.contactText')}
        media={pageImages.contactHeader}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to={social.phone.href}>{t('contact.callUs')}</ButtonLink>
          <ButtonLink to={social.whatsapp.href} variant="ghost">
            {t('contact.whatsapp')}
          </ButtonLink>
        </div>
      </PageHeader>

      <div className="grid gap-6 px-5 pb-24 md:grid-cols-3 md:px-10">
        <ContactCard label={t('contact.location')} index={0}>
          <p className="font-serif text-3xl font-light">{t('brand.location')}</p>
          <p className="mt-2 text-xs text-stone">{social.studio.pending}</p>
          <p className="mt-3 text-sm text-ivory/60">{t('contact.hoursNote')}</p>
          <a href={social.studio.href} target="_blank" rel="noopener noreferrer" className={actionLink}>
            {t('contact.directions')} <span aria-hidden="true">→</span>
          </a>
        </ContactCard>
        <ContactCard label={t('contact.phone')} index={1}>
          <a href={social.phone.href} className="font-serif text-3xl font-light hover:text-gold">
            {phoneDisplay}
          </a>
          <p className="mt-2 text-xs text-stone">{phoneInternational}</p>
          <a href={social.phone.href} className={actionLink}>
            {t('contact.callUs')} <span aria-hidden="true">→</span>
          </a>
        </ContactCard>
        <ContactCard label={t('contact.whatsapp')} index={2}>
          <a
            href={social.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-3xl font-light hover:text-gold"
          >
            {phoneDisplay}
          </a>
          <p className="mt-2 text-xs text-stone">{phoneInternational}</p>
          <a href={social.whatsapp.href} target="_blank" rel="noopener noreferrer" className={actionLink}>
            {t('contact.chat')} <span aria-hidden="true">→</span>
          </a>
        </ContactCard>
      </div>
    </div>
  )
}
