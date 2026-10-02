import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import WAVES from 'vanta/src/vanta.waves.js'

type VantaEffect = {
  destroy: () => void
  renderer?: THREE.WebGLRenderer | null
  scene?: THREE.Scene | null
}

/**
 * Vanta.js "waves": a slow sea of dark silk in the brand's amber, rendered with the same
 * three.js build as the rest of the site. Vanta pauses itself while it is off screen.
 */
export default function VantaWaves({ onReady }: { onReady: () => void }) {
  const el = useRef<HTMLDivElement>(null)
  const ready = useRef(onReady)
  ready.current = onReady

  useEffect(() => {
    if (!el.current) return
    const effect = WAVES({
      el: el.current,
      THREE,
      mouseControls: true,
      touchControls: false,
      gyroControls: false,
      scale: 1,
      // Half resolution on phones
      scaleMobile: 2,
      color: 0x2b1707,
      shininess: 55,
      waveHeight: 17,
      waveSpeed: 0.75,
      zoom: 0.9,
      backgroundAlpha: 0,
    }) as VantaEffect
    // Vanta was written for an older three.js whose lights did not fade with distance.
    // Restore that, and warm the highlight to the brand amber.
    effect.scene?.traverse((object) => {
      const light = object as THREE.PointLight
      if (light.isPointLight) {
        light.decay = 0
        light.intensity = 3.2
        light.color.set(0xebb977)
      }
    })
    ready.current()
    return () => {
      const renderer = effect.renderer
      effect.destroy()
      renderer?.dispose()
      renderer?.forceContextLoss()
    }
  }, [])

  return <div ref={el} aria-hidden="true" className="absolute inset-0" />
}
