import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { requestTryOn, WoynuRequestError } from '../../woynu-ai/api'
import { preparePhoto } from '../../woynu-ai/photo'
import { TRY_ON_AGE_GROUPS, type TryOnResult, type WoynuErrorCode, type WoynuStyleResult } from '../../woynu-ai/shared/types'
import { useAiText } from '../../woynu-ai/strings'
import { Button } from '../Button'
import { Reveal } from '../Reveal'
import { SplitTitle, headingClass } from '../SplitTitle'
import { GenerationLoading } from './GenerationLoading'

type Phase = 'choose' | 'loading' | 'result' | 'error'

/**
 * Virtual try-on: the visitor uploads a photo and sees themselves in their design.
 * The photo lives only in this component's memory and is cleared on "Remove" or when
 * the visitor leaves. It is never put in storage or passed to the design request.
 */
export function TryOn({ result }: { result: WoynuStyleResult }) {
  const { a, errorText } = useAiText()
  const inputId = useId()
  const consentId = useId()
  const [phase, setPhase] = useState<Phase>('choose')
  const [photo, setPhoto] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [photoError, setPhotoError] = useState(false)
  const [tryOn, setTryOn] = useState<TryOnResult | null>(null)
  const [errorCode, setErrorCode] = useState<WoynuErrorCode | 'network'>('generation_failed')
  const inFlight = useRef<AbortController | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => () => inFlight.current?.abort(), [])

  const allowed = TRY_ON_AGE_GROUPS.includes(result.preferences.ageGroup)

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // lets the same file be chosen again, and drops the browser's reference
    if (!file) return
    setPhotoError(false)
    try {
      setPhoto(await preparePhoto(file))
      setTryOn(null)
      setPhase('choose')
    } catch {
      setPhotoError(true)
    }
  }

  const removePhoto = () => {
    inFlight.current?.abort()
    setPhoto(null)
    setTryOn(null)
    setConsent(false)
    setPhase('choose')
  }

  const submit = async () => {
    if (!photo || !consent) return
    inFlight.current?.abort()
    const controller = new AbortController()
    inFlight.current = controller
    setPhase('loading')
    try {
      const next = await requestTryOn(
        { preferences: result.preferences, photo, design: result.design.imageUrl, consent: true },
        controller.signal,
      )
      setTryOn(next)
      setPhase('result')
    } catch (err) {
      if (controller.signal.aborted) return
      setErrorCode(err instanceof WoynuRequestError ? err.code : 'generation_failed')
      setPhase('error')
    }
  }

  return (
    <Reveal tilt className="mt-24">
      <section aria-labelledby={`${inputId}-title`} className="border border-ivory/10 bg-ink-soft px-5 py-12 md:px-12 md:py-16">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{a('tryKicker')}</p>
        <h2 id={`${inputId}-title`} className={`mt-4 ${headingClass} text-4xl md:text-6xl`}>
          <SplitTitle text={a('tryTitle')} />
        </h2>
        <p className="mt-5 max-w-2xl text-ivory/70">{a('tryText')}</p>
        {/* Always mounted so "Try another photo" works from the result view too */}
        <input
          ref={fileInput}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={onFile}
          className="sr-only"
          disabled={!allowed}
        />

        {!allowed ? (
          <p className="mt-8 border-l-2 border-gold/60 pl-4 text-sm text-ivory/70">{a('tryAdultsOnly')}</p>
        ) : phase === 'loading' ? (
          <GenerationLoading title={a('tryLoading')} />
        ) : phase === 'result' && tryOn && photo ? (
          <div className="mt-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <figure>
                <img src={photo} alt={a('tryYourPhoto')} className="aspect-[2/3] w-full border border-ivory/10 object-cover" />
                <figcaption className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ivory/50">{a('tryYourPhoto')}</figcaption>
              </figure>
              <figure>
                <img src={tryOn.imageUrl} alt={tryOn.alt} className="aspect-[2/3] w-full border border-gold/40 object-cover" />
                <figcaption className="mt-3 text-[10px] uppercase tracking-[0.3em] text-gold">{a('tryResultLabel')}</figcaption>
              </figure>
            </div>
            {tryOn.mode === 'preview' ? (
              <p className="mt-6 border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-bright">{a('tryPreview')}</p>
            ) : null}
            <p className="mt-6 text-sm text-ivory/60">{a('tryDisclaimer')}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <a
                href={tryOn.imageUrl}
                download={`woynu-try-on.${tryOn.mode === 'preview' ? 'svg' : 'jpg'}`}
                className="inline-flex min-h-11 items-center justify-center border border-gold bg-gold px-6 py-3 text-center text-[11px] uppercase tracking-[0.28em] text-ink transition hover:bg-gold-bright"
              >
                {a('tryDownload')}
              </a>
              <Button type="button" variant="ghost" onClick={() => fileInput.current?.click()}>
                {a('tryAgain')}
              </Button>
              <Button type="button" variant="ghost" onClick={removePhoto}>
                {a('tryRemove')}
              </Button>
            </div>
            <p className="mt-4 text-xs text-ivory/45">{a('tryNotSaved')}</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <div>
              {photo ? (
                <div className="relative">
                  <img src={photo} alt={a('tryYourPhoto')} className="mx-auto max-h-[28rem] w-auto border border-ivory/15 object-contain" />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button type="button" variant="ghost" onClick={() => fileInput.current?.click()}>
                      {a('tryChange')}
                    </Button>
                    <Button type="button" variant="ghost" onClick={removePhoto}>
                      {a('tryRemove')}
                    </Button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor={inputId}
                  className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 border border-dashed border-gold/50 bg-ink/60 px-6 py-10 text-center transition hover:border-gold hover:bg-gold/5 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-bright"
                >
                  <svg viewBox="0 0 24 24" className="h-10 w-10 text-gold" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8-4h-3.2l-1.8-2H9L7.2 5H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-8 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                    />
                  </svg>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-ivory">{a('tryChoose')}</span>
                  <span className="max-w-xs text-sm text-ivory/55">{a('tryTips')}</span>
                </label>
              )}
              {photoError ? (
                <p role="alert" className="mt-3 text-sm text-gold-bright">
                  {a('tryPhotoError')}
                </p>
              ) : null}
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.32em] text-gold">{a('tryPrivacyTitle')}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-ivory/70">
                {(['tryPrivacy1', 'tryPrivacy2', 'tryPrivacy3', 'tryPrivacy4'] as const).map((key) => (
                  <li key={key} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                    {a(key)}
                  </li>
                ))}
              </ul>
              <label htmlFor={consentId} className="mt-8 flex cursor-pointer gap-3 text-sm leading-6 text-ivory/85">
                <input
                  id={consentId}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#dea052]"
                />
                {a('tryConsent')}
              </label>
              {phase === 'error' ? (
                <p role="alert" className="mt-6 text-sm text-gold-bright">
                  {errorText(errorCode)}
                </p>
              ) : null}
              <Button type="button" onClick={submit} disabled={!photo || !consent} className="mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10">
                {phase === 'error' ? a('retry') : a('tryButton')}
              </Button>
            </div>
          </div>
        )}
      </section>
    </Reveal>
  )
}
