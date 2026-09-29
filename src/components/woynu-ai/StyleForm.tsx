import { useState, type FormEvent } from 'react'
import {
  accessoryOptions,
  ageGroupOptions,
  colorOptions,
  genderOptions,
  occasionOptions,
  styleOptions,
} from '../../woynu-ai/shared/options'
import { MAX_NOTE_LENGTH, type Accessory, type ColorId, type WoynuPreferences } from '../../woynu-ai/shared/types'
import { useAiText } from '../../woynu-ai/strings'
import { Button } from '../Button'
import { ColorSwatches, OptionCards } from './StyleOptions'
import { StyleStep } from './StyleStep'

export type Draft = Partial<WoynuPreferences>

const TOTAL_STEPS = 6

/** Which fields must be filled before leaving each step. */
const REQUIRED: (keyof WoynuPreferences)[][] = [
  ['gender', 'ageGroup'],
  ['occasion'],
  ['stylePreference'],
  ['primaryColor'],
  [],
  [],
]

type StyleFormProps = {
  draft: Draft
  onDraftChange: (draft: Draft) => void
  step: number
  onStepChange: (step: number) => void
  onSubmit: () => void
}

export function StyleForm({ draft, onDraftChange, step, onStepChange, onSubmit }: StyleFormProps) {
  const { a } = useAiText()
  const [showErrors, setShowErrors] = useState(false)
  const set = <K extends keyof WoynuPreferences>(key: K, value: WoynuPreferences[K] | undefined) =>
    onDraftChange({ ...draft, [key]: value })

  const missing = (key: keyof WoynuPreferences) => showErrors && REQUIRED[step].includes(key) && !draft[key]
  const stepComplete = REQUIRED[step].every((key) => Boolean(draft[key]))
  const last = step === TOTAL_STEPS - 1

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!stepComplete) return setShowErrors(true)
    setShowErrors(false)
    if (last) onSubmit()
    else onStepChange(step + 1)
  }

  const note = draft.additionalPreferences ?? ''

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-4xl">
      {step === 0 ? (
        <StyleStep index={0} total={TOTAL_STEPS} title={a('s1')} help={a('s1Help')}>
          <OptionCards
            name="gender"
            legend={a('gender')}
            options={genderOptions}
            mode="single"
            value={draft.gender}
            onChange={(v) => set('gender', v as WoynuPreferences['gender'])}
            columns="grid-cols-1 sm:grid-cols-3"
            error={missing('gender') ? a('required') : undefined}
          />
          <OptionCards
            name="ageGroup"
            legend={a('age')}
            options={ageGroupOptions}
            mode="single"
            value={draft.ageGroup}
            onChange={(v) => set('ageGroup', v as WoynuPreferences['ageGroup'])}
            columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            error={missing('ageGroup') ? a('required') : undefined}
          />
        </StyleStep>
      ) : null}

      {step === 1 ? (
        <StyleStep index={1} total={TOTAL_STEPS} title={a('s2')} help={a('s2Help')}>
          <OptionCards
            name="occasion"
            legend={a('occasion')}
            options={occasionOptions}
            mode="single"
            value={draft.occasion}
            onChange={(v) => set('occasion', v as WoynuPreferences['occasion'])}
            columns="grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4"
            large
            error={missing('occasion') ? a('required') : undefined}
          />
        </StyleStep>
      ) : null}

      {step === 2 ? (
        <StyleStep index={2} total={TOTAL_STEPS} title={a('s3')} help={a('s3Help')}>
          <OptionCards
            name="stylePreference"
            legend={a('style')}
            options={styleOptions}
            mode="single"
            value={draft.stylePreference}
            onChange={(v) => set('stylePreference', v as WoynuPreferences['stylePreference'])}
            columns="grid-cols-1 md:grid-cols-3"
            large
            error={missing('stylePreference') ? a('required') : undefined}
          />
        </StyleStep>
      ) : null}

      {step === 3 ? (
        <StyleStep index={3} total={TOTAL_STEPS} title={a('s4')} help={a('s4Help')}>
          <ColorSwatches
            name="primaryColor"
            legend={a('primary')}
            options={colorOptions}
            value={draft.primaryColor}
            onChange={(v) => {
              const primaryColor = v as ColorId
              onDraftChange({
                ...draft,
                primaryColor,
                secondaryColor: draft.secondaryColor === primaryColor ? undefined : draft.secondaryColor,
              })
            }}
            error={missing('primaryColor') ? a('required') : undefined}
          />
          <ColorSwatches
            name="secondaryColor"
            legend={a('secondary')}
            options={colorOptions}
            value={draft.secondaryColor}
            onChange={(v) => set('secondaryColor', v as ColorId | undefined)}
            noneLabel={a('none')}
            disabledId={draft.primaryColor}
          />
        </StyleStep>
      ) : null}

      {step === 4 ? (
        <StyleStep index={4} total={TOTAL_STEPS} title={a('s5')} help={a('s5Help')}>
          <OptionCards
            name="accessories"
            legend={a('accessories')}
            options={accessoryOptions}
            mode="multiple"
            value={draft.accessories ?? []}
            onChange={(v) => {
              const list = v as Accessory[]
              // "No accessories" and specific accessories are mutually exclusive
              const added = list.find((x) => !(draft.accessories ?? []).includes(x))
              const next = added === 'none' ? ['none'] : list.filter((x) => x !== 'none')
              set('accessories', next as Accessory[])
            }}
            columns="grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3"
          />
        </StyleStep>
      ) : null}

      {step === 5 ? (
        <StyleStep index={5} total={TOTAL_STEPS} title={a('s6')}>
          <div>
            <label htmlFor="woynu-note" className="text-[11px] uppercase tracking-[0.32em] text-gold">
              {a('s6Label')}
            </label>
            <textarea
              id="woynu-note"
              value={note}
              maxLength={MAX_NOTE_LENGTH}
              onChange={(e) => set('additionalPreferences', e.target.value)}
              placeholder={a('s6Placeholder')}
              aria-describedby="woynu-note-help woynu-note-count"
              rows={4}
              className="mt-4 block w-full resize-y border border-ivory/20 bg-ink-soft p-4 text-base text-ivory outline-none transition placeholder:text-stone focus:border-gold"
            />
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-ivory/50">
              <p id="woynu-note-help" className="max-w-lg">
                {a('s6Privacy')}
              </p>
              <p id="woynu-note-count" aria-live="polite">
                {MAX_NOTE_LENGTH - note.length} {a('charsLeft')}
              </p>
            </div>
          </div>
        </StyleStep>
      ) : null}

      <div className="sticky bottom-0 z-10 -mx-5 mt-12 flex items-center justify-between gap-3 border-t border-ivory/10 bg-ink/95 px-5 py-4 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
        <button
          type="button"
          onClick={() => {
            setShowErrors(false)
            onStepChange(step - 1)
          }}
          disabled={step === 0}
          className="min-h-11 px-2 text-[11px] uppercase tracking-[0.28em] text-ivory/70 transition hover:text-gold disabled:invisible"
        >
          ← {a('back')}
        </button>
        <Button type="submit" className={last ? 'px-6 sm:px-9' : ''}>
          {last ? a('cta') : `${a('next')} →`}
        </Button>
      </div>
    </form>
  )
}
