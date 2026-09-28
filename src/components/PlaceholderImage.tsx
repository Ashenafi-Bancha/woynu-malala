import type { MediaAsset } from '../content/types'

const tones: Record<MediaAsset['tone'], string> = {
  ink: 'from-[#1a1612] via-[#3a2e24] to-[#0a0908]',
  earth: 'from-[#4a3426] via-[#7a5a3a] to-[#1c140e]',
  gold: 'from-[#3a2e1c] via-[#b8956a] to-[#1a140c]',
  ivory: 'from-[#d8cbb4] via-[#a89070] to-[#2a2218]',
  moss: 'from-[#243028] via-[#3d4a3a] to-[#0c100e]',
}

type Props = {
  media: MediaAsset
  className?: string
  imgClassName?: string
  priority?: boolean
  showCaption?: boolean
  kenburns?: boolean
  /** Small photos: 'bottom' leaves room for overlaid text, 'center' for plain frames */
  lowResPlacement?: 'bottom' | 'center'
}

export function PlaceholderImage({
  media,
  className = '',
  imgClassName = '',
  priority = false,
  showCaption = true,
  kenburns = false,
  lowResPlacement = 'bottom',
}: Props) {
  if (media.lowRes) {
    return (
      <figure className={`relative overflow-hidden bg-ink-soft ${className}`}>
        <img
          src={media.src}
          alt=""
          aria-hidden="true"
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl saturate-125"
        />
        <div className="absolute inset-0 z-[1] bg-ink/35" aria-hidden="true" />
        <div className={`absolute inset-0 z-[2] flex items-center justify-center p-6 ${lowResPlacement === 'bottom' ? 'pb-28 md:pb-32' : ''}`}>
          <img
            src={media.src}
            alt={media.alt}
            width={206}
            height={206}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`aspect-square max-h-full w-[min(60%,240px)] object-cover shadow-2xl ring-1 ring-gold/40 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${imgClassName}`}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-linear-to-t from-ink/80 via-transparent to-transparent"
          aria-hidden="true"
        />
      </figure>
    )
  }

  return (
    <figure className={`relative overflow-hidden bg-ink-soft ${className}`}>
      <div className={`absolute inset-0 bg-linear-to-br ${tones[media.tone]}`} aria-hidden="true" />
      <img
        src={media.src}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`relative z-[1] h-full w-full object-cover ${kenburns ? 'opacity-90 hero-media' : 'opacity-70 mix-blend-luminosity contrast-110 saturate-50 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105'} ${imgClassName}`}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-linear-to-t from-ink/70 via-transparent to-ink/20"
        aria-hidden="true"
      />
      {showCaption ? (
        <figcaption className="absolute bottom-3 left-3 z-[3] text-[10px] uppercase tracking-[0.22em] text-ivory/70">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
