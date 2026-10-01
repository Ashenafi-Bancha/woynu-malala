import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'

export type GalleryPhoto = { src: string; alt: string }

/**
 * Horizontal, swipeable photo row with a lightbox. The row uses the browser's own
 * scrolling (with snap points), so it stays smooth on phones.
 */
export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const { t } = useI18n()
  const row = useRef<HTMLUListElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [naturalWidth, setNaturalWidth] = useState(0)

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  )

  // While the lightbox is open: Esc closes, arrows change photo, the page behind does not scroll.
  const isOpen = open !== null
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, close, step])

  // Return focus to the thumbnail that opened the lightbox
  useEffect(() => {
    if (!isOpen) opener.current?.focus()
  }, [isOpen])

  const scrollRow = (dir: 1 | -1) => {
    const el = row.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const photo = open === null ? null : photos[open]
  const arrow =
    'grid h-12 w-12 place-items-center rounded-full border border-ivory/30 bg-ink/70 text-ivory transition hover:border-gold hover:text-gold'

  return (
    <div className="relative">
      <ul
        ref={row}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:-mx-10 md:gap-6 md:px-10"
      >
        {photos.map((p, i) => (
          <li key={p.src} className="w-[62vw] max-w-[17rem] shrink-0 snap-center sm:w-64">
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget
                setNaturalWidth(0)
                setOpen(i)
              }}
              aria-label={`${t('gallery.open')}: ${p.alt}`}
              className="group block aspect-[4/5] w-full overflow-hidden bg-ink-soft shadow-[0_30px_50px_-25px_rgba(0,0,0,0.9)]"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/45">{t('gallery.hint')}</p>
        <div className="hidden gap-3 md:flex">
          <button type="button" onClick={() => scrollRow(-1)} aria-label={t('gallery.prev')} className={arrow}>
            ←
          </button>
          <button type="button" onClick={() => scrollRow(1)} aria-label={t('gallery.next')} className={arrow}>
            →
          </button>
        </div>
      </div>

      <AnimatePresence>
        {photo ? (
          <m.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={photo.alt}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          >
            <m.figure
              key={photo.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full flex-col items-center"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                onLoad={(e) => setNaturalWidth(e.currentTarget.naturalWidth)}
                // Small source photos are shown at most twice their size, so they don't look blurry
                style={{ width: naturalWidth ? `min(92vw, ${naturalWidth * 2}px)` : undefined }}
                className="max-h-[72vh] max-w-[92vw] object-contain shadow-[0_50px_100px_-30px_rgba(0,0,0,1)]"
              />
              <figcaption className="mt-4 max-w-md text-center text-sm text-ivory/70">
                {photo.alt}
                <span className="mt-1 block text-[10px] uppercase tracking-[0.3em] text-gold">
                  {(open ?? 0) + 1} / {photos.length}
                </span>
              </figcaption>
            </m.figure>

            <div className="mt-6 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => step(-1)} aria-label={t('gallery.prev')} className={arrow}>
                ←
              </button>
              <button
                ref={closeButton}
                type="button"
                onClick={close}
                className="min-h-12 border border-ivory/30 px-6 text-[11px] uppercase tracking-[0.28em] text-ivory transition hover:border-gold hover:text-gold"
              >
                {t('gallery.close')}
              </button>
              <button type="button" onClick={() => step(1)} aria-label={t('gallery.next')} className={arrow}>
                →
              </button>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
