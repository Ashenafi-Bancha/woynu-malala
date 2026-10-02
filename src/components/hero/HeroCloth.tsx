import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor.js'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { CLOTH_GEOMETRY, createClothMaterial, createDust } from './clothMaterial'

// The hero scene: loose warp threads fly in and weave themselves into a length of cloth,
// gold dust drifts through the light, and scrolling unravels the cloth again.
// One cloth mesh + one points cloud = two draw calls, so it stays light on phones.

export type ClothControls = {
  /** 0..1 scroll progress through the hero, written by the page */
  scroll: RefObject<number>
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

function Scene({ scroll }: ClothControls) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const eased = useRef({ x: 0, y: 0 })
  const born = useRef<number | null>(null)
  const { viewport, camera, gl } = useThree()
  // Wide screens: the cloth sits to the right of the text. Tall screens: centred behind it.
  const wide = viewport.aspect > 1.15

  const cloth = useMemo(createClothMaterial, [])
  const dust = useMemo(() => createDust(wide ? 260 : 110), [wide])

  useEffect(() => () => cloth.dispose(), [cloth])
  useEffect(
    () => () => {
      dust.geometry.dispose()
      dust.material.dispose()
    },
    [dust],
  )

  // The canvas sits behind the text, so pointer and tilt are read from the window.
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    // Phone tilt. Works without a prompt on Android; iOS needs permission, which we don't ask for.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      pointer.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1)
      pointer.current.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime
    born.current ??= now
    const age = now - born.current
    const u = cloth.uniforms
    const k = Math.min(1, delta * 3)
    eased.current.x += (pointer.current.x - eased.current.x) * k
    eased.current.y += (pointer.current.y - eased.current.y) * k

    const s = u.uScroll.value + ((scroll.current ?? 0) - u.uScroll.value) * Math.min(1, delta * 6)
    u.uScroll.value = s
    u.uTime.value = now
    // Threads weave into cloth over the first seconds; scrolling unravels them again
    let woven = easeOutCubic(Math.min(1, age / 2.8))
    // The cloth never sits still: every so often it loosens into threads and weaves itself again
    const cycle = (age - 9) % 15
    if (age > 9 && cycle < 5) woven *= 1 - Math.sin((cycle / 5) * Math.PI) ** 2 * 0.72
    u.uWeave.value = woven * (1 - Math.min(1, s * 1.5) * 0.85)
    u.uOpacity.value = Math.min(1, age / 0.9) * (1 - s * 0.6)
    u.uPointer.value.set(eased.current.x, eased.current.y)

    dust.material.uniforms.uTime.value = now
    dust.material.uniforms.uOpacity.value = Math.min(1, age / 2) * (1 - s * 0.7)
    dust.material.uniforms.uPixelRatio.value = gl.getPixelRatio() * 16

    if (group.current) {
      group.current.position.x = wide ? viewport.width * 0.2 : 0
      group.current.rotation.y = Math.sin(now * 0.22) * 0.3 + eased.current.x * 0.3 - (1 - woven) * 0.9
      group.current.rotation.x = -eased.current.y * 0.14 - s * 0.55
    }
    // The camera drifts with the pointer and pushes in as the page scrolls
    camera.position.x += (eased.current.x * 0.35 - camera.position.x) * k
    camera.position.y += (eased.current.y * 0.22 - camera.position.y) * k
    camera.position.z = 6 - s * 1.6
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <group ref={group}>
        <mesh material={cloth} scale={wide ? 0.92 : 0.86}>
          {/* Enough columns for every thread to move on its own */}
          <planeGeometry args={CLOTH_GEOMETRY} />
        </mesh>
      </group>
      <points geometry={dust.geometry} material={dust.material} />
    </>
  )
}

type HeroClothProps = ClothControls & {
  /** Render frames only while true (hero on screen and tab visible) */
  active: boolean
  onReady: () => void
  /** The live frame-rate check failed: switch to the still fallback */
  onTooSlow: () => void
}

export default function HeroCloth({ scroll, active, onReady, onTooSlow }: HeroClothProps) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 36, position: [0, 0, 6] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
      style={{ pointerEvents: 'none' }}
    >
      <PerformanceMonitor bounds={() => [26, 60]} flipflops={2} onDecline={onTooSlow} onFallback={onTooSlow}>
        <Scene scroll={scroll} />
      </PerformanceMonitor>
    </Canvas>
  )
}
