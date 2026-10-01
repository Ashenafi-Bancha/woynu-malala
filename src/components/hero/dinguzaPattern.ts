/**
 * PLACEHOLDER PATTERN — to be replaced by Woynu Malala.
 *
 * The studio told us Dinguza is woven in red, black, and yellow. The order and widths
 * of the stripes below are NOT taken from a real cloth: they are a neutral arrangement
 * so the hero has something to show. Replace `STRIPES` with the real sequence (or swap
 * the shader's pattern for a photo of real Dinguza cloth) once the designers supply it.
 *
 * Both the 3D cloth and its still fallback read this one list, so they always match.
 */
export type Stripe = { color: string; width: number }

export const DINGUZA_COLORS = {
  red: '#B3261E',
  black: '#141111',
  yellow: '#E8C33A',
} as const

export const STRIPES: Stripe[] = [
  { color: DINGUZA_COLORS.red, width: 5 },
  { color: DINGUZA_COLORS.black, width: 1 },
  { color: DINGUZA_COLORS.yellow, width: 2 },
  { color: DINGUZA_COLORS.black, width: 1 },
]

/** How many times the stripe sequence repeats across the cloth. */
export const REPEATS = 5

const total = STRIPES.reduce((sum, s) => sum + s.width, 0)

/** CSS background for the still fallback. */
export function stripesCss(): string {
  let at = 0
  const stops = STRIPES.map((s) => {
    const from = (at / total) * 100
    at += s.width
    return `${s.color} ${from.toFixed(2)}% ${((at / total) * 100).toFixed(2)}%`
  })
  return `repeating-linear-gradient(90deg, ${stops.join(', ')})`
}

const toVec3 = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return `vec3(${((n >> 16) / 255).toFixed(4)}, ${(((n >> 8) & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`
}

/** GLSL function `vec3 stripeColor(float u)` for the 3D cloth, generated from the same list. */
export function stripesGlsl(): string {
  let at = 0
  const lines = STRIPES.map((s, i) => {
    at += s.width
    const edge = (at / total).toFixed(4)
    return i === STRIPES.length - 1 ? `  return ${toVec3(s.color)};` : `  if (t < ${edge}) return ${toVec3(s.color)};`
  })
  return `vec3 stripeColor(float u) {\n  float t = fract(u * ${REPEATS.toFixed(1)});\n${lines.join('\n')}\n}`
}
