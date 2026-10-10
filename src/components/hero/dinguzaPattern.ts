/**
 * The Dinguza pattern used by the 3D cloth, ribbons and loom.
 *
 * It is modelled on two reference photos supplied for the site (a woven Dinguza wrap and a
 * Dinguza-painted truck body): broad bands of red and black, thin yellow lines between
 * them, a row of small yellow-and-black checks, and a central band of stepped black
 * blocks joined by a bar and outlined in yellow.
 *
 * It is a drawing made from those photos, not a thread-for-thread copy of one cloth.
 * The studio's designers should confirm the band order and the motif, and correct the
 * numbers in `dinguzaGlsl()` and `dinguzaBandSvg()` if they differ.
 */
export const DINGUZA_COLORS = {
  red: '#B3261E',
  black: '#141111',
  yellow: '#E8C33A',
} as const

const toVec3 = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return `vec3(${((n >> 16) / 255).toFixed(4)}, ${(((n >> 8) & 255) / 255).toFixed(4)}, ${((n & 255) / 255).toFixed(4)})`
}

/**
 * GLSL function `vec3 dinguza(float u, float v)`.
 * `u` runs across the cloth (0..1 is one full set of bands, and it repeats);
 * `v` runs along the cloth, counted in repeats of the stepped motif.
 */
export function dinguzaGlsl(): string {
  return /* glsl */ `
  const vec3 D_RED = ${toVec3(DINGUZA_COLORS.red)};
  const vec3 D_BLACK = ${toVec3(DINGUZA_COLORS.black)};
  const vec3 D_YELLOW = ${toVec3(DINGUZA_COLORS.yellow)};

  vec3 dinguza(float u, float v) {
    u = fract(u);
    // row of small checks
    vec3 checks = fract(v * 4.0) < 0.5 ? D_YELLOW : D_BLACK;

    if (u < 0.100) return D_RED;
    if (u < 0.125) return D_YELLOW;
    if (u < 0.220) return D_BLACK;
    if (u < 0.245) return checks;
    if (u < 0.360) return D_RED;
    if (u < 0.640) {
      // stepped motif: black blocks joined by a bar, outlined in yellow, on red
      float a = abs((u - 0.360) / 0.280 - 0.5);
      float b = abs(fract(v) - 0.5);
      if (a < 0.14 || (a < 0.36 && b < 0.24)) return D_BLACK;
      if (a < 0.21 || (a < 0.43 && b < 0.29)) return D_YELLOW;
      return D_RED;
    }
    if (u < 0.755) return D_RED;
    if (u < 0.780) return checks;
    if (u < 0.875) return D_BLACK;
    if (u < 0.900) return D_YELLOW;
    return D_RED;
  }
`
}

/** One tile of the same motif as an SVG data URL, for flat (CSS) bands. It repeats sideways. */
export function dinguzaBandSvg(): string {
  const { red, black, yellow } = DINGUZA_COLORS
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='34' viewBox='0 0 44 34'>` +
    `<rect width='44' height='34' fill='${red}'/>` +
    `<rect y='2' width='44' height='1.6' fill='${yellow}'/><rect y='3.6' width='44' height='3.4' fill='${black}'/>` +
    `<path d='M-3 14H11V10H33V14H47V20H33V24H11V20H-3Z' fill='${black}' stroke='${yellow}' stroke-width='1.6'/>` +
    `<rect y='27' width='44' height='3.4' fill='${black}'/><rect y='30.4' width='44' height='1.6' fill='${yellow}'/>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
