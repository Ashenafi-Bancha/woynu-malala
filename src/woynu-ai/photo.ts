const MAX_SIDE = 1024
const MAX_FILE_BYTES = 25 * 1024 * 1024

/**
 * Prepares a visitor's photo on their own device: fixes rotation, shrinks it to at most
 * 1024 px, and re-encodes it as JPEG. Re-encoding drops EXIF metadata such as GPS
 * location, and keeps the upload small on mobile data.
 */
export async function preparePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/') || file.size > MAX_FILE_BYTES) throw new Error('unsupported')

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no canvas')
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.86)
  } finally {
    bitmap.close()
  }
}
