import type { ReactNode } from 'react'
import { SplitTitle, headingClass } from './SplitTitle'

type Props = {
  kicker?: string
  title: ReactNode
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export function SectionHeading({
  kicker,
  title,
  align = 'left',
  light = false,
  className = '',
}: Props) {
  return (
    <header
      className={`${align === 'center' ? 'text-center mx-auto' : ''} max-w-4xl ${className}`}
    >
      {kicker ? (
        <p
          className={`mb-4 text-[11px] uppercase tracking-[0.38em] ${light ? 'text-amber-deep' : 'text-gold'}`}
        >
          {kicker}
        </p>
      ) : null}
      <h2
        className={`${headingClass} text-4xl sm:text-5xl md:text-6xl`}
      >
        {typeof title === 'string' ? <SplitTitle text={title} light={light} /> : title}
      </h2>
    </header>
  )
}
