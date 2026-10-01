import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor.js'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { stripesGlsl } from './dinguzaPattern'

// A hanging length of woven cloth: one plane, one draw call. The folds are computed in
// the vertex shader, so it stays light enough for mid-range phones.

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;   // 0 at the top of the page, 1 when the hero has scrolled away
  uniform vec2 uPointer;   // -1..1
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFold;

  // Height of the cloth surface at a point. The top edge is pinned; folds grow downward.
  float surface(vec2 p) {
    float hang = smoothstep(1.45, -1.45, p.y);            // 0 at the top edge, 1 at the hem
    float t = uTime;
    float folds =
      sin(p.x * 3.2 + t * 0.9) * 0.12 +
      sin(p.x * 6.1 - p.y * 1.7 + t * 1.25) * 0.045 +
      sin(p.y * 3.4 + t * 0.6 + p.x * 0.8) * 0.03;
    // The cloth swells gently toward the pointer
    float near = exp(-3.0 * distance(p, uPointer * vec2(1.0, 1.45)));
    float lift = uScroll * (0.35 + hang * hang * 1.4);     // scrolling lifts the hem toward the viewer
    return folds * (0.25 + hang * 1.1) * (1.0 + uScroll * 1.6) + near * 0.1 + lift;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float e = 0.02;
    float h = surface(pos.xy);
    // Smooth normals from neighbouring heights
    float hx = surface(pos.xy + vec2(e, 0.0));
    float hy = surface(pos.xy + vec2(0.0, e));
    vNormal = normalize(normalMatrix * normalize(vec3(h - hx, h - hy, e)));
    vFold = h;
    pos.z += h;
    pos.y += uScroll * 0.55;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFold;

  ${stripesGlsl()}

  void main() {
    vec3 color = stripeColor(vUv.x);
    // Woven texture: fine warp and weft threads
    float weave = 0.5 + 0.5 * sin(vUv.x * 520.0) * sin(vUv.y * 760.0);
    color *= 0.9 + 0.1 * weave;

    vec3 n = normalize(gl_FrontFacing ? vNormal : -vNormal);
    float light = clamp(dot(n, normalize(vec3(0.35, 0.55, 0.85))), 0.0, 1.0);
    float sheen = pow(1.0 - clamp(n.z, 0.0, 1.0), 3.0);
    color *= 0.38 + 0.82 * light;
    // Dark threads still catch the light, so black stripes stay visible on the dark page
    color += vec3(0.085, 0.078, 0.072) * (0.35 + light);
    color += sheen * vec3(0.87, 0.63, 0.32) * 0.26;        // warm amber rim, the brand accent
    color *= 0.9 + clamp(vFold, -0.2, 0.3) * 0.5;           // valleys sit a little darker

    gl_FragColor = vec4(color, uOpacity);
  }
`

export type ClothControls = {
  /** 0..1 scroll progress through the hero, written by the page */
  scroll: RefObject<number>
}

function Cloth({ scroll }: ClothControls) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const eased = useRef({ x: 0, y: 0 })

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uOpacity: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
        },
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

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
    const u = material.uniforms
    const k = Math.min(1, delta * 3)
    eased.current.x += (pointer.current.x - eased.current.x) * k
    eased.current.y += (pointer.current.y - eased.current.y) * k
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value += ((scroll.current ?? 0) - u.uScroll.value) * Math.min(1, delta * 6)
    u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 1.2) * (1 - u.uScroll.value * 0.85)
    u.uPointer.value.set(eased.current.x, eased.current.y)
    if (group.current) {
      // Slow turn, plus a lean toward the pointer or the phone's tilt
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.38 + eased.current.x * 0.28
      group.current.rotation.x = -eased.current.y * 0.12 - u.uScroll.value * 0.5
    }
  })

  return (
    <group ref={group}>
      <mesh material={material}>
        <planeGeometry args={[2, 2.9, 56, 80]} />
      </mesh>
    </group>
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
      camera={{ fov: 34, position: [0, 0, 5.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
      style={{ pointerEvents: 'none' }}
    >
      <PerformanceMonitor bounds={() => [26, 60]} flipflops={2} onDecline={onTooSlow} onFallback={onTooSlow}>
        <Cloth scroll={scroll} />
      </PerformanceMonitor>
    </Canvas>
  )
}
