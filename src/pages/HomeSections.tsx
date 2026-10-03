import { Link } from 'react-router-dom'
import { pageImages } from '../content/media'
import { brand, collections, facebookPhotos, journal, occasions, phoneDisplay, social } from '../content/site'
import { ButtonLink } from '../components/Button'
import { CraftsmanshipTimeline } from '../components/CraftsmanshipTimeline'
import { CustomDesignForm } from '../components/CustomDesignForm'
import { Frame3D } from '../components/Frame3D'
import { Gallery } from '../components/Gallery'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { Reveal } from '../components/Reveal'
import { HorizontalCollections, Marquee, ScrubText } from '../components/ScrollFx'
import { SectionHeading } from '../components/SectionHeading'
import { Testimonials } from '../components/Testimonials'
import { WeaveTiles } from '../components/woynu-ai/WeaveTiles'
import { SplitTitle, headingClass } from '../components/SplitTitle'
import { Tilt3D, depth } from '../components/Tilt3D'
import { useI18n } from '../i18n'
import { useAiText } from '../woynu-ai/strings'

/** Swipeable row on phones, grid from lg up. */
const snapRow =
  '-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0'
const snapItem = 'w-[78vw] max-w-sm shrink-0 snap-center lg:w-auto lg:max-w-none'

const cultureTeasers = ['Traditional clothing', 'Patterns', 'Colors', 'Modern interpretation']

/** Everything on the home page below the hero. Loaded and rendered after the hero is on screen. */
export default function HomeSections() {
  const { t, c, lang } = useI18n()
  const { a } = useAiText()
  return (
    <>
      {/* Slogan: two bands gliding in opposite directions */}
      <section aria-label={brand.amharicSlogan} className="relative overflow-hidden border-y border-gold/25 bg-ink-soft py-12 md:py-16">
        <Marquee className="font-ethiopic text-4xl font-semibold text-ivory sm:text-5xl md:text-7xl">
          {[0, 1, 2].map((i) => (
            <span key={i} lang="am" className="flex shrink-0 items-center whitespace-nowrap">
              <span className="px-8 md:px-12">{brand.amharicSlogan}</span>
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rotate-45 bg-gold md:h-4 md:w-4" />
            </span>
          ))}
        </Marquee>
        <Marquee reverse className="mt-6 font-serif text-2xl italic text-gold/80 md:mt-8 md:text-4xl">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex shrink-0 items-center whitespace-nowrap">
              <span className="px-8 md:px-12">{lang === 'en' ? brand.sloganTranslation : t('brand.tagline')}</span>
              <span aria-hidden="true" className="h-px w-16 shrink-0 bg-gold/60" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* Introduction */}
      <section className="grid items-stretch lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center bg-ivory px-6 py-20 text-ink md:px-14">
          <p className="text-[11px] uppercase tracking-[0.35em] text-amber-deep">{t('home.introKicker')}</p>
          <h2 className={`mt-5 max-w-md ${headingClass} text-5xl md:text-6xl`}>
            <SplitTitle text={t('home.introTitle')} light />
          </h2>
          <p className="mt-8 max-w-md leading-8 text-ink/75">{t('home.introText')}</p>
          <p className="mt-6 max-w-md text-sm leading-7 text-ink/60">[Brand introduction — Client Content Needed]</p>
          <div className="mt-10">
            <ButtonLink to="/story" variant="ink">
              {t('home.readStory')}
            </ButtonLink>
          </div>
        </Reveal>
        <div className="relative flex items-center justify-center overflow-hidden bg-ink px-8 py-20 md:px-16">
          <div aria-hidden="true" className="absolute inset-0 hidden bg-[radial-gradient(circle_at_50%_50%,rgba(222,160,82,0.16),transparent_60%)] md:block" />
          <Reveal tilt className="w-full max-w-sm md:max-w-md">
            <Frame3D media={pageImages.homeIntro} className="aspect-[4/5] w-full" />
          </Reveal>
        </div>
      </section>

      {/* Collections: pinned sideways scroll on desktop, grid elsewhere */}
      <HorizontalCollections
        collections={collections.filter((col) => col.published)}
        heading={
          <Reveal>
            <SectionHeading kicker={t('nav.collections')} title={t('home.collectionsTitle')} />
          </Reveal>
        }
      />

      {/* Woynu AI */}
      <section className="relative overflow-hidden border-y border-gold/20 bg-ink-soft px-5 py-20 md:px-10 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/2 hidden h-[60vh] w-[45vw] -translate-y-1/2 rounded-full bg-gold/10 blur-[130px] md:block"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="soon-badge">{a('homeKicker')}</p>
            <h2 className={`mt-5 ${headingClass} text-4xl sm:text-5xl md:text-6xl`}>
              <SplitTitle text={a('title')} />
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-ivory/70">{a('intro')}</p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gold/85">{a('comingSoonNote')}</p>
            <div className="mt-10">
              <ButtonLink to="/woynu-ai" variant="ghost">
                {a('previewCta')}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal tilt delay={120} className="mx-auto w-full max-w-sm">
            <Tilt3D className="aspect-[4/5] w-full" max={10}>
              <div aria-hidden="true" className="absolute -inset-4 border border-gold/35" style={depth(-40)} />
              <div className="absolute inset-0 overflow-hidden bg-ink shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
                <WeaveTiles className="absolute inset-x-6 bottom-6 top-20" />
              </div>
              <p className="absolute left-6 top-6 font-serif text-3xl italic text-gold" style={depth(50)}>
                Woynu AI
              </p>
              <p className="soon-badge absolute right-5 top-7" style={depth(70)}>
                {a('comingSoon')}
              </p>
            </Tilt3D>
          </Reveal>
        </div>
      </section>

      {/* Statement */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <PlaceholderImage media={pageImages.homeStatement} className="h-full" kenburns showCaption={false} />
        </div>
        <div className="absolute inset-0 z-[3] bg-ink/55" />
        <div className="relative z-[4] flex min-h-[70vh] items-end px-5 py-20 md:px-12">
          {/* Each word lights up as the section scrolls through the screen */}
          <p className={`${headingClass} max-w-5xl text-5xl sm:text-6xl md:text-8xl`}>
            <ScrubText text={t('home.quote1')} className="block text-ivory" />
            <ScrubText text={t('home.quote2')} className="block italic text-gold" />
          </p>
        </div>
      </section>

      {/* Culture */}
      <section className="bg-cream px-5 py-20 text-ink md:px-10 md:py-28">
        <Reveal>
          <p className="mb-4 text-[11px] uppercase tracking-[0.38em] text-amber-deep">{t('nav.culture')}</p>
          <h2 className={`max-w-4xl ${headingClass} text-4xl sm:text-5xl md:text-6xl`}>
            <SplitTitle text={t('home.cultureTitle')} light />
          </h2>
          <p className="mt-6 max-w-2xl text-ink/70">{t('home.cultureText')}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cultureTeasers.map((title, i) => (
            <Reveal key={title} tilt delay={i * 90}>
              <Tilt3D auto max={10}>
                <Link
                  to="/culture"
                  className="group relative block h-full border border-ink/10 bg-ivory p-7 shadow-[0_30px_60px_-35px_rgba(10,9,8,0.6)]"
                >
                  <span className="text-3d block font-serif text-6xl font-bold italic" style={depth(40)}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-6 font-serif text-3xl font-normal" style={depth(30)}>
                    {c(title)}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink/65">[Culture copy — Client Content Needed]</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-earth">
                    {t('home.readMore')}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </section>

      <CraftsmanshipTimeline />

      {/* Occasions */}
      <section className="overflow-hidden bg-ivory px-5 py-20 text-ink md:px-10 md:py-28">
        <Reveal>
          <p className="mb-4 text-[11px] uppercase tracking-[0.38em] text-amber-deep">{t('home.occasionsKicker')}</p>
          <h2 className={`max-w-4xl ${headingClass} text-4xl sm:text-5xl md:text-6xl`}>
            <SplitTitle text={t('home.occasionsTitle')} light />
          </h2>
        </Reveal>
        <div className={`mt-12 ${snapRow}`}>
          {occasions.map((o) => (
            <div key={o.id} className={snapItem}>
              <Tilt3D className="aspect-[4/5] w-full" max={9}>
                <div className="absolute inset-0 overflow-hidden shadow-[0_40px_70px_-35px_rgba(10,9,8,0.8)]">
                  <PlaceholderImage media={o.image} className="absolute inset-0 h-full w-full" showCaption={false} />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />
                </div>
                <div aria-hidden="true" className="absolute inset-3 border border-ivory/20" style={depth(25)} />
                <div className="absolute inset-x-0 bottom-0 p-6" style={depth(60)}>
                  <h3 className="font-serif text-3xl font-normal text-ivory">{c(o.title)}</h3>
                  <p className="mt-2 text-sm text-ivory/70">{o.text}</p>
                </div>
              </Tilt3D>
            </div>
          ))}
        </div>
      </section>

      {/* Seen & worn */}
      <section className="overflow-hidden bg-ink px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <SectionHeading kicker={t('home.seenKicker')} title={t('home.seenTitle')} />
          <p className="mt-6 max-w-xl text-ivory/70">{t('home.seenText')}</p>
        </Reveal>
        <div className="mt-12">
          <Gallery photos={facebookPhotos} />
        </div>
        <div className="mt-12 text-center">
          <ButtonLink to={social.facebook.href} variant="ghost">
            {t('home.seeFacebook')} · {brand.facebookFollowers} {t('brand.followers')}
          </ButtonLink>
        </div>
      </section>

      <Testimonials />

      {/* Journal */}
      <section className="overflow-hidden bg-ink-soft px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <SectionHeading kicker={t('nav.journal')} title={t('home.journalTitle')} />
        </Reveal>
        <div className={`mt-12 ${snapRow}`}>
          {journal
            .filter((j) => j.published)
            .map((post) => (
              <Link key={post.id} to={`/journal/${post.slug}`} className={`group ${snapItem}`}>
                <Tilt3D className="aspect-[4/5] w-full" max={9}>
                  <div className="absolute inset-0 overflow-hidden shadow-[0_40px_70px_-35px_rgba(0,0,0,0.9)]">
                    <PlaceholderImage media={post.cover} className="absolute inset-0 h-full w-full" showCaption={false} />
                    <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-transparent" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6" style={depth(60)}>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{c(post.category)}</p>
                    <h3 className="mt-2 font-serif text-3xl font-normal text-ivory transition group-hover:text-gold">
                      {c(post.title)}
                    </h3>
                  </div>
                </Tilt3D>
              </Link>
            ))}
        </div>
      </section>

      {/* Custom design */}
      <section className="grid lg:grid-cols-2">
        <div className="bg-ivory px-6 py-20 text-ink md:px-14">
          <p className="mb-4 text-[11px] uppercase tracking-[0.38em] text-amber-deep">{t('custom.kicker')}</p>
          <h2 className={`${headingClass} text-4xl sm:text-5xl md:text-6xl`}>
            <SplitTitle text={t('custom.title')} light />
          </h2>
          <p className="mt-6 max-w-md leading-8 text-ink/75">{t('custom.text')}</p>
          <div className="mt-10">
            <CustomDesignForm />
          </div>
        </div>
        <div className="relative hidden items-center justify-center bg-ink px-16 py-20 lg:flex">
          <div className="sticky top-32 w-full max-w-md">
            <Frame3D media={pageImages.homeCustom} className="aspect-[4/5] w-full" caption={t('custom.title')} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative overflow-hidden bg-ink px-5 py-24 text-center md:px-10 md:py-32">
        <div
          aria-hidden="true"
          className="float-3d pointer-events-none absolute left-1/2 top-1/2 hidden h-[50vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[130px] md:block"
        />
        <Reveal tilt className="relative">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('nav.contact')}</p>
          <h2 className={`mt-6 ${headingClass} text-5xl md:text-7xl`}>
            <SplitTitle text={t('home.contactTitle')} />
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-ivory/70">{t('home.contactText')}</p>
          <a
            href={social.phone.href}
            className="mt-10 inline-block font-serif text-4xl font-light text-ivory transition hover:text-gold md:text-5xl"
          >
            {phoneDisplay}
          </a>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to={social.phone.href}>{t('contact.callUs')}</ButtonLink>
            <ButtonLink to={social.whatsapp.href} variant="ghost">
              {t('contact.whatsapp')}
            </ButtonLink>
          </div>
          <a
            href={social.studio.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mt-8 inline-flex min-h-11 items-center gap-3 text-sm text-ivory/70 transition hover:text-gold"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-gold" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
              />
            </svg>
            {t('brand.location')} · {t('contact.directions')}
          </a>
        </Reveal>
      </section>
    </>
  )
}
