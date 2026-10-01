import type { FormEvent } from 'react'
import { useI18n } from '../i18n'
import { openWhatsApp } from '../lib/whatsapp'
import { Button } from './Button'

/**
 * Short order/question form. The site has no server, so submitting opens WhatsApp with
 * the message written out; the visitor presses send there.
 */
export function OrderForm() {
  const { t } = useI18n()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (key: string) => String(data.get(key) ?? '').trim()
    openWhatsApp([
      'Hello Woynu Malala,',
      `My name is ${get('name')}.`,
      `I am interested in: ${get('interest')}.`,
      get('occasion') && `Occasion / date: ${get('occasion')}.`,
      '',
      get('message'),
      '',
      '(Sent from the Woynu Malala website)',
    ])
  }

  const field =
    'mt-2 w-full min-h-11 border-0 border-b border-ivory/25 bg-transparent py-3 text-base text-ivory outline-none transition placeholder:text-stone focus:border-gold md:text-sm'
  const label = 'mt-7 block text-[10px] uppercase tracking-[0.28em] text-gold first:mt-0'

  return (
    <form onSubmit={onSubmit}>
      <label className={label} htmlFor="order-name">
        {t('order.name')}
      </label>
      <input className={field} id="order-name" name="name" required autoComplete="name" />

      <label className={label} htmlFor="order-interest">
        {t('order.interest')}
      </label>
      <select className={`${field} rounded-none`} id="order-interest" name="interest" defaultValue="A ready-made piece">
        <option value="A ready-made piece">{t('order.ready')}</option>
        <option value="A custom design">{t('order.custom')}</option>
        <option value="Décor">{t('order.decor')}</option>
        <option value="Something else">{t('order.other')}</option>
      </select>

      <label className={label} htmlFor="order-occasion">
        {t('order.occasion')}
      </label>
      <input className={field} id="order-occasion" name="occasion" />

      <label className={label} htmlFor="order-message">
        {t('order.message')}
      </label>
      <textarea className={`${field} min-h-28 resize-y`} id="order-message" name="message" required />

      <Button type="submit" className="mt-9 w-full sm:w-auto">
        {t('order.send')}
      </Button>
      <p className="mt-4 text-xs leading-5 text-ivory/50">{t('order.note')}</p>
    </form>
  )
}
