import { dinguzaBandSvg } from './hero/dinguzaPattern'

/** Three tiny squares (red, black, yellow) that hop one after another: a label marker. */
export function TriDots() {
  return (
    <span aria-hidden="true" className="tri-dots">
      <i />
      <i />
      <i />
    </span>
  )
}

const band = { backgroundImage: dinguzaBandSvg() }

/**
 * A band of the Dinguza pattern (red and black with thin yellow lines and the stepped
 * motif) that draws across between two sections as it scrolls into view.
 */
export function ThreadDivider() {
  return (
    <div aria-hidden="true" className="thread-divider">
      <i style={band} />
    </div>
  )
}
