import type { ColorOption, Option } from '../../woynu-ai/shared/options'
import { useI18n } from '../../i18n'

const cardBase =
  'relative flex min-h-16 cursor-pointer flex-col justify-center border bg-ink-soft px-5 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-gold/60 has-[:checked]:border-gold has-[:checked]:bg-gold/10 has-[:checked]:shadow-[0_18px_40px_-24px_rgba(222,160,82,0.7)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-bright'

type OptionCardsProps<T extends string> = {
  name: string
  legend: string
  options: Option<T>[]
  /** single: radio buttons; multiple: checkboxes */
  mode: 'single' | 'multiple'
  value: T | T[] | undefined
  onChange: (value: T | T[]) => void
  columns?: string
  large?: boolean
  error?: string
}

/** Accessible option cards: native radios/checkboxes styled as cards. */
export function OptionCards<T extends string>({
  name,
  legend,
  options,
  mode,
  value,
  onChange,
  columns = 'grid-cols-1 sm:grid-cols-2',
  large = false,
  error,
}: OptionCardsProps<T>) {
  const { lang } = useI18n()
  const selected = Array.isArray(value) ? value : value ? [value] : []

  const toggle = (id: T) => {
    if (mode === 'single') return onChange(id)
    const next = selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id]
    onChange(next)
  }

  return (
    <fieldset aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-[11px] uppercase tracking-[0.32em] text-gold">{legend}</legend>
      <div className={`mt-4 grid gap-3 ${columns}`}>
        {options.map((option) => {
          const checked = selected.includes(option.id)
          return (
            <label
              key={option.id}
              className={`${cardBase} ${checked ? 'border-gold' : 'border-ivory/15'} ${large ? 'min-h-28 md:min-h-32' : ''}`}
            >
              <input
                type={mode === 'single' ? 'radio' : 'checkbox'}
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => toggle(option.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`absolute right-4 top-4 h-2.5 w-2.5 rotate-45 border transition ${
                  checked ? 'border-gold bg-gold' : 'border-ivory/30'
                }`}
              />
              <span className={`pr-6 font-serif text-ivory ${large ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                {option.label[lang]}
              </span>
              {option.description ? (
                <span className="mt-1.5 pr-4 text-sm leading-6 text-ivory/60">{option.description[lang]}</span>
              ) : null}
            </label>
          )
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-3 text-sm text-gold-bright">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

type ColorSwatchesProps = {
  name: string
  legend: string
  options: ColorOption[]
  value: string | undefined
  onChange: (value: string | undefined) => void
  /** Adds a "None" choice (used for the optional secondary colour) */
  noneLabel?: string
  disabledId?: string
  error?: string
}

export function ColorSwatches({ name, legend, options, value, onChange, noneLabel, disabledId, error }: ColorSwatchesProps) {
  const { lang } = useI18n()
  const swatch =
    'flex cursor-pointer flex-col items-center gap-2 text-center has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-30 has-[:focus-visible]:[&>span:first-of-type]:outline has-[:focus-visible]:[&>span:first-of-type]:outline-2 has-[:focus-visible]:[&>span:first-of-type]:outline-offset-4 has-[:focus-visible]:[&>span:first-of-type]:outline-gold-bright'

  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="text-[11px] uppercase tracking-[0.32em] text-gold">{legend}</legend>
      <div className="mt-4 grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-5 md:grid-cols-9">
        {noneLabel ? (
          <label className={swatch}>
            <input
              type="radio"
              name={name}
              checked={!value}
              onChange={() => onChange(undefined)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`grid h-12 w-12 place-items-center rounded-full border-2 text-lg text-ivory/50 transition ${
                !value ? 'border-gold' : 'border-ivory/20'
              }`}
            >
              ∅
            </span>
            <span className="text-xs text-ivory/70">{noneLabel}</span>
          </label>
        ) : null}
        {options.map((color) => {
          const checked = value === color.id
          return (
            <label key={color.id} className={swatch}>
              <input
                type="radio"
                name={name}
                value={color.id}
                checked={checked}
                disabled={color.id === disabledId}
                onChange={() => onChange(color.id)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`h-12 w-12 rounded-full border-2 shadow-[inset_0_-6px_12px_rgba(0,0,0,0.25)] transition ${
                  checked ? 'scale-110 border-gold ring-4 ring-gold/25' : 'border-ivory/20'
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className={`text-xs ${checked ? 'text-gold' : 'text-ivory/70'}`}>{color.label[lang]}</span>
            </label>
          )
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-3 text-sm text-gold-bright">
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
