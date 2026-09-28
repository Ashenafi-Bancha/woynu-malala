import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function EditorialSection({
  kicker,
  title,
  children,
  invert = false,
}: {
  kicker?: string
  title: ReactNode
  children: ReactNode
  invert?: boolean
}) {
  return (
    <section className={invert ? 'bg-ivory px-5 py-24 text-ink md:px-10' : 'bg-ink px-5 py-24 md:px-10'}>
      <Reveal>
        <SectionHeading kicker={kicker} title={title} />
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  )
}
