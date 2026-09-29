import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestWoynuStyle, WoynuRequestError } from '../../woynu-ai/api'
import type { WoynuErrorCode, WoynuStyleResult } from '../../woynu-ai/shared/types'
import { validatePreferences } from '../../woynu-ai/shared/validation'
import { useAiText } from '../../woynu-ai/strings'
import { Button } from '../Button'
import { GenerationLoading } from './GenerationLoading'
import { StyleForm, type Draft } from './StyleForm'
import { StyleResult } from './StyleResult'
import { WoynuAIIntro } from './WoynuAIIntro'

type Phase = 'intro' | 'form' | 'loading' | 'result' | 'error'

/** State passed to /custom so the design request is prefilled. */
export type WoynuDesignRequestState = { woynuStyle: WoynuStyleResult }

export function WoynuAI() {
  const { a, errorText } = useAiText()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('intro')
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>({ accessories: [] })
  const [result, setResult] = useState<WoynuStyleResult | null>(null)
  const [errorCode, setErrorCode] = useState<WoynuErrorCode | 'network'>('generation_failed')
  const inFlight = useRef<AbortController | null>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const lastView = useRef(`${phase}:${step}`)

  // Bring the start of each new phase or step into view (not on first load), and cancel any request on leave.
  useEffect(() => {
    const view = `${phase}:${step}`
    if (lastView.current === view) return
    lastView.current = view
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [phase, step])
  useEffect(() => () => inFlight.current?.abort(), [])

  const generate = async () => {
    const validation = validatePreferences(draft)
    if (!validation.ok) {
      setErrorCode('invalid_input')
      setPhase('error')
      return
    }
    inFlight.current?.abort()
    const controller = new AbortController()
    inFlight.current = controller
    setPhase('loading')
    try {
      const next = await requestWoynuStyle(validation.value, controller.signal)
      setResult(next)
      setPhase('result')
    } catch (err) {
      if (controller.signal.aborted) return
      setErrorCode(err instanceof WoynuRequestError ? err.code : 'generation_failed')
      setPhase('error')
    }
  }

  const requestDesign = () => {
    if (!result) return
    const state: WoynuDesignRequestState = { woynuStyle: result }
    navigate('/custom', { state })
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      {phase === 'intro' ? <WoynuAIIntro onStart={() => setPhase('form')} /> : null}

      {phase === 'form' ? (
        <StyleForm draft={draft} onDraftChange={setDraft} step={step} onStepChange={setStep} onSubmit={generate} />
      ) : null}

      {phase === 'loading' ? <GenerationLoading /> : null}

      {phase === 'result' && result ? (
        <StyleResult
          result={result}
          onGenerateAgain={generate}
          onChangePreferences={() => {
            setStep(0)
            setPhase('form')
          }}
          onRequestDesign={requestDesign}
        />
      ) : null}

      {phase === 'error' ? (
        <div role="alert" className="mx-auto max-w-xl py-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Woynu AI</p>
          <h2 className="mt-5 font-serif text-4xl font-light">{a('errorTitle')}</h2>
          <p className="mt-4 text-ivory/65">{errorText(errorCode)}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button type="button" onClick={generate}>
              {a('retry')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setStep(0)
                setPhase('form')
              }}
            >
              {a('editChoices')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
