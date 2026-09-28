import type { MediaAsset } from '../content/types'
import { PlaceholderImage } from './PlaceholderImage'
import { Tilt3D, depth } from './Tilt3D'

type Frame3DProps = {
  media: MediaAsset
  /** Sizing classes for the frame; include an aspect ratio */
  className?: string
  max?: number
  caption?: string
  priority?: boolean
}

/** A photo in a floating gold frame that tilts toward the pointer. */
export function Frame3D({ media, className = 'aspect-[4/5] w-full', max = 8, caption, priority }: Frame3DProps) {
  return (
    <Tilt3D max={max} className={className}>
      <div aria-hidden="true" className="absolute -inset-4 border border-gold/35" style={depth(-45)} />
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-6 translate-y-6 bg-gold/10 blur-2xl"
        style={depth(-80)}
      />
      <div className="absolute inset-0 overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
        <PlaceholderImage
          media={media}
          className="absolute inset-0 h-full w-full"
          showCaption={false}
          priority={priority}
          lowResPlacement={caption ? 'bottom' : 'center'}
        />
        {caption ? <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" /> : null}
      </div>
      {caption ? (
        <p className="absolute bottom-6 left-6 right-6 font-serif text-2xl italic text-ivory" style={depth(60)}>
          {caption}
        </p>
      ) : null}
    </Tilt3D>
  )
}
