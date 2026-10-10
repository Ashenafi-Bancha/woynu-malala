import { DINGUZA_COLORS } from '../hero/dinguzaPattern'

const { red, black, yellow } = DINGUZA_COLORS
const COLUMNS = 12

/** In the motif band, the stepped blocks sit on two columns out of every four. */
const onBlock = (column: number) => column % 4 === 1 || column % 4 === 2

type Row = { height: number; colour: (column: number) => string }

const plain = (colour: string, height = 1): Row => ({ height, colour: () => colour })
const checks: Row = { height: 0.32, colour: (c) => (c % 2 ? black : yellow) }
/** thin yellow edge above and below each block */
const blockEdge: Row = { height: 0.32, colour: (c) => (onBlock(c) ? yellow : red) }
const block: Row = { height: 1, colour: (c) => (onBlock(c) ? black : red) }
/** thin yellow edge of the joining bar, broken where a block crosses it */
const barEdge: Row = { height: 0.32, colour: (c) => (onBlock(c) ? black : yellow) }

/**
 * The Dinguza pattern as a grid of tiles, top to bottom: broad red and black bands, thin
 * yellow lines, rows of small checks, and the stepped black blocks joined by a bar.
 */
const ROWS: Row[] = [
  plain(red),
  plain(yellow, 0.32),
  plain(black),
  checks,
  plain(red),
  blockEdge,
  block,
  barEdge,
  plain(black, 0.8),
  barEdge,
  block,
  blockEdge,
  plain(red),
  checks,
  plain(black),
  plain(yellow, 0.32),
  plain(red),
]

/**
 * Woynu AI's animation: the Dinguza pattern being "generated" tile by tile. The bands light
 * up one after another while a scan line passes over the panel, inside viewfinder
 * corners, so it reads as a design being worked out rather than a finished cloth.
 */
export function WeaveTiles({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`weave-panel ${className}`}>
      {/* Each band is animated as one piece (17 moving layers, not one per tile) */}
      <div className="grid h-full w-full gap-[3px]" style={{ gridTemplateRows: ROWS.map((row) => `${row.height}fr`).join(' ') }}>
        {ROWS.map((row, r) => (
          <div
            key={r}
            className="weave-row grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`, animationDelay: `${r * 0.16}s` }}
          >
            {Array.from({ length: COLUMNS }, (_, c) => (
              <span key={c} className="weave-tile" style={{ backgroundColor: row.colour(c) }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
