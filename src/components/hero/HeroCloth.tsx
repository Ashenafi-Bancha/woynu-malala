import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor.js'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { REPEATS, STRIPES, stripesGlsl } from './dinguzaPattern'

// The hero scene: loose warp threads fly in and weave themselves into a length of cloth,
// gold dust drifts through the light, and scrolling unravels the cloth again.
// One cloth mesh + one points cloud = two draw calls, so it stays light on phones.

/** Threads across the cloth: one per unit of the stripe pattern, so each thread has one colour. */
const THREADS = REPEATS * STRIPES.reduce((sum, s) => sum + s.width, 0)

const clothVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;   // 0 at the top of the page, 1 when the hero has scrolled away
  uniform float uWeave;    // 0 = loose threads, 1 = finished cloth
  uniform vec2 uPointer;   // -1..1
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFold;

  float hash(float n) { return fract(sin(n * 91.345) * 47453.21); }

  // Height of the woven cloth surface. The top edge is pinned; folds grow toward the hem.
  float surface(vec2 p) {
    float hang = smoothstep(1.8, -1.8, p.y);
    float t = uTime;
    float folds =
      sin(p.x * 2.6 + t * 0.9) * 0.16 +
      sin(p.x * 5.3 - p.y * 1.6 + t * 1.25) * 0.06 +
      sin(p.y * 3.1 + t * 0.6 + p.x * 0.8) * 0.045;
    float near = exp(-2.6 * distance(p, uPointer * vec2(1.3, 1.8)));
    return folds * (0.2 + hang * 1.15) + near * 0.16;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float loose = 1.0 - uWeave;

    // Which thread this vertex belongs to, and that thread's own random character
    float thread = floor(uv.x * ${THREADS.toFixed(1)});
    float r1 = hash(thread + 1.0);
    float r2 = hash(thread + 57.0);

    float e = 0.02;
    float h = surface(pos.xy);
    float hx = surface(pos.xy + vec2(e, 0.0));
    float hy = surface(pos.xy + vec2(0.0, e));
    vNormal = normalize(normalMatrix * normalize(vec3(h - hx, h - hy, e)));
    vFold = h;
    pos.z += h * uWeave;

    // Loose threads: spread apart, hang at their own depth, and sway on their own rhythm
    pos.x += (uv.x - 0.5) * loose * 2.4;
    pos.z += (r1 - 0.5) * loose * 3.2;
    pos.z += sin(uTime * (0.7 + r2) + r1 * 6.28 + pos.y * 1.4) * loose * 0.22;
    pos.x += sin(uTime * (0.5 + r1) + r2 * 6.28 + pos.y * 0.9) * loose * 0.12;
    pos.y += (r2 - 0.5) * loose * 1.1;

    // Scrolling lifts the cloth up and away
    pos.y += uScroll * 1.1;
    pos.z += uScroll * (0.4 + (1.0 - uv.y) * 1.2);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const clothFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uWeave;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFold;

  ${stripesGlsl()}

  void main() {
    // Warp threads: thin strands when loose, closing up into solid cloth as they weave
    float across = fract(vUv.x * ${THREADS.toFixed(1)});
    float halfWidth = mix(0.13, 0.52, smoothstep(0.0, 1.0, uWeave));
    float strand = 1.0 - smoothstep(halfWidth - 0.06, halfWidth, abs(across - 0.5));
    if (strand < 0.02) discard;

    vec3 color = stripeColor(vUv.x);
    // Each strand is round: lighter along its centre
    color *= 0.72 + 0.28 * cos((across - 0.5) * 3.14159);
    // Weft threads appear as the cloth closes up
    float weft = 0.5 + 0.5 * sin(vUv.y * 620.0);
    color *= 1.0 - 0.14 * weft * uWeave;

    vec3 n = normalize(gl_FrontFacing ? vNormal : -vNormal);
    float light = clamp(dot(n, normalize(vec3(0.35, 0.55, 0.85))), 0.0, 1.0);
    float sheen = pow(1.0 - clamp(n.z, 0.0, 1.0), 3.0);
    color *= 0.4 + 0.8 * mix(0.7, light, uWeave);
    // Dark threads still catch the light, so black stripes stay visible on the dark page
    color += vec3(0.085, 0.078, 0.072) * (0.35 + light);
    color += sheen * vec3(0.87, 0.63, 0.32) * 0.3;
    color *= 0.9 + clamp(vFold, -0.2, 0.3) * 0.55;

    gl_FragColor = vec4(color, uOpacity * strand);
  }
`

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Slow rise, wrapping from top to bottom, with a gentle sideways drift
    p.y = mod(p.y + uTime * (0.05 + aSeed * 0.09) + 4.0, 8.0) - 4.0;
    p.x += sin(uTime * 0.25 + aSeed * 40.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (10.0 + aSeed * 26.0) * uPixelRatio / -mv.z;
    vAlpha = (0.25 + 0.75 * abs(sin(uTime * 0.8 + aSeed * 30.0))) * smoothstep(4.0, 2.4, abs(p.y));
  }
`

const dustFragment = /* glsl */ `
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(0.92, 0.72, 0.42, glow * glow * vAlpha * uOpacity);
  }
`

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

  const cloth = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: clothVertex,
        fragmentShader: clothFragment,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uWeave: { value: 0 },
          uOpacity: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
        },
      }),
    [],
  )

  const dust = useMemo(() => {
    const count = wide ? 260 : 110
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5
      seeds[i] = Math.random()
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    const material = new THREE.ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uPixelRatio: { value: 1 } },
    })
    return { geometry, material }
  }, [wide])

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
    const woven = easeOutCubic(Math.min(1, age / 2.8))
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
          <planeGeometry args={[2.8, 3.8, THREADS * 3, 64]} />
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
