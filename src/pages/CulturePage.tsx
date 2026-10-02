import { pageImages } from '../content/media'
import { cultureTopics } from '../content/site'
import { PageHeader } from '../components/PageHeader'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { Tilt3D, depth } from '../components/Tilt3D'
import { useI18n } from '../i18n'

// The header's 3D ring is built from the topic photos
const topicPhotos = cultureTopics.map((topic) => topic.image.src)

export function CulturePage() {
  const { t, c } = useI18n()
  return (
    <article>
      <Seo
        title="The Culture Behind the Design"
        path="/culture"
        description="Patterns, fabrics, occasions, and symbolism behind Wolaita cultural clothing at Woynu Malala Cultural Cloth Design and Decor."
      />
      <PageHeader
        kicker={t('culture.kicker')}
        title={c('The culture behind the design')}
        intro={t('culture.intro')}
        media={pageImages.cultureHeader}
        scene="ring"
        photos={topicPhotos}
      />

      <div className="grid gap-6 px-5 pb-24 sm:grid-cols-2 md:gap-8 md:px-10 lg:grid-cols-4">
        {cultureTopics.map((topic, i) => (
          <Reveal key={topic.id} tilt delay={(i % 4) * 90}>
            <Tilt3D auto max={10}>
              <section className="relative h-full bg-ink-soft shadow-[0_40px_70px_-40px_rgba(0,0,0,0.95)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <PlaceholderImage media={topic.image} className="absolute inset-0 h-full w-full" showCaption={false} />
                  <div className="absolute inset-0 bg-linear-to-t from-ink-soft via-transparent to-transparent" />
                </div>
                <span
                  className="text-3d absolute right-5 top-4 font-serif text-5xl font-bold italic"
                  style={depth(50)}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="p-6 md:p-7">
                  <h2 className="font-serif text-2xl font-normal md:text-3xl">{c(topic.title)}</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/70">{topic.explanation}</p>
                </div>
              </section>
            </Tilt3D>
          </Reveal>
        ))}
      </div>
    </article>
  )
}
