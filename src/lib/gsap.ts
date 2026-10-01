type Gsap = typeof import('gsap').default
type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger

let loading: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerType }> | null = null

/**
 * Loads GSAP + ScrollTrigger once, on demand. Scroll effects are never needed for the
 * first paint, so components call this when they scroll into view or on first scroll.
 */
export function loadGsap() {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
    g.default.registerPlugin(s.ScrollTrigger)
    return { gsap: g.default, ScrollTrigger: s.ScrollTrigger }
  })
  return loading
}
