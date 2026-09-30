import type { MediaAsset } from './types'

/**
 * Studio photos dropped into src/assets/images/ (see the README there).
 * Vite finds them at build time, so a missing file simply keeps the default image.
 * Any of these formats work: .jpg .jpeg .png .webp .avif
 */
const files = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byPath = new Map<string, string>()
for (const [file, url] of Object.entries(files)) {
  // '../assets/images/collections/bridal/cover.jpg' -> 'collections/bridal/cover'
  const key = file.replace('../assets/images/', '').replace(/\.[^.]+$/, '').toLowerCase()
  byPath.set(key, url)
}

/** URL of the studio photo saved at `path` (without extension), if one exists. */
export function imageFor(path: string): string | undefined {
  return byPath.get(path.toLowerCase())
}

/**
 * Uses the studio photo at `path` when it exists; otherwise keeps `fallback`
 * (a Facebook preview or placeholder still).
 */
export function slot(path: string, fallback: MediaAsset, alt?: string): MediaAsset {
  const src = imageFor(path)
  if (!src) return fallback
  return {
    src,
    alt: alt ?? fallback.alt.replace(/\s*\(placeholder photography\)$/, ''),
    placeholder: false,
    caption: '',
    tone: fallback.tone,
  }
}

/** 'Traditional Wolaita clothing' -> 'traditional-wolaita-clothing' */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const pad2 = (n: number) => String(n).padStart(2, '0')
