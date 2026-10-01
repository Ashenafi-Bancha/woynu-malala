import {
  accessoryOptions,
  colorOptions,
  dinguzaOption,
  heritageThemeOptions,
  labelOf,
  occasionOptions,
  styleOptions,
} from '../../woynu-ai/shared/options'
import type { WoynuStyleResult } from '../../woynu-ai/shared/types'
import { useAiText } from '../../woynu-ai/strings'
import { Button, ButtonLink } from '../Button'
import { Reveal } from '../Reveal'
import { SplitTitle, headingClass } from '../SplitTitle'
import { Tilt3D, depth } from '../Tilt3D'
import { TryOn } from './TryOn'

type StyleResultProps = {
  result: WoynuStyleResult
  onGenerateAgain: () => void
  onChangePreferences: () => void
  onRequestDesign: () => void
}

/** Localised title built from the chosen options (the server's English title is the fallback). */
export function useStyleTitle(result: WoynuStyleResult) {
  const { lang } = useAiText()
  if (lang === 'en') return result.specification.title
  const { stylePreference, occasion } = result.preferences
  const { heritageTheme, dinguza } = result.specification
  const occasionLabel = occasion === 'other' ? 'ልዩ ዝግጅት' : labelOf(occasionOptions, occasion, 'am')
  const theme = heritageTheme && heritageTheme !== 'none' ? `${labelOf(heritageThemeOptions, heritageTheme, 'am')} · ` : ''
  return `${theme}${labelOf(styleOptions, stylePreference, 'am')} ${dinguza ? 'የድንጉዛ ' : ''}የ${occasionLabel} ዘይቤ`
}

export function StyleResult({ result, onGenerateAgain, onChangePreferences, onRequestDesign }: StyleResultProps) {
  const { a, lang } = useAiText()
  const { preferences: prefs, specification: spec, design } = result
  const title = useStyleTitle(result)
  const accessories = spec.accessories.filter((x) => x !== 'none')

  const rows: [string, React.ReactNode][] = [
    [a('occasion'), labelOf(occasionOptions, prefs.occasion, lang)],
    [a('style'), labelOf(styleOptions, prefs.stylePreference, lang)],
    [
      a('palette'),
      <span key="palette" className="flex flex-wrap items-center gap-3">
        {spec.palette.map((id) => (
          <span key={id} className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-5 w-5 rounded-full border border-ivory/25"
              style={{ backgroundColor: colorOptions.find((c) => c.id === id)?.hex }}
            />
            {labelOf(colorOptions, id, lang)}
          </span>
        ))}
      </span>,
    ],
    [a('concept'), spec.clothingConcept],
    [a('accessories'), accessories.length ? accessories.map((x) => labelOf(accessoryOptions, x, lang)).join(', ') : labelOf(accessoryOptions, 'none', lang)],
    [a('inspiration'), spec.designInspiration.length ? spec.designInspiration.join(' · ') : '—'],
  ]
  if (spec.dinguza) rows.splice(2, 0, [a('cloth'), dinguzaOption.label[lang]])
  if (spec.heritageTheme && spec.heritageTheme !== 'none') {
    rows.splice(2, 0, [a('theme'), labelOf(heritageThemeOptions, spec.heritageTheme, lang)])
  }
  if (spec.styleNotes.length) rows.push([a('notes'), spec.styleNotes.join(', ')])

  return (
    <div>
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal tilt className="mx-auto w-full max-w-md lg:sticky lg:top-28">
          <Tilt3D className="aspect-[2/3] w-full" max={7}>
            <div aria-hidden="true" className="absolute -inset-4 border border-gold/35" style={depth(-45)} />
            <figure className="absolute inset-0 overflow-hidden bg-ink-soft shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
              <img src={design.imageUrl} alt={`${design.alt} — ${title}`} className="h-full w-full object-cover" />
            </figure>
            <p
              className="absolute bottom-4 left-4 right-4 bg-ink/70 px-3 py-2 text-center text-[10px] uppercase tracking-[0.25em] text-ivory/80 backdrop-blur-sm"
              style={depth(40)}
            >
              {a('inspirationLabel')}
            </p>
          </Tilt3D>
        </Reveal>

        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{a('resultKicker')}</p>
          <h1 className={`mt-4 ${headingClass} text-5xl md:text-6xl`}>
            <SplitTitle text={title} />
          </h1>
          <div className="gold-rule mt-8 w-40" />
          <p className="mt-6 max-w-xl leading-8 text-ivory/70">{spec.summary}</p>
          {design.mode === 'preview' ? (
            <p className="mt-6 border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-bright">{a('preview')}</p>
          ) : null}

          <h2 className="mt-12 text-[11px] uppercase tracking-[0.35em] text-gold">{a('profile')}</h2>
          <dl className="mt-4 divide-y divide-ivory/10 border-y border-ivory/10">
            {rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="text-xs uppercase tracking-[0.2em] text-ivory/50">{label}</dt>
                <dd className="text-ivory/90">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="ghost" onClick={onGenerateAgain}>
              {a('again')}
            </Button>
            <Button type="button" variant="ghost" onClick={onChangePreferences}>
              {a('change')}
            </Button>
            <a
              href={design.imageUrl}
              download={`woynu-style.${design.mode === 'preview' ? 'svg' : 'jpg'}`}
              className="inline-flex min-h-11 items-center justify-center border border-ivory/35 px-7 py-3 text-center text-[11px] uppercase tracking-[0.28em] text-ivory transition hover:border-gold hover:text-gold"
            >
              {a('download')}
            </a>
            <ButtonLink to="/contact" variant="ghost">
              {a('contact')}
            </ButtonLink>
          </div>
        </div>
      </div>

      <TryOn key={result.id} result={result} />

      {/* Business conversion */}
      <Reveal tilt className="relative mt-24 overflow-hidden border border-gold/30 bg-ink-soft px-6 py-14 text-center md:px-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 hidden h-64 w-[70%] -translate-x-1/2 rounded-full bg-gold/15 blur-[100px] md:block"
        />
        <h2 className={`relative ${headingClass} text-4xl md:text-6xl`}>
          <SplitTitle text={a('loveTitle')} />
        </h2>
        <p className="relative mx-auto mt-6 max-w-xl text-ivory/70">{a('loveText')}</p>
        <Button type="button" onClick={onRequestDesign} className="relative mt-10 px-10">
          {a('request')}
        </Button>
      </Reveal>
    </div>
  )
}
