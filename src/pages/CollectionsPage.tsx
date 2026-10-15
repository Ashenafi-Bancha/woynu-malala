import { useState } from 'react'
import { collectionCategories, collectionFilters, collections, type CollectionFilter } from '../content/site'
import { useI18n } from '../i18n'
import { DinguzaBand } from '../components/Backdrop3D'
import { CollectionGrid } from '../components/CollectionCard'
import { SplitTitle, headingClass } from '../components/SplitTitle'
import { Seo } from '../components/Seo'

export function CollectionsPage() {
  const { t, c } = useI18n()
  const [filter, setFilter] = useState<CollectionFilter>('All')
  const published = collections.filter((col) => col.published)
  const shown =
    filter === 'All' ? published : published.filter((col) => collectionCategories[col.slug]?.includes(filter))

  return (
    <div className="relative overflow-hidden">
      <Seo title="Collections" path="/collections" description="Explore Wolaita heritage and contemporary collections by Woynu Malala Cultural Cloth Design and Decor." />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 hidden h-[50vh] w-[50vw] rounded-full bg-gold/10 blur-[140px] md:block"
      />
      <DinguzaBand />
      {/* The opening is shown at once (no fade-in), so the page's main text appears without delay */}
      <div className="relative px-5 pb-10 pt-6 md:px-10 md:pb-12 md:pt-8">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
          {t('collections.kicker')} · {String(published.length).padStart(2, '0')} {t('collections.count')}
        </p>
        <h1 className={`mt-5 ${headingClass} text-5xl sm:text-6xl md:text-8xl`}>
          <SplitTitle text={t('home.collectionsTitle')} />
        </h1>
        <div className="mt-8 flex flex-col gap-6">
          <p className="max-w-xl text-base leading-8 text-ivory/65 md:text-lg">{t('collections.intro')}</p>
          <p className="hidden text-[10px] uppercase tracking-[0.3em] text-ivory/45 md:block">{t('collections.hint')}</p>
        </div>
      </div>

      {/* Category filter: the chips wrap onto more lines when they do not fit */}
      <div
        role="group"
        aria-label={t('collections.filter')}
        className="relative mb-10 flex flex-wrap gap-2 px-5 md:mb-14 md:px-10"
      >
        {collectionFilters.map((f) => {
          const active = f === filter
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`min-h-11 border px-5 text-[11px] uppercase tracking-[0.24em] transition ${
                active ? 'border-gold bg-gold text-ink' : 'border-ivory/25 text-ivory/80 hover:border-gold hover:text-gold'
              }`}
            >
              {c(f)}
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {shown.length ? (
          // The key restarts the reveal animation for the newly filtered set
          <CollectionGrid key={filter} collections={shown} />
        ) : (
          <p className="px-5 pb-24 text-ivory/60 md:px-10">{t('collections.empty')}</p>
        )}
      </div>
    </div>
  )
}
