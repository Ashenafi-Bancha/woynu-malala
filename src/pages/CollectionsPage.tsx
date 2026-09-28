import { collections } from '../content/site'
import { useI18n } from '../i18n'
import { CollectionGrid } from '../components/CollectionCard'
import { Reveal } from '../components/Reveal'
import { SplitTitle, headingClass } from '../components/SplitTitle'
import { Seo } from '../components/Seo'

export function CollectionsPage() {
  const { t } = useI18n()
  const published = collections.filter((c) => c.published)
  return (
    <div className="relative overflow-hidden pt-24">
      <Seo title="Collections" path="/collections" description="Explore Wolaita heritage and contemporary collections by Woynu Malala Cultural Cloth Design and Decor." />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 hidden h-[50vh] w-[50vw] rounded-full bg-gold/10 blur-[140px] md:block"
      />
      <Reveal className="relative px-5 pb-16 pt-16 md:px-10 md:pb-20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
          {t('collections.kicker')} · {String(published.length).padStart(2, '0')} {t('collections.count')}
        </p>
        <h1 className={`mt-5 ${headingClass} text-5xl sm:text-6xl md:text-8xl`}>
          <SplitTitle text={t('home.collectionsTitle')} />
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-base leading-8 text-ivory/65 md:text-lg">
            {t('collections.intro')}
          </p>
          <p className="hidden text-[10px] uppercase tracking-[0.3em] text-ivory/45 md:block">
            {t('collections.hint')}
          </p>
        </div>
      </Reveal>
      <CollectionGrid collections={published} />
    </div>
  )
}
