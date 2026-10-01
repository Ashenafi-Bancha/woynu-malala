import { pageImages } from '../content/media'
import { brand } from '../content/site'
import { useI18n } from '../i18n'
import { BrandName } from './BrandName'
import { ButtonLink } from './Button'
import { Tilt3D, depth } from './Tilt3D'

const heroPhoto = pageImages.hero

export function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink">
      {/* Phones and tablets: the photo fills the screen behind the text */}
      <img
        src={heroPhoto.src}
        srcSet={heroPhoto.srcSet}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="hero-media absolute inset-0 h-full w-full object-cover object-[50%_30%] lg:hidden"
      />
      <div className="absolute inset-0 bg-linear-to-b from-ink/70 via-ink/45 to-ink/95 lg:hidden" />

      {/* Desktop: soft gold glow behind the framed photo */}
      <div
        aria-hidden="true"
        className="absolute right-[-10%] top-1/2 hidden h-[80vh] w-[60vw] -translate-y-1/2 rounded-full bg-gold/10 blur-[120px] lg:block"
      />

      <div className="relative z-[4] mx-auto grid min-h-[100svh] max-w-[1600px] items-center gap-12 px-5 pb-16 pt-28 md:px-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-[11px] uppercase tracking-[0.42em] text-gold">{t('brand.place')}</p>
          <BrandName as="h1" size="xl" align="responsive" className="mt-6" />
          <div className="gold-rule mt-8 w-40" />
          <p lang="am" className="mt-6 font-ethiopic text-2xl font-semibold leading-snug text-gold sm:text-3xl md:text-4xl">
            {brand.amharicSlogan}
          </p>
          <p className="mt-4 max-w-lg font-serif text-xl italic leading-snug text-ivory/80 md:text-2xl">
            {t('brand.statement')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            <ButtonLink to="/collections">{t('hero.explore')}</ButtonLink>
            <ButtonLink to="/lookbook" variant="ghost">
              {t('hero.lookbook')}
            </ButtonLink>
          </div>
        </div>

        <div className="hidden lg:block">
          <Tilt3D max={7} className="mx-auto aspect-[4/5] w-full max-w-[540px]">
            <div
              aria-hidden="true"
              className="absolute -inset-5 border border-gold/40"
              style={depth(-40)}
            />
            <div className="absolute inset-0 overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
              <img
                src={heroPhoto.src}
                srcSet={heroPhoto.srcSet}
                sizes="(min-width: 1024px) 540px, 100vw"
                alt={heroPhoto.alt}
                fetchPriority="high"
                className="hero-media h-full w-full object-cover object-[45%_40%]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4" style={depth(60)}>
              <p className="font-serif text-2xl italic text-ivory">{t('hero.caption')}</p>
              {heroPhoto.caption ? (
                <p className="text-[9px] uppercase tracking-[0.2em] text-ivory/60">{heroPhoto.caption}</p>
              ) : null}
            </div>
          </Tilt3D>
        </div>
      </div>

      {heroPhoto.caption ? (
        <p className="absolute bottom-3 right-4 z-[4] text-[9px] uppercase tracking-[0.2em] text-ivory/50 lg:hidden">
          {heroPhoto.caption}
        </p>
      ) : null}
    </section>
  )
}
