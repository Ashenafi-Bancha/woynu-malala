import { pageImages } from '../content/media'
import { story } from '../content/site'
import { PageHeader } from '../components/PageHeader'
import { ParallaxImage } from '../components/ParallaxImage'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { Tilt3D, depth } from '../components/Tilt3D'
import { useI18n } from '../i18n'

export function StoryPage() {
  const { t, c } = useI18n()
  return (
    <article>
      <Seo title="Our Story" path="/story" description="The story of Woynu Malala Cultural Cloth Design and Decor — Wolaita heritage reimagined as contemporary fashion." />
      <PageHeader
        kicker={t('story.kicker')}
        title={t('story.title')}
        intro={t('story.intro')}
      >
        <p className="mt-6 text-sm text-ivory/60">
          {t('story.designer')}: {story.designer}
        </p>
      </PageHeader>

      <ParallaxImage media={pageImages.storyBanner} className="mb-20 h-[42vh] md:mb-28 md:h-[62vh]" />

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 sm:grid-cols-2 md:gap-8 md:px-10 lg:grid-cols-3">
        {story.blocks.map((block, i) => (
          <Reveal key={block.title} tilt delay={(i % 3) * 100}>
            <Tilt3D auto max={9}>
              <div className="relative h-full border border-ivory/10 bg-ink-soft p-7 shadow-[0_40px_70px_-40px_rgba(0,0,0,0.95)] md:p-9">
                <span className="text-3d block font-serif text-6xl font-bold italic" style={depth(40)}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-6 font-serif text-3xl font-normal md:text-4xl">{c(block.title)}</h2>
                <p className="mt-4 leading-7 text-ivory/70">{block.text}</p>
              </div>
            </Tilt3D>
          </Reveal>
        ))}
      </div>
    </article>
  )
}
