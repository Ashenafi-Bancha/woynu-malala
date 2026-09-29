import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n'
import { Button } from './Button'

const STORAGE_KEY = 'woynu-inquiries'

/** Values to prefill, e.g. from a Woynu AI style (so visitors don't re-enter their choices). */
export type DesignRequestPrefill = {
  gender?: 'Woman' | 'Man' | 'Child' | 'Prefer not to say'
  occasion?: string
  preferredStyle?: string
  preferredColors?: string
  description?: string
  /** JSON summary of the Woynu AI concept, stored with the inquiry for the studio */
  woynuAiConcept?: string
}

export function CustomDesignForm({ prefill }: { prefill?: DesignRequestPrefill }) {
  const [sent, setSent] = useState(false)
  const { t } = useI18n()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[]
    existing.push({
      ...data,
      status: 'new',
      createdAt: new Date().toISOString(),
      imageName: (form.elements.namedItem('reference') as HTMLInputElement | null)?.files?.[0]?.name ?? '',
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    setSent(true)
    form.reset()
  }

  if (sent) {
    return (
      <p className="border border-gold/40 bg-ink-soft px-6 py-10 text-center text-ivory/85">
        {t('form.sent')}
      </p>
    )
  }

  const field =
    'w-full min-h-11 border-0 border-b border-ivory/25 bg-transparent py-3 text-base md:text-sm text-ivory outline-none transition placeholder:text-stone focus:border-gold'
  const label = 'mt-8 block text-[10px] uppercase tracking-[0.28em] text-gold'

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <label className={label} htmlFor="name">
        {t('form.name')}
      </label>
      <input className={field} id="name" name="name" required autoComplete="name" />

      <label className={label} htmlFor="phone">
        {t('form.phone')}
      </label>
      <input className={field} id="phone" name="phone" type="tel" required autoComplete="tel" />

      <label className={label} htmlFor="email">
        {t('form.email')}
      </label>
      <input className={field} id="email" name="email" type="email" required autoComplete="email" />

      <label className={label} htmlFor="gender">
        {t('form.gender')}
      </label>
      <select className={`${field} rounded-none`} id="gender" name="gender" required defaultValue={prefill?.gender ?? ''}>
        <option value="" disabled>
          {t('form.select')}
        </option>
        <option value="Woman">{t('form.woman')}</option>
        <option value="Man">{t('form.man')}</option>
        <option value="Child">{t('form.child')}</option>
        <option value="Prefer not to say">{t('form.noSay')}</option>
      </select>

      <label className={label} htmlFor="occasion">
        {t('form.occasion')}
      </label>
      <input className={field} id="occasion" name="occasion" required defaultValue={prefill?.occasion} />

      <label className={label} htmlFor="preferredStyle">
        {t('form.style')}
      </label>
      <input className={field} id="preferredStyle" name="preferredStyle" defaultValue={prefill?.preferredStyle} />

      <label className={label} htmlFor="preferredColors">
        {t('form.colors')}
      </label>
      <input className={field} id="preferredColors" name="preferredColors" defaultValue={prefill?.preferredColors} />

      <label className={label} htmlFor="size">
        {t('form.size')}
      </label>
      <input className={field} id="size" name="size" />

      <label className={label} htmlFor="eventDate">
        {t('form.date')}
      </label>
      <input className={field} id="eventDate" name="eventDate" type="date" />

      <label className={label} htmlFor="description">
        {t('form.description')}
      </label>
      <textarea
        className={`${field} min-h-32 resize-y`}
        id="description"
        name="description"
        required
        defaultValue={prefill?.description}
      />
      {prefill?.woynuAiConcept ? <input type="hidden" name="woynuAiConcept" value={prefill.woynuAiConcept} /> : null}

      <label className={label} htmlFor="reference">
        {t('form.reference')}
      </label>
      <input
        className="mt-3 block w-full text-sm text-ivory file:mr-4 file:border file:border-gold file:bg-transparent file:px-4 file:py-2 file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-gold"
        id="reference"
        name="reference"
        type="file"
        accept="image/*"
      />

      <Button className="mt-10" type="submit">
        {t('form.submit')}
      </Button>
    </form>
  )
}
