import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n'
import type { Key } from '../../i18n/strings'
import { canRender3D, hasFinePointer, whenIdle } from '../../lib/device'
import { SceneBoundary } from '../Backdrop3D'
import { DINGUZA_COLORS } from '../hero/dinguzaPattern'
import { Reveal } from '../Reveal'
import { SplitTitle, headingClass } from '../SplitTitle'
import { TriDots } from '../Tricolour'
import type { MotifVariant } from './HeritageScene'

const HeritageScene = lazy(() => import('./HeritageScene'))

const { red: RED, black: BLACK, yellow: YELLOW } = DINGUZA_COLORS

/** Flat drawing of each motif: shown at once, and kept on devices that skip 3D. */
function MotifIcon({ variant }: { variant: MotifVariant }) {
  const stroke = { stroke: YELLOW, strokeWidth: 2 }
  return (
    <svg viewBox="0 0 120 120" className="h-1/2 w-1/2" aria-hidden="true">
      {variant === 'spear' ? (
        <g transform="rotate(-24 60 60)">
          <rect x="57" y="34" width="6" height="80" fill="#6b4423" />
          <rect x="54" y="62" width="12" height="26" fill={RED} {...stroke} />
          <path d="M60 4 L70 30 L60 40 L50 30 Z" fill="#d9d4cc" />
        </g>
      ) : null}
      {variant === 'shield' ? (
        <g>
          <circle cx="60" cy="60" r="52" fill={YELLOW} />
          <circle cx="60" cy="60" r="48" fill={BLACK} />
          <circle cx="60" cy="60" r="42" fill={RED} />
          <circle cx="60" cy="60" r="28" fill={BLACK} {...stroke} />
          <circle cx="60" cy="60" r="18" fill={RED} />
          <circle cx="60" cy="60" r="7" fill={YELLOW} />
        </g>
      ) : null}
      {variant === 'gates' ? (
        <g>
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              d={`M${8 + i * 15.5} 96 V64 a6 6 0 0 1 12 0 V96`}
              fill="none"
              stroke={[RED, BLACK, YELLOW][i % 3]}
              strokeWidth="5"
            />
          ))}
          <rect x="4" y="98" width="112" height="3" fill={YELLOW} />
        </g>
      ) : null}
      {variant === 'kings' ? (
        <g>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d="M-16 0 H16 V-22 H10 V-16 H4 V-28 H-4 V-16 H-10 V-22 H-16 Z"
              transform={`translate(${30 + i * 30} ${70 + (i === 1 ? -12 : 0)})`}
              fill={[RED, BLACK, YELLOW][i]}
              {...stroke}
            />
          ))}
          <text x="60" y="104" textAnchor="middle" fill={YELLOW} fontSize="20" fontFamily="serif" fontStyle="italic">
            50+
          </text>
        </g>
      ) : null}
    </svg>
  )
}

/** One motif: the flat drawing first, then the 3D version once the card is near the screen. */
function MotifCard({ variant, title, text }: { variant: MotifVariant; title: string; text: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [use3D, setUse3D] = useState(false)
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = box.current
    if (!el || !canRender3D()) return
    let timer = 0
    let cancelIdle = () => {}
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting && !timer) {
          cancelIdle = whenIdle(() => {
            timer = window.setTimeout(() => setUse3D(true), hasFinePointer() ? 100 : 700)
          })
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelIdle()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ivory/10 bg-ink-soft">
      <div ref={box} className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_50%_45%,rgba(222,160,82,0.16),transparent_65%)]">
        <div className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>
          <MotifIcon variant={variant} />
        </div>
        {use3D ? (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <SceneBoundary onError={() => setUse3D(false)}>
              <Suspense fallback={null}>
                <HeritageScene variant={variant} active={active} onReady={() => setReady(true)} />
              </Suspense>
            </SceneBoundary>
          </div>
        ) : null}
      </div>
      <div className="flex-1 p-6">
        <h3 className="font-serif text-2xl text-ivory md:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-ivory/70">{text}</p>
      </div>
    </article>
  )
}

const MOTIFS: { variant: MotifVariant; title: Key; text: Key }[] = [
  { variant: 'kings', title: 'heritage.kingsTitle', text: 'heritage.kingsText' },
  { variant: 'gates', title: 'heritage.gatesTitle', text: 'heritage.gatesText' },
  { variant: 'spear', title: 'heritage.spearTitle', text: 'heritage.spearText' },
  { variant: 'shield', title: 'heritage.shieldTitle', text: 'heritage.shieldText' },
]

/**
 * "Wolaita history in our designs": the kings, the seven gates, the spear and the shield,
 * each as a turning 3D piece in the Dinguza pattern.
 */
export function HeritageMotifs() {
  const { t } = useI18n()
  return (
    <section className="px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
            <TriDots />
            {t('heritage.kicker')}
          </p>
          <h2 className={`mt-4 ${headingClass} text-4xl sm:text-5xl md:text-6xl`}>
            <SplitTitle text={t('heritage.title')} />
          </h2>
          <p className="mt-6 max-w-2xl leading-8 text-ivory/70">{t('heritage.intro')}</p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MOTIFS.map((m, i) => (
            <Reveal key={m.variant} tilt delay={(i % 4) * 90}>
              <MotifCard variant={m.variant} title={t(m.title)} text={t(m.text)} />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-xs text-ivory/50">{t('heritage.note')}</p>
      </div>
    </section>
  )
}
