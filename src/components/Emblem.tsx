type EmblemProps = {
  /** `hero` fills its parent; `md` is the footer mark; `sm` is the header mark */
  size?: 'hero' | 'md' | 'sm'
  className?: string
}

const sizes = {
  hero: { modifier: '', src: '/logo-hero.webp', pixels: 640 },
  md: { modifier: 'emblem-md', src: '/logo.jpg', pixels: 256 },
  sm: { modifier: 'emblem-sm', src: '/logo.jpg', pixels: 256 },
}

/**
 * The studio's logo as a round medallion inside turning rings of red, black and yellow
 * light. The hero copy of this markup is also written out in index.html (painted before
 * JavaScript runs), so keep the two in step.
 */
export function Emblem({ size = 'hero', className = '' }: EmblemProps) {
  const s = sizes[size]
  return (
    // The caller sets the size (e.g. `h-14 w-14`, or `h-full w-full` in the hero)
    <div className={`hero-emblem ${s.modifier} ${className}`}>
      <span className="emblem-halo" />
      <span className="emblem-band" />
      <span className="emblem-dash" />
      <span className="emblem-orbit">
        <i />
        <i />
        <i />
      </span>
      <img
        src={s.src}
        alt="Woynu Malala logo"
        width={s.pixels}
        height={s.pixels}
        fetchPriority={size === 'hero' ? 'high' : undefined}
        decoding="async"
        className="emblem-logo"
      />
      <span className="emblem-shine" />
    </div>
  )
}
