/**
 * Brand heading style: first half upright in soft white, second half in amber italic,
 * e.g. "Where Culture, Heritage / & History Becomes Fashion".
 * The split falls at the middle word; a leading "&" moves to the accent line.
 */
export function SplitTitle({ text, light = false }: { text: string; light?: boolean }) {
  const words = text.trim().split(/\s+/)
  const base = light ? 'text-ink' : 'text-ivory'
  if (words.length < 2) return <span className={`block ${base}`}>{text}</span>

  let cut = Math.ceil(words.length / 2)
  if (words[cut - 1] === '&') cut -= 1

  return (
    <>
      <span className={`block ${base}`}>{words.slice(0, cut).join(' ')}</span>{' '}
      <span className={`block italic ${light ? 'text-amber-deep' : 'text-gold'}`}>{words.slice(cut).join(' ')}</span>
    </>
  )
}

/** Shared classes for large brand headings (light-weight Cormorant Garamond). */
export const headingClass = 'font-serif font-light leading-[1.02]'
