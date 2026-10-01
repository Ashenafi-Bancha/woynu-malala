import { useEffect, useRef, useState } from 'react'
import { craftSteps } from '../content/site'
import { useI18n } from '../i18n'
import { prefersReducedMotion } from '../lib/device'
import { loadGsap } from '../lib/gsap'
import { CraftsmanshipTimeline } from './CraftsmanshipTimeline'
import { PlaceholderImage } from './PlaceholderImage'

/** Pinning needs room and a steady viewport, so phones and reduced-motion users get the list. */
const canPin = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches && !prefersReducedMotion()

/**
 * The making process as a pinned scroll section: the screen holds still while the steps
 * (inspiration → design → materials → craft → final look) appear one by one.
 */
export function ProcessPinned() {
  const { t, c } = useI18n()
  const [pin] = useState(canPin)
  const [active, setActive] = useState(0)
  const stage = useRef<HTMLElement>(null)
  const count = craftSteps.length

  useEffect(() => {
    if (!pin || !stage.current) return
    let kill = () => {}
    let cancelled = false
    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled || !stage.current) return
      const trigger = ScrollTrigger.create({
        trigger: stage.current,
        start: 'top top',
        end: `+=${count * 75}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
      })
      kill = () => trigger.kill()
    })
    return () => {
      cancelled = true
      kill()
    }
  }, [pin, count])

  if (!pin) return <CraftsmanshipTimeline heading={false} />

  return (
    <section ref={stage} aria-label={t('process.title')} className="relative h-screen overflow-hidden bg-ink">
      <div className="mx-auto grid h-full max-w-[1500px] items-center gap-12 px-12 pt-24 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{t('process.kicker')}</p>
          <p className="mt-3 font-serif text-xl italic text-ivory/60">{t('process.text')}</p>

          {/* Steps are stacked; only the active one is visible */}
          <ol className="relative mt-10 min-h-[19rem]">
            {craftSteps.map((step, i) => (
              <li
                key={step.id}
                aria-hidden={i !== active}
                className={`absolute inset-0 transition duration-700 ease-out ${
                  i === active ? 'translate-y-0 opacity-100' : i < active ? '-translate-y-8 opacity-0' : 'translate-y-8 opacity-0'
                }`}
              >
                <p className="text-3d font-serif text-8xl font-bold italic lg:text-9xl">{step.number}</p>
                <h2 className="mt-4 font-serif text-5xl font-light lg:text-6xl">{c(step.title)}</h2>
                <p className="mt-5 max-w-md leading-7 text-ivory/70">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex items-center gap-4" aria-hidden="true">
            <span className="font-serif text-lg italic text-gold">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <div className="flex flex-1 gap-1.5">
              {craftSteps.map((step, i) => (
                <span key={step.id} className={`h-px flex-1 transition-colors duration-500 ${i <= active ? 'bg-gold' : 'bg-ivory/15'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <div aria-hidden="true" className="absolute -inset-4 border border-gold/30" />
          {craftSteps.map((step, i) => (
            <div
              key={step.id}
              aria-hidden={i !== active}
              className={`absolute inset-0 overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] transition duration-700 ease-out ${
                i === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
              }`}
            >
              <PlaceholderImage
                media={step.image}
                className="absolute inset-0 h-full w-full"
                showCaption={false}
                lowResPlacement="center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
