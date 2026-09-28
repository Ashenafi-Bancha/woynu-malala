import { Link, useParams } from 'react-router-dom'
import { journal } from '../content/site'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { useI18n } from '../i18n'

export function JournalArticlePage() {
  const { slug } = useParams()
  const { t, c } = useI18n()
  const post = journal.find((j) => j.slug === slug && j.published)

  if (!post) {
    return (
      <div className="px-5 py-40 text-center">
        <h1 className="font-serif text-4xl font-semibold italic">{t('journal.notFound')}</h1>
        <Link to="/journal" className="mt-6 inline-block text-gold">
          {t('journal.back')}
        </Link>
      </div>
    )
  }

  return (
    <article>
      <Seo title={post.title} path={`/journal/${post.slug}`} description={post.excerpt} />
      <PageHeader kicker={c(post.category)} title={c(post.title)} intro={post.excerpt} media={post.cover} />
      <Reveal className="mx-auto max-w-2xl px-5 pb-24">
        <p className="text-lg leading-9 text-ivory/80">{post.body}</p>
        <Link
          to="/journal"
          className="mt-12 inline-flex min-h-11 items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-gold"
        >
          <span aria-hidden="true">←</span> {t('journal.back')}
        </Link>
      </Reveal>
    </article>
  )
}
