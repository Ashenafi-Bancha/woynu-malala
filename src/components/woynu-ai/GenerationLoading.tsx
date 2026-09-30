import { useEffect, useState } from 'react'
import { useAiText } from '../../woynu-ai/strings'

const THREADS = ['#F0EEEB', '#B3261E', '#141111', '#DEA052', '#B3261E', '#F0EEEB', '#DEA052', '#141111', '#B3261E', '#F0EEEB', '#DEA052']

/**
 * Loading state while the single generation request runs. It shows one honest
 * message and elapsed time rather than pretending to expose internal AI steps.
 * The animation is a loom of woven bands in the studio's colours.
 */
export function GenerationLoading({ title }: { title?: string } = {}) {
  const { a } = useAiText()
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div role="status" aria-live="polite" className="mx-auto flex max-w-xl flex-col items-center py-16 text-center md:py-24">
      <div aria-hidden="true" className="relative flex h-56 items-end gap-2 md:h-64">
        {THREADS.map((color, i) => (
          <span
            key={i}
            className="loom-thread block w-3 origin-bottom rounded-t-sm md:w-4"
            style={{ backgroundColor: color, height: '100%', animationDelay: `${i * 0.12}s` }}
          />
        ))}
        <span className="loom-shuttle absolute inset-x-[-12px] h-px bg-gold-bright shadow-[0_0_12px_rgba(235,185,119,0.9)]" />
      </div>
      <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-gold">Woynu AI</p>
      <h2 className="mt-4 font-serif text-3xl font-light md:text-4xl">{title ?? a('loadingTitle')}</h2>
      <p className="mt-4 text-ivory/60">{a('loadingNote')}</p>
      <p className="mt-6 font-serif text-lg italic text-ivory/40" aria-hidden="true">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </p>
    </div>
  )
}
