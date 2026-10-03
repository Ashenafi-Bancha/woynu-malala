import { Link } from 'react-router-dom'
import type { Collection } from '../content/types'
import { useI18n } from '../i18n'
import { PlaceholderImage } from './PlaceholderImage'
import { Reveal } from './Reveal'
import { Tilt3D, depth } from './Tilt3D'

export function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const { t, c, lang } = useI18n()
  const title = c(collection.title)
  const kicker = lang === 'am' ? collection.kicker.replace('Collection', 'ስብስብ') : collection.kicker
  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="group block"
      aria-label={`${title} — ${t('collections.view')}`}
    >
      <Tilt3D max={9} className="aspect-[4/5] w-full">
        {/* Back layer: offset gold frame gives the card visible depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/25 transition duration-700 group-hover:translate-x-5 group-hover:translate-y-5"
          style={depth(-30)}
        />
        <div className="glow-card absolute inset-0 overflow-hidden bg-ink-soft shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]">
          <PlaceholderImage
            media={collection.cover}
            className="absolute inset-0 h-full w-full"
            showCaption={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-transparent" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-ivory/10" style={depth(25)} />
        <span
          aria-hidden="true"
          className="absolute right-6 top-4 font-serif text-7xl font-semibold italic text-ivory/15 transition duration-700 group-hover:text-gold/40"
          style={depth(45)}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8" style={depth(70)}>
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold">{kicker}</p>
          <h3 className="mt-2 font-serif text-3xl font-normal leading-none text-ivory md:text-4xl">
            {title}
          </h3>
          <p className="mt-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ivory/70 transition group-hover:text-gold">
            {t('collections.view')}
            <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </p>
        </div>
      </Tilt3D>
    </Link>
  )
}

export function CollectionGrid({ collections }: { collections: Collection[] }) {
  return (
    <div className="grid gap-x-8 gap-y-12 px-5 pb-24 sm:grid-cols-2 md:px-10 lg:grid-cols-3">
      {collections.map((c, i) => (
        <Reveal key={c.id} delay={(i % 3) * 120}>
          <CollectionCard collection={c} index={i} />
        </Reveal>
      ))}
    </div>
  )
}
