import { pageImages } from '../../content/media'
import { useAiText } from '../../woynu-ai/strings'
import { Button } from '../Button'
import { Frame3D } from '../Frame3D'
import { Reveal } from '../Reveal'
import { SplitTitle, headingClass } from '../SplitTitle'
import { Tilt3D, depth } from '../Tilt3D'

export function WoynuAIIntro({ onStart }: { onStart: () => void }) {
  const { a } = useAiText()
  const steps = [
    [a('how1'), a('how1Text')],
    [a('how2'), a('how2Text')],
    [a('how3'), a('how3Text')],
  ]

  return (
    <div>
      <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <p className="soon-badge mb-5">{a('comingSoon')}</p>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{a('kicker')}</p>
          <p className="mt-6 font-serif text-3xl italic text-gold md:text-4xl">Woynu AI</p>
          <h1 className={`mt-2 ${headingClass} text-5xl sm:text-6xl md:text-7xl`}>
            <SplitTitle text={a('title')} />
          </h1>
          <div className="gold-rule mt-8 w-40" />
          <p className="mt-8 max-w-xl text-base leading-8 text-ivory/70 md:text-lg">{a('intro')}</p>
          <Button type="button" onClick={onStart} className="mt-10 w-full px-10 sm:w-auto">
            {a('cta')}
          </Button>
        </Reveal>
        <Reveal tilt delay={150} className="mx-auto w-full max-w-[18rem] sm:max-w-sm">
          <Frame3D media={pageImages.woynuAiIntro} className="aspect-[4/5] w-full" caption="Woynu AI" priority />
        </Reveal>
      </div>

      <ol className="mt-20 grid gap-6 md:grid-cols-3">
        {steps.map(([title, text], i) => (
          <li key={title}>
            <Reveal tilt delay={i * 100}>
              <Tilt3D auto max={9}>
                <div className="h-full border border-ivory/10 bg-ink-soft p-7 shadow-[0_40px_70px_-40px_rgba(0,0,0,0.95)]">
                  <span className="text-3d block font-serif text-5xl font-bold italic" style={depth(40)}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="mt-5 font-serif text-2xl">{title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ivory/65">{text}</p>
                </div>
              </Tilt3D>
            </Reveal>
          </li>
        ))}
      </ol>

      <p className="mx-auto mt-14 max-w-3xl border-l-2 border-gold/60 pl-5 text-sm leading-7 text-ivory/60">
        {a('disclaimer')}
      </p>
    </div>
  )
}
