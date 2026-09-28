import { Link } from 'react-router-dom'
import { journal } from '../content/site'
import { PageHeader } from '../components/PageHeader'
import { PlaceholderImage } from '../components/PlaceholderImage'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { Tilt3D, depth } from '../components/Tilt3D'
import { useI18n } from '../i18n'

export function JournalPage() {
  const { t, c } = useI18n()
  const posts = journal.filter((j) => j.published)
  return (
    <div>
      <Seo title="Journal" path="/journal" description="Fashion stories, cultural notes, and studio writing from Woynu Malala Cultural Cloth Design and Decor." />
      <PageHeader kicker={t('journal.kicker')} title={t('nav.journal')} intro={t('journal.intro')} />
      <div className="grid gap-8 px-5 pb-24 md:grid-cols-2 md:px-10 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} tilt delay={(i % 3) * 100}>
            <Link to={`/journal/${post.slug}`} className="group block">
              <Tilt3D className="aspect-[4/5] w-full" max={9}>
                <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 border border-gold/25" style={depth(-30)} />
                <div className="absolute inset-0 overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]">
                  <PlaceholderImage media={post.cover} className="absolute inset-0 h-full w-full" showCaption={false} />
                  <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8" style={depth(60)}>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{c(post.category)}</p>
                  <h2 className="mt-2 font-serif text-3xl font-normal text-ivory transition group-hover:text-gold md:text-4xl">
                    {c(post.title)}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm text-ivory/70">{post.excerpt}</p>
                  <p className="mt-4 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-ivory/70 group-hover:text-gold">
                    {t('journal.read')}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-2">
                      →
                    </span>
                  </p>
                </div>
              </Tilt3D>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
