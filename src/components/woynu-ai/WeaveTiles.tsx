import { DINGUZA_COLORS } from '../hero/dinguzaPattern'

const COLOURS = [DINGUZA_COLORS.red, DINGUZA_COLORS.yellow, DINGUZA_COLORS.black]

/**
 * A panel of rectangular tiles in red, yellow and black that light up in a travelling
 * wave, like a cloth being woven block by block. The three colours run on the diagonal,
 * so each one fills exactly a third of the panel.
 */
export function WeaveTiles({ columns = 6, rows = 9, className = '' }: { columns?: number; rows?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`grid gap-1.5 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns * rows }, (_, i) => {
        const row = Math.floor(i / columns)
        const column = i % columns
        return (
          <span
            key={i}
            className="weave-tile"
            style={{ backgroundColor: COLOURS[(row + column) % 3], animationDelay: `${(row + column) * 0.14}s` }}
          />
        )
      })}
    </div>
  )
}
