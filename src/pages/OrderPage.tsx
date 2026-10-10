import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DinguzaBand } from '../components/Backdrop3D'
import { Button, ButtonLink } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { SplitTitle, headingClass } from '../components/SplitTitle'
import { TriDots } from '../components/Tricolour'
import { collections, phoneDisplay, social } from '../content/site'
import { useI18n } from '../i18n'
import type { Key } from '../i18n/strings'
import { openWhatsApp } from '../lib/whatsapp'

// The site has no server and takes no payment. The order form writes the order out as a
// WhatsApp message to the studio; the studio then confirms the details with the customer.

/** Each choice keeps an English value (what the studio reads) and a translated label. */
type Choice = { value: string; label: Key }

const ORDER_TYPES: Choice[] = [
  { value: 'A design from a collection', label: 'buy.typeReady' },
  { value: 'A custom design', label: 'buy.typeCustom' },
  { value: 'Décor', label: 'buy.typeDecor' },
]
const FOR_WHOM: Choice[] = [
  { value: 'Woman', label: 'buy.forWoman' },
  { value: 'Man', label: 'buy.forMan' },
  { value: 'Child', label: 'buy.forChild' },
  { value: 'Couple', label: 'buy.forCouple' },
  { value: 'Family or group', label: 'buy.forGroup' },
]
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const OCCASIONS: Choice[] = [
  { value: 'Wedding', label: 'buy.occWedding' },
  { value: 'Holiday or celebration', label: 'buy.occHoliday' },
  { value: 'Graduation', label: 'buy.occGraduation' },
  { value: 'Church or ceremony', label: 'buy.occCeremony' },
  { value: 'Everyday wear', label: 'buy.occEveryday' },
  { value: 'Other', label: 'buy.occOther' },
]
const RECEIVE: Choice[] = [
  { value: 'Pick up at the studio in Wolaita Sodo', label: 'buy.pickup' },
  { value: 'Ask about delivery', label: 'buy.delivery' },
]
const CONTACT_BY: Choice[] = [
  { value: 'WhatsApp', label: 'buy.byWhatsapp' },
  { value: 'Phone call', label: 'buy.byCall' },
]

const published = collections.filter((c) => c.published)

const field =
  'mt-2 w-full min-h-12 rounded-lg border border-ivory/20 bg-ink px-4 py-3 text-base text-ivory outline-none transition placeholder:text-ivory/35 focus:border-gold'
const labelClass = 'block text-[11px] uppercase tracking-[0.24em] text-gold'

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-2 text-xs leading-5 text-ivory/50">{hint}</p> : null}
    </div>
  )
}

/** A row of large tap targets where exactly one is chosen. */
function Choices({
  name,
  legend,
  options,
  value,
  onChange,
  render,
}: {
  name: string
  legend: string
  options: string[]
  value: string
  onChange: (value: string) => void
  render: (option: string) => string
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => (
          <label
            key={option}
            className={`flex min-h-12 cursor-pointer items-center rounded-lg border px-4 py-2.5 text-sm transition ${
              value === option
                ? 'border-gold bg-gold text-ink'
                : 'border-ivory/20 text-ivory/85 hover:border-gold hover:text-gold'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {render(option)}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-ivory/10 bg-ink-soft p-5 md:p-8">
      <h2 className="flex items-center gap-4 font-serif text-2xl text-ivory md:text-3xl">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold font-sans text-sm font-semibold text-ink">
          {number}
        </span>
        {title}
      </h2>
      <div className="mt-7 grid gap-7">{children}</div>
    </section>
  )
}

export function OrderPage() {
  const { t, c } = useI18n()
  const [params] = useSearchParams()
  const startCollection = published.find((col) => col.slug === params.get('collection'))
  const startDesign = startCollection?.designs.find((d) => d.id === params.get('design'))

  const [type, setType] = useState(ORDER_TYPES[0].value)
  const [collection, setCollection] = useState(startCollection?.slug ?? '')
  const [design, setDesign] = useState(startDesign?.id ?? '')
  const [forWhom, setForWhom] = useState(FOR_WHOM[0].value)
  const [quantity, setQuantity] = useState('1')
  const [size, setSize] = useState('')
  const [measures, setMeasures] = useState({ height: '', chest: '', waist: '', hip: '' })
  const [occasion, setOccasion] = useState('')
  const [neededBy, setNeededBy] = useState('')
  const [notes, setNotes] = useState('')
  const [receive, setReceive] = useState(RECEIVE[0].value)
  const [town, setTown] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [contactBy, setContactBy] = useState(CONTACT_BY[0].value)

  const labelOf = (choices: Choice[]) => (value: string) => t(choices.find((x) => x.value === value)!.label)
  const chosenCollection = published.find((col) => col.slug === collection)
  const chosenDesign = chosenCollection?.designs.find((d) => d.id === design)
  const fromCollection = type === ORDER_TYPES[0].value
  const wantsDelivery = receive === RECEIVE[1].value
  const measureText = (['height', 'chest', 'waist', 'hip'] as const)
    .filter((k) => measures[k].trim())
    .map((k) => `${k} ${measures[k].trim()} cm`)
    .join(', ')

  // What the studio will read, line by line (always in English)
  const message = useMemo(
    () => [
      'Hello Woynu Malala, I would like to place an order.',
      '',
      '*ORDER*',
      `Type: ${type}`,
      fromCollection && chosenCollection && `Collection: ${chosenCollection.title}`,
      fromCollection && chosenDesign && `Design: ${chosenDesign.name}`,
      `For: ${forWhom}`,
      `Quantity: ${quantity || '1'}`,
      size && `Size: ${size}`,
      measureText && `Measurements: ${measureText}`,
      occasion && `Occasion: ${occasion}`,
      neededBy && `Needed by: ${neededBy}`,
      notes.trim() && `Notes: ${notes.trim()}`,
      '',
      '*RECEIVING IT*',
      wantsDelivery ? `Delivery to: ${town.trim() || '(town to be agreed)'}` : receive,
      '',
      '*MY DETAILS*',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Please contact me by: ${contactBy}`,
      '',
      '(Sent from the order page of the Woynu Malala website)',
    ],
    [type, fromCollection, chosenCollection, chosenDesign, forWhom, quantity, size, measureText, occasion, neededBy, notes, wantsDelivery, town, receive, name, phone, contactBy],
  )

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    openWhatsApp(message)
  }

  // The same order, shown back to the customer in their own language before sending
  const summary: [string, string][] = [
    [t('buy.sumType'), labelOf(ORDER_TYPES)(type)],
    ...(fromCollection && chosenCollection ? ([[t('buy.collection'), c(chosenCollection.title)]] as [string, string][]) : []),
    ...(fromCollection && chosenDesign ? ([[t('buy.design'), chosenDesign.name]] as [string, string][]) : []),
    [t('buy.forWhom'), labelOf(FOR_WHOM)(forWhom)],
    [t('buy.quantity'), quantity || '1'],
    ...(size ? ([[t('buy.size'), size]] as [string, string][]) : []),
    ...(occasion ? ([[t('buy.occasion'), labelOf(OCCASIONS)(occasion)]] as [string, string][]) : []),
    ...(neededBy ? ([[t('buy.neededBy'), neededBy]] as [string, string][]) : []),
    [t('buy.sumReceive'), wantsDelivery ? `${t('buy.delivery')}${town.trim() ? ` · ${town.trim()}` : ''}` : t('buy.pickup')],
  ]

  const steps: [Key, Key][] = [
    ['buy.how1Title', 'buy.how1Text'],
    ['buy.how2Title', 'buy.how2Text'],
    ['buy.how3Title', 'buy.how3Text'],
    ['buy.how4Title', 'buy.how4Text'],
  ]

  return (
    <div className="relative overflow-hidden">
      <Seo
        title="Order"
        path="/order"
        description="Order Wolaita cultural clothing from Woynu Malala Cultural Cloth Design and Decor: choose a design, add your size and occasion, and send your order on WhatsApp."
      />
      <DinguzaBand />

      {/* Opening */}
      <header className="relative px-5 pb-12 pt-6 md:px-12 md:pb-16 md:pt-8">
        <Reveal className="mx-auto max-w-[1100px]">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
            <TriDots />
            {t('buy.kicker')}
          </p>
          <h1 className={`mt-5 ${headingClass} text-5xl sm:text-6xl md:text-7xl`}>
            <SplitTitle text={t('buy.title')} />
          </h1>
          <div className="gold-rule mt-8 w-40" />
          <p className="mt-8 max-w-2xl text-base leading-8 text-ivory/70 md:text-lg">{t('buy.intro')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="#order-form">{t('buy.start')}</ButtonLink>
            <ButtonLink to={social.phone.href} variant="ghost">
              {t('buy.callInstead')} · {phoneDisplay}
            </ButtonLink>
          </div>
        </Reveal>
      </header>

      {/* How it works */}
      <section className="bg-cream px-5 py-16 text-ink md:px-12 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[11px] uppercase tracking-[0.38em] text-amber-deep">
            <TriDots />
            {t('buy.howKicker')}
          </p>
          <h2 className={`mt-4 ${headingClass} text-4xl md:text-5xl`}>
            <SplitTitle text={t('buy.howTitle')} light />
          </h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([title, text], i) => (
              <li key={title} className="rounded-2xl bg-ivory p-6 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.45)]">
                <span className="font-serif text-4xl italic text-amber-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-serif text-2xl">{t(title)}</h3>
                <p className="mt-3 text-sm leading-7 text-ink/70">{t(text)}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-ink/70">{t('buy.noPayment')}</p>
        </div>
      </section>

      {/* The order form */}
      <section id="order-form" className="scroll-mt-24 px-5 py-16 md:px-12 md:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <form onSubmit={onSubmit} className="grid gap-6">
            <Step number={1} title={t('buy.step1')}>
              <Choices
                name="type"
                legend={t('buy.type')}
                options={ORDER_TYPES.map((x) => x.value)}
                value={type}
                onChange={setType}
                render={labelOf(ORDER_TYPES)}
              />
              {fromCollection ? (
                <>
                  <Field id="buy-collection" label={t('buy.collection')} hint={t('buy.collectionHint')}>
                    <select
                      id="buy-collection"
                      className={field}
                      value={collection}
                      onChange={(e) => {
                        setCollection(e.target.value)
                        setDesign('')
                      }}
                    >
                      <option value="">{t('buy.notSure')}</option>
                      {published.map((col) => (
                        <option key={col.slug} value={col.slug}>
                          {c(col.title)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {chosenCollection && chosenCollection.designs.length ? (
                    <Field id="buy-design" label={t('buy.design')}>
                      <select id="buy-design" className={field} value={design} onChange={(e) => setDesign(e.target.value)}>
                        <option value="">{t('buy.notSure')}</option>
                        {chosenCollection.designs.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ) : null}
                </>
              ) : null}
            </Step>

            <Step number={2} title={t('buy.step2')}>
              <Choices
                name="for"
                legend={t('buy.forWhom')}
                options={FOR_WHOM.map((x) => x.value)}
                value={forWhom}
                onChange={setForWhom}
                render={labelOf(FOR_WHOM)}
              />
              <Field id="buy-quantity" label={t('buy.quantity')}>
                <input
                  id="buy-quantity"
                  className={`${field} max-w-32`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Field>
              <Choices
                name="size"
                legend={t('buy.size')}
                options={[...SIZES, 'Not sure']}
                value={size}
                onChange={setSize}
                render={(option) => (option === 'Not sure' ? t('buy.notSure') : option)}
              />
              <fieldset>
                <legend className={labelClass}>{t('buy.measures')}</legend>
                <p className="mt-2 text-xs leading-5 text-ivory/50">{t('buy.measuresHint')}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(['height', 'chest', 'waist', 'hip'] as const).map((k) => (
                    <label key={k} className="block text-xs text-ivory/70">
                      {t(`buy.${k}` as Key)}
                      <input
                        className={`${field} mt-1`}
                        inputMode="decimal"
                        placeholder="cm"
                        value={measures[k]}
                        onChange={(e) => setMeasures((m) => ({ ...m, [k]: e.target.value }))}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            </Step>

            <Step number={3} title={t('buy.step3')}>
              <Field id="buy-occasion" label={t('buy.occasion')}>
                <select id="buy-occasion" className={field} value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                  <option value="">{t('buy.choose')}</option>
                  {OCCASIONS.map((x) => (
                    <option key={x.value} value={x.value}>
                      {t(x.label)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="buy-date" label={t('buy.neededBy')} hint={t('buy.neededHint')}>
                <input id="buy-date" className={field} type="date" value={neededBy} onChange={(e) => setNeededBy(e.target.value)} />
              </Field>
              <Field id="buy-notes" label={t('buy.notes')} hint={t('buy.notesHint')}>
                <textarea id="buy-notes" className={`${field} min-h-28 resize-y`} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Field>
            </Step>

            <Step number={4} title={t('buy.step4')}>
              <Choices
                name="receive"
                legend={t('buy.receive')}
                options={RECEIVE.map((x) => x.value)}
                value={receive}
                onChange={setReceive}
                render={labelOf(RECEIVE)}
              />
              {wantsDelivery ? (
                <Field id="buy-town" label={t('buy.town')} hint={t('buy.deliveryHint')}>
                  <input id="buy-town" className={field} value={town} onChange={(e) => setTown(e.target.value)} autoComplete="address-level2" />
                </Field>
              ) : null}
            </Step>

            <Step number={5} title={t('buy.step5')}>
              <Field id="buy-name" label={t('buy.name')}>
                <input id="buy-name" className={field} required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field id="buy-phone" label={t('buy.phone')}>
                <input
                  id="buy-phone"
                  className={field}
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="09…"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
              <Choices
                name="contact-by"
                legend={t('buy.contactBy')}
                options={CONTACT_BY.map((x) => x.value)}
                value={contactBy}
                onChange={setContactBy}
                render={labelOf(CONTACT_BY)}
              />
            </Step>

            <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5 md:p-8">
              <Button type="submit" className="w-full">
                {t('buy.send')}
              </Button>
              <p className="mt-4 text-sm leading-6 text-ivory/70">{t('buy.sendNote')}</p>
            </div>
          </form>

          {/* The order so far */}
          <aside className="rounded-2xl border border-ivory/10 bg-ink-soft p-6 lg:sticky lg:top-28" aria-live="polite">
            <h2 className="font-serif text-2xl text-gold">{t('buy.summary')}</h2>
            <dl className="mt-5 divide-y divide-ivory/10 text-sm">
              {summary.map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4 py-3">
                  <dt className="text-ivory/55">{term}</dt>
                  <dd className="text-right text-ivory">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-5 text-ivory/55">{t('buy.summaryNote')}</p>
            <a href={social.phone.href} className="mt-5 inline-flex min-h-11 items-center text-[11px] uppercase tracking-[0.24em] text-gold hover:text-gold-bright">
              {t('buy.callInstead')} · {phoneDisplay}
            </a>
          </aside>
        </div>
      </section>
    </div>
  )
}
