import { PerformanceMonitor } from '@react-three/drei/core/PerformanceMonitor.js'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { CLOTH_GEOMETRY, createClothMaterial, createDust } from './clothMaterial'
import { stripesGlsl } from './dinguzaPattern'

// 3D backdrops for the inner pages. Every scene loops for ever (nothing plays once and stops):
//   ribbons – lengths of Dinguza cloth twisting through the air
//   loom    – a wide warp of threads that weaves into cloth and loosens again
//   ring    – the page's own photos revolving as a ring of framed cards
// Gold dust drifts through all of them.

export type PageSceneVariant = 'ribbons' | 'loom' | 'ring'

const ribbonVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  varying vec2 vUv;
  varying vec3 vView;

  void main() {
    vUv = uv;
    float x = position.x;
    float t = uTime + uPhase;
    // The band twists along its length and rides two slow waves
    float twist = sin(x * 0.55 + t * 0.6) * 1.3 + x * 0.25 + uPhase;
    vec3 p = vec3(x, position.y * cos(twist), position.y * sin(twist));
    p.y += sin(x * 0.7 + t) * 0.5 + sin(x * 1.9 - t * 1.3) * 0.1;
    p.z += cos(x * 0.5 + t * 0.8) * 0.7;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

const ribbonFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vView;

  ${stripesGlsl()}

  void main() {
    // One run of the stripe pattern across the width of the band
    vec3 color = stripeColor(vUv.y * 0.4);
    // Woven texture
    color *= 0.86 + 0.14 * sin(vUv.x * 2600.0) * sin(vUv.y * 90.0);

    vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
    float light = abs(dot(n, normalize(vec3(0.3, 0.6, 0.75))));
    float sheen = pow(1.0 - abs(n.z), 3.0);
    color *= 0.35 + 0.85 * light;
    color += vec3(0.085, 0.078, 0.072) * (0.3 + light);
    color += sheen * vec3(0.87, 0.63, 0.32) * 0.35;

    // The ends dissolve instead of stopping at a hard edge
    float ends = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    gl_FragColor = vec4(color, uOpacity * ends);
  }
`

const RIBBONS = [
  { y: 0.9, z: -0.6, phase: 0, speed: 1, width: 0.62, tilt: -0.1 },
  { y: -0.2, z: 0.4, phase: 2.4, speed: 0.8, width: 0.46, tilt: 0.06 },
  { y: -1.1, z: -1.2, phase: 4.6, speed: 1.15, width: 0.54, tilt: -0.04 },
]

function Ribbons({ opacity }: { opacity: { current: number } }) {
  const materials = useMemo(
    () =>
      RIBBONS.map(
        (r) =>
          new THREE.ShaderMaterial({
            vertexShader: ribbonVertex,
            fragmentShader: ribbonFragment,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: { uTime: { value: 0 }, uPhase: { value: r.phase }, uOpacity: { value: 0 } },
          }),
      ),
    [],
  )
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials])

  useFrame((state) => {
    materials.forEach((m, i) => {
      m.uniforms.uTime.value = state.clock.elapsedTime * RIBBONS[i].speed
      m.uniforms.uOpacity.value = opacity.current
    })
  })

  return (
    <>
      {RIBBONS.map((r, i) => (
        <mesh key={i} material={materials[i]} position={[0, r.y, r.z]} rotation={[0, 0, r.tilt]}>
          <planeGeometry args={[13, r.width, 180, 6]} />
        </mesh>
      ))}
    </>
  )
}

function Loom({ opacity }: { opacity: { current: number } }) {
  const cloth = useMemo(createClothMaterial, [])
  useEffect(() => () => cloth.dispose(), [cloth])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    cloth.uniforms.uTime.value = t
    cloth.uniforms.uOpacity.value = opacity.current
    // Breathes between loose threads and finished cloth, for ever
    cloth.uniforms.uWeave.value = 0.14 + 0.86 * (0.5 - 0.5 * Math.cos(t * 0.42)) ** 1.4
  })

  return (
    <mesh material={cloth} scale={[1.5, 0.82, 1]} rotation={[0, -0.3, 0]}>
      <planeGeometry args={CLOTH_GEOMETRY} />
    </mesh>
  )
}

const CARD = { width: 1.05, height: 1.32 }

/** Crop the texture like CSS object-fit: cover. */
function coverFit(texture: THREE.Texture) {
  const image = texture.image as { width: number; height: number }
  const want = CARD.width / CARD.height
  const have = image.width / image.height
  if (have > want) {
    texture.repeat.set(want / have, 1)
    texture.offset.set((1 - want / have) / 2, 0)
  } else {
    texture.repeat.set(1, have / want)
    texture.offset.set(0, (1 - have / want) / 2)
  }
}

function Ring({ photos, opacity, wide }: { photos: string[]; opacity: { current: number }; wide: boolean }) {
  const ring = useRef<THREE.Group>(null)
  const [textures, setTextures] = useState<THREE.Texture[]>([])

  useEffect(() => {
    let cancelled = false
    const loaded: THREE.Texture[] = []
    const loader = new THREE.TextureLoader()
    photos.forEach((src, i) => {
      loader.load(src, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        coverFit(texture)
        loaded[i] = texture
        if (!cancelled) setTextures([...loaded])
      })
    })
    return () => {
      cancelled = true
      loaded.forEach((texture) => texture?.dispose())
    }
  }, [photos])

  const frame = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(CARD.width + 0.12, CARD.height + 0.12)), [])
  useEffect(() => () => frame.dispose(), [frame])

  useFrame((state) => {
    if (!ring.current) return
    ring.current.rotation.y = state.clock.elapsedTime * 0.22
    ring.current.traverse((child) => {
      const material = (child as THREE.Mesh).material as THREE.Material | undefined
      // On phones the ring sits behind the title, so it stays faint there
      if (material) material.opacity = opacity.current * (wide ? 1 : 0.55)
    })
  })

  const count = photos.length
  const radius = Math.max(1.5, (count * (CARD.width + 0.3)) / (2 * Math.PI))

  return (
    <group rotation={[0.16, 0, -0.07]} scale={wide ? 1 : 0.72} position={[0, wide ? 0 : -0.35, 0]}>
      <group ref={ring}>
        {photos.map((src, i) => {
          const angle = (i / count) * Math.PI * 2
          return (
            <group key={src} position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, angle, 0]}>
              <mesh>
                <planeGeometry args={[CARD.width, CARD.height]} />
                {/* Different keys: a material must be rebuilt when it gains a texture */}
                {textures[i] ? (
                  <meshBasicMaterial key="photo" map={textures[i]} side={THREE.DoubleSide} transparent toneMapped={false} />
                ) : (
                  <meshBasicMaterial key="blank" color="#1a1512" side={THREE.DoubleSide} transparent toneMapped={false} />
                )}
              </mesh>
              <lineSegments geometry={frame}>
                <lineBasicMaterial color="#dea052" transparent toneMapped={false} />
              </lineSegments>
            </group>
          )
        })}
      </group>
    </group>
  )
}

function Scene({ variant, photos }: { variant: PageSceneVariant; photos: string[] }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const eased = useRef({ x: 0, y: 0 })
  const opacity = useRef(0)
  const born = useRef<number | null>(null)
  const scrolled = useRef(0)
  const { viewport, camera, gl } = useThree()
  const wide = viewport.aspect > 1.15
  const dust = useMemo(() => createDust(wide ? 70 : 34, [12, 5, 5]), [wide])

  useEffect(
    () => () => {
      dust.geometry.dispose()
      dust.material.dispose()
    },
    [dust],
  )

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => window.removeEventListener('pointermove', onPointer)
  }, [])

  useFrame((state, delta) => {
    const now = state.clock.elapsedTime
    born.current ??= now
    opacity.current = Math.min(1, (now - born.current) / 1.2)
    const k = Math.min(1, delta * 3)
    eased.current.x += (pointer.current.x - eased.current.x) * k
    eased.current.y += (pointer.current.y - eased.current.y) * k

    dust.material.uniforms.uTime.value = now
    dust.material.uniforms.uOpacity.value = opacity.current
    dust.material.uniforms.uPixelRatio.value = gl.getPixelRatio() * 16

    // Scroll: -1 when the scene is a screen below the middle of the window, +1 a screen above.
    // The scene drifts, turns and the camera pushes in as the page moves past it.
    const box = gl.domElement.getBoundingClientRect()
    const target = THREE.MathUtils.clamp((window.innerHeight / 2 - (box.top + box.height / 2)) / window.innerHeight, -1, 1)
    scrolled.current += (target - scrolled.current) * Math.min(1, delta * 5)
    const s = scrolled.current

    if (group.current) {
      // Ribbons span the whole header; the loom and the ring sit beside the title on wide screens
      group.current.position.x = wide && variant !== 'ribbons' ? viewport.width * 0.24 : 0
      group.current.position.y = s * 0.7
      group.current.rotation.y = Math.sin(now * 0.2) * 0.12 + eased.current.x * 0.22 + s * 0.35
      group.current.rotation.x = -eased.current.y * 0.1
      group.current.rotation.z = s * 0.16
    }
    camera.position.x += (eased.current.x * 0.3 - camera.position.x) * k
    camera.position.y += (eased.current.y * 0.18 - camera.position.y) * k
    camera.position.z = 6 - Math.abs(s) * 1.1
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {variant === 'ring' ? <fog attach="fog" args={['#040303', 4.2, 9.5]} /> : null}
      <group ref={group}>
        {variant === 'ribbons' ? <Ribbons opacity={opacity} /> : null}
        {variant === 'loom' ? <Loom opacity={opacity} /> : null}
        {variant === 'ring' ? <Ring photos={photos} opacity={opacity} wide={wide} /> : null}
      </group>
      <points geometry={dust.geometry} material={dust.material} />
    </>
  )
}

type PageSceneProps = {
  variant: PageSceneVariant
  /** Image URLs for the `ring` variant */
  photos?: string[]
  /** Render frames only while true (scene on screen and tab visible) */
  active: boolean
  onReady: () => void
  onTooSlow: () => void
}

const NO_PHOTOS: string[] = []

export default function PageScene({ variant, photos = NO_PHOTOS, active, onReady, onTooSlow }: PageSceneProps) {
  // One slow spell (photos decoding, the page still loading) is forgiven; two in a row is too slow
  const slowSpells = useRef(0)
  const onDecline = () => {
    slowSpells.current += 1
    if (slowSpells.current >= 2) onTooSlow()
  }
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
      <PerformanceMonitor bounds={() => [24, 60]} onDecline={onDecline} onIncline={() => (slowSpells.current = 0)}>
        <Scene variant={variant} photos={photos} />
      </PerformanceMonitor>
    </Canvas>
  )
}
