import { siFacebook, siInstagram, siTiktok, siWhatsapp, type SimpleIcon } from 'simple-icons'
import { brand, social } from '../content/site'
import { useI18n } from '../i18n'

type Network = {
  icon: SimpleIcon
  href: string
  /** Official brand background (Instagram uses its signature gradient) */
  background: string
  /** TikTok's glyph carries its cyan/red offset */
  glyphFilter?: string
}

const networks: Network[] = [
  { icon: siFacebook, href: social.facebook.href, background: '#0866FF' },
  {
    icon: siInstagram,
    href: social.instagram.href,
    background:
      'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
  },
  {
    icon: siTiktok,
    href: social.tiktok.href,
    background: '#000000',
    glyphFilter: 'drop-shadow(-1.2px -1.2px 0 #25F4EE) drop-shadow(1.2px 1.2px 0 #FE2C55)',
  },
  { icon: siWhatsapp, href: social.whatsapp.href, background: '#25D366' },
]

type FollowUsProps = {
  size?: 'md' | 'lg'
  align?: 'left' | 'center'
  className?: string
}

/** "Follow us" row of social icons in each network's official colours. */
export function FollowUs({ size = 'md', align = 'left', className = '' }: FollowUsProps) {
  const { t } = useI18n()
  const circle = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
  const glyph = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'

  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{t('social.follow')}</p>
      <ul className={`mt-4 flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        {networks.map(({ icon, href, background, glyphFilter }) => {
          const pending = href === '#'
          const label = pending ? `${icon.title} — ${t('social.soon')}` : `${icon.title} — ${brand.shortName}`
          return (
            <li key={icon.slug}>
              <a
                href={pending ? undefined : href}
                target={pending ? undefined : '_blank'}
                rel={pending ? undefined : 'noopener noreferrer'}
                aria-label={label}
                title={label}
                aria-disabled={pending || undefined}
                className={`group grid ${circle} place-items-center rounded-full shadow-[0_10px_25px_-10px_rgba(0,0,0,0.8)] ring-1 ring-white/15 transition duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-[0_18px_30px_-12px_rgba(0,0,0,0.9)] ${
                  pending ? 'cursor-default' : 'cursor-pointer'
                }`}
                style={{ background }}
              >
                <svg viewBox="0 0 24 24" className={glyph} aria-hidden="true" style={{ filter: glyphFilter }}>
                  <path d={icon.path} fill="#ffffff" />
                </svg>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
