import { useEffect, useRef, type ReactNode } from 'react'
import { useAiText } from '../../woynu-ai/strings'

type StyleStepProps = {
  index: number
  total: number
  title: string
  help?: string
  children: ReactNode
}

/** One step of the consultation: progress, heading, and content. Moves focus to the heading on change. */
export function StyleStep({ index, total, title, help, children }: StyleStepProps) {
  const { a } = useAiText()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [index])

  return (
    <section aria-labelledby={`woynu-step-${index}`}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.32em] text-ivory/55">
          {a('step')} {index + 1} {a('of')} {total}
        </p>
        <p className="font-serif text-lg italic text-gold" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </p>
      </div>
      <div
        className="mt-3 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label={`${a('step')} ${index + 1} ${a('of')} ${total}`}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1 transition-colors duration-500 ${i <= index ? 'bg-gold' : 'bg-ivory/15'}`}
          />
        ))}
      </div>
      <h2
        id={`woynu-step-${index}`}
        ref={headingRef}
        tabIndex={-1}
        className="mt-10 font-serif text-4xl font-light outline-none md:text-5xl"
      >
        {title}
      </h2>
      {help ? <p className="mt-3 max-w-xl text-ivory/65">{help}</p> : null}
      <div className="mt-8 space-y-10">{children}</div>
    </section>
  )
}
