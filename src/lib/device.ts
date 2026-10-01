// Decides which visitors get WebGL 3D. Everyone else gets the still fallback, which is
// what most low-end Android phones should see.

type NavigatorHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean; effectiveType?: string }
}

const FELL_BACK_KEY = 'wm-3d-fallback'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** True for devices with a mouse or trackpad (used for desktop-only effects). */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

/**
 * 3D is skipped for: reduced-motion users, data-saver mode, slow connections, devices
 * with fewer than 4 CPU cores or less than 3 GB of memory, browsers without WebGL 2,
 * and any device that already failed the frame-rate check this visit.
 */
export function canRender3D(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as NavigatorHints
  if (prefersReducedMotion()) return false
  if (nav.connection?.saveData) return false
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return false
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 3) return false
  try {
    if (sessionStorage.getItem(FELL_BACK_KEY)) return false
  } catch {
    // storage unavailable: carry on
  }
  return hasWebGL()
}

/** Called when the live frame-rate check fails, so later pages skip 3D too. */
export function remember3DFallback() {
  try {
    sessionStorage.setItem(FELL_BACK_KEY, '1')
  } catch {
    // storage unavailable: the fallback still applies to this page
  }
}

/** Runs `task` once the page has loaded and the browser is idle. Returns a cancel function. */
export function whenIdle(task: () => void, timeout = 2500): () => void {
  let cancelled = false
  let idleId = 0
  const run = () => {
    if (cancelled) return
    if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(() => !cancelled && task(), { timeout })
    else setTimeout(() => !cancelled && task(), 300)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
  return () => {
    cancelled = true
    window.removeEventListener('load', run)
    if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
  }
}
