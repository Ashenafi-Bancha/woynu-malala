import { useEffect, useRef, useState } from 'react'

/**
 * Brand heading style: first half upright in soft white, second half in amber italic,
 * e.g. "Where Culture, Heritage / & History Becomes Fashion".
 * The split falls at the middle word; a leading "&" moves to the accent line.
 * Each line rises out of a mask the first time the heading scrolls into view.
 */
export function SplitTitle({ text, light = false }: { text: string; light?: boolean }) {
  const first = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = first.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    // Safety net: never leave a heading hidden (e.g. if it starts inside a collapsed area)
    const timer = setTimeout(() => setShown(true), 4000)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [])

  const words = text.trim().split(/\s+/)
  const base = light ? 'text-ink' : 'text-ivory'
  const state = shown ? 'is-shown' : ''

  if (words.length < 2) {
    return (
      <span ref={first} className={`split-line ${state} ${base}`}>
        <span>{text}</span>
      </span>
    )
  }

  let cut = Math.ceil(words.length / 2)
  if (words[cut - 1] === '&') cut -= 1

  return (
    <>
      <span ref={first} className={`split-line ${state} ${base}`}>
        <span>{words.slice(0, cut).join(' ')}</span>
      </span>{' '}
      <span className={`split-line split-line-late ${state} italic ${light ? 'text-amber-deep' : 'text-gold'}`}>
        <span>{words.slice(cut).join(' ')}</span>
      </span>
    </>
  )
}

/** Shared classes for large brand headings (light-weight Cormorant Garamond). */
export const headingClass = 'font-serif font-light leading-[1.02]'
