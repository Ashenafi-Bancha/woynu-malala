import { useEffect, useState } from 'react'
import { useAiText } from '../../woynu-ai/strings'
import { WeaveTiles } from './WeaveTiles'

/**
 * Loading state while the single generation request runs. It shows one honest
 * message and elapsed time rather than pretending to expose internal AI steps.
 * The animation is the Dinguza pattern being generated tile by tile.
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
      <WeaveTiles className="h-64 w-60 md:h-72 md:w-64" />
      <p className="mt-10 text-[11px] uppercase tracking-[0.4em] text-gold">Woynu AI</p>
      <h2 className="mt-4 font-serif text-3xl font-light md:text-4xl">{title ?? a('loadingTitle')}</h2>
      <p className="mt-4 text-ivory/60">{a('loadingNote')}</p>
      <p className="mt-6 font-serif text-lg italic text-ivory/40" aria-hidden="true">
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </p>
    </div>
  )
}
