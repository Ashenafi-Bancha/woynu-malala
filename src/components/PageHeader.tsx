import type { ReactNode } from 'react'
import type { MediaAsset } from '../content/types'
import { Frame3D } from './Frame3D'
import { SplitTitle, headingClass } from './SplitTitle'
import { Reveal } from './Reveal'

type PageHeaderProps = {
  kicker: string
  title: ReactNode
  intro?: ReactNode
  media?: MediaAsset
  mediaCaption?: string
  children?: ReactNode
}

/** Shared opening for inner pages: large italic title with an optional 3D framed photo. */
export function PageHeader({ kicker, title, intro, media, mediaCaption, children }: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden px-5 pb-16 pt-28 md:px-12 md:pb-28 md:pt-40">
      <div
        aria-hidden="true"
        className="float-3d pointer-events-none absolute -left-40 top-10 hidden h-[55vh] w-[55vw] rounded-full bg-gold/10 blur-[140px] md:block"
      />
      <div
        aria-hidden="true"
        className="float-3d pointer-events-none absolute -right-20 bottom-0 hidden h-[40vh] w-[35vw] rounded-full bg-earth/25 blur-[120px] [animation-delay:-4s] md:block"
      />
      <div
        className={`relative mx-auto grid max-w-[1500px] items-center gap-16 ${media ? 'lg:grid-cols-[1.2fr_1fr]' : ''}`}
      >
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{kicker}</p>
          <h1 className={`mt-5 ${headingClass} text-5xl sm:text-6xl md:text-8xl`}>
            {typeof title === 'string' ? <SplitTitle text={title} /> : title}
          </h1>
          <div className="gold-rule mt-8 w-40" />
          {intro ? (
            <div className="mt-8 max-w-xl text-base leading-8 text-ivory/65 md:text-lg">
              {intro}
            </div>
          ) : null}
          {children}
        </Reveal>
        {media ? (
          <Reveal tilt delay={150} className="mx-auto w-full max-w-[18rem] sm:max-w-sm lg:max-w-md">
            <Frame3D media={media} caption={mediaCaption} priority />
          </Reveal>
        ) : null}
      </div>
    </header>
  )
}
