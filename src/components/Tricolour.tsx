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

/** A woven band of red, black and yellow threads that draws across between two sections. */
export function ThreadDivider() {
  return (
    <div aria-hidden="true" className="thread-divider">
      <i />
      <i />
      <i />
    </div>
  )
}
