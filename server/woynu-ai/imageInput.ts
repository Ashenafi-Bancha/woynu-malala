import { WoynuAiError } from './errors.js'

/** A decoded, verified raster image received from the browser. Kept in memory only. */
export type ImageInput = { bytes: Uint8Array; mime: 'image/jpeg' | 'image/png' | 'image/webp' }

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024

const SIGNATURES: [ImageInput['mime'], (b: Uint8Array) => boolean][] = [
  ['image/jpeg', (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff],
  ['image/png', (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47],
  [
    'image/webp',
    (b) =>
      b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  ],
]

/**
 * Parses a base64 data: URL and checks the actual file bytes (not just the declared
 * type) so only real JPEG/PNG/WebP images reach the AI provider.
 */
export function parseImageDataUrl(value: unknown): ImageInput {
  if (typeof value !== 'string') throw new WoynuAiError('invalid_photo', 400)
  const match = /^data:image\/(jpeg|jpg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(value)
  if (!match) throw new WoynuAiError('invalid_photo', 400)
  const base64 = match[2]
  if ((base64.length * 3) / 4 > MAX_IMAGE_BYTES) throw new WoynuAiError('payload_too_large', 413)

  const bytes = Uint8Array.from(Buffer.from(base64, 'base64'))
  const detected = SIGNATURES.find(([, test]) => bytes.length > 12 && test(bytes))
  if (!detected) throw new WoynuAiError('invalid_photo', 400)
  return { bytes, mime: detected[0] }
}

export const toDataUrl = (image: ImageInput) =>
  `data:${image.mime};base64,${Buffer.from(image.bytes).toString('base64')}`
