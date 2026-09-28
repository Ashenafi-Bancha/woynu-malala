import { Link, useParams } from 'react-router-dom'
import { collections } from '../content/site'
import { ButtonLink } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { Tilt3D, depth } from '../components/Tilt3D'
import { useI18n } from '../i18n'

export function CollectionDetailPage() {
  const { slug } = useParams()
  const { t, c, lang } = useI18n()
  const collection = collections.find((col) => col.slug === slug && col.published)

  if (!collection) {
    return (
      <div className="px-5 py-40 text-center">
        <h1 className="font-serif text-4xl font-normal">{t('collections.notFound')}</h1>
        <Link to="/collections" className="mt-6 inline-block text-gold">
          {t('collections.back')}
        </Link>
      </div>
    )
  }

  const kicker = lang === 'am' ? collection.kicker.replace('Collection', 'ስብስብ') : collection.kicker

  return (
    <article>
      <Seo
        title={collection.title}
        path={`/collections/${collection.slug}`}
        description={collection.intro}
      />
      <PageHeader kicker={kicker} title={c(collection.title)} intro={collection.intro} media={collection.cover}>
        <Link
          to="/collections"
          className="mt-8 inline-flex min-h-11 items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-ivory/60 hover:text-gold"
        >
          <span aria-hidden="true">←</span> {t('collections.back')}
        </Link>
      </PageHeader>

      <section className="px-5 pb-24 md:px-10">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
            {t('collections.designs')} · {String(collection.designs.length).padStart(2, '0')}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {collection.designs.map((design, i) => (
            <Reveal key={design.id} tilt delay={(i % 3) * 100}>
              <Tilt3D className="aspect-[3/4] w-full" max={9}>
                <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/25" style={depth(-30)} />
                <div className="absolute inset-0 overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]">
                  <PlaceholderImage media={design.images[0]} className="absolute inset-0 h-full w-full" showCaption={false} />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6" style={depth(60)}>
                  <h2 className="font-serif text-3xl font-normal text-ivory">{design.name}</h2>
                </div>
              </Tilt3D>
              <p className="mt-6 text-sm leading-7 text-ivory/75">{design.description}</p>
              <p className="mt-2 text-sm italic text-ivory/55">{design.culturalNote}</p>
              <div className="mt-6">
                <ButtonLink to="/custom">{t('collections.inquire')}</ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </article>
  )
}
