import { craftSteps } from '../content/site'
import { useI18n } from '../i18n'
import { Frame3D } from './Frame3D'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function CraftsmanshipTimeline({ heading = true }: { heading?: boolean }) {
  const { t, c } = useI18n()
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-20 md:px-10 md:py-28">
      {heading ? (
        <Reveal>
          <SectionHeading kicker={t('process.kicker')} title={t('process.title')} />
          <p className="mt-6 max-w-xl text-ivory/75">{t('process.text')}</p>
        </Reveal>
      ) : null}
      <ol className="relative mt-12 md:mt-16">
        {/* Gold spine connecting the steps */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-4 top-0 w-px bg-linear-to-b from-gold/60 via-gold/25 to-transparent md:left-1/2"
        />
        {craftSteps.map((step, i) => (
          <li
            key={step.id}
            className="relative grid items-center gap-8 py-10 pl-12 md:grid-cols-2 md:gap-20 md:py-16 md:pl-0"
          >
            <span
              aria-hidden="true"
              className="absolute left-4 top-12 h-3 w-3 -translate-x-1/2 rotate-45 border border-gold bg-ink md:left-1/2 md:top-1/2"
            />
            <Reveal tilt className={`w-full max-w-md ${i % 2 === 1 ? 'md:order-2 md:justify-self-start' : 'md:justify-self-end'}`}>
              <Frame3D media={step.image} className="aspect-[4/5] w-full" max={8} />
            </Reveal>
            <Reveal delay={120} className={i % 2 === 1 ? 'md:justify-self-end md:text-right' : ''}>
              <p className="text-3d font-serif text-7xl font-bold italic md:text-8xl">{step.number}</p>
              <h3 className="mt-4 font-serif text-4xl font-normal text-ivory">{c(step.title)}</h3>
              <p className={`mt-5 max-w-md leading-7 text-ivory/75 ${i % 2 === 1 ? 'md:ml-auto' : ''}`}>{step.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
