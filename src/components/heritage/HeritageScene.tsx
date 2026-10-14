import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { DINGUZA_COLORS } from '../hero/dinguzaPattern'

// The heritage motifs the studio uses in its designs, drawn in 3D and dressed in the
// Dinguza pattern: Wolaita's 50+ kings, the seven gates of Wolaita Sodo, the spear (ጦር)
// and the shield (ጋሻ). These are illustrations in the Dinguza colours, not copies of
// particular historical objects.

export type MotifVariant = 'kings' | 'gates' | 'spear' | 'shield'

const { red: RED, black: BLACK, yellow: YELLOW } = DINGUZA_COLORS

/** A tile of the Dinguza band: red, yellow edge lines, black bands, stepped black blocks outlined in yellow. */
function bandTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const g = c.getContext('2d')!
  g.fillStyle = RED
  g.fillRect(0, 0, 256, 64)
  g.fillStyle = YELLOW
  g.fillRect(0, 2, 256, 4)
  g.fillRect(0, 58, 256, 4)
  g.fillStyle = BLACK
  g.fillRect(0, 7, 256, 7)
  g.fillRect(0, 50, 256, 7)
  g.lineWidth = 2
  g.strokeStyle = YELLOW
  g.fillStyle = BLACK
  // the bar joining the blocks, then the blocks
  g.fillRect(0, 29, 256, 6)
  g.strokeRect(-2, 29, 260, 6)
  for (let x = 0; x < 256; x += 64) {
    g.fillRect(x + 18, 21, 28, 22)
    g.strokeRect(x + 18, 21, 28, 22)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** The Dinguza band bent into rings, for the face of the shield. */
function ringTexture(): THREE.CanvasTexture {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  const mid = size / 2
  const ring = (r: number, colour: string) => {
    g.beginPath()
    g.arc(mid, mid, r, 0, Math.PI * 2)
    g.fillStyle = colour
    g.fill()
  }
  ring(256, YELLOW)
  ring(246, BLACK)
  ring(226, RED)
  // stepped blocks around the red band
  g.save()
  g.translate(mid, mid)
  g.lineWidth = 3
  g.strokeStyle = YELLOW
  g.fillStyle = BLACK
  for (let i = 0; i < 20; i++) {
    g.rotate((Math.PI * 2) / 20)
    g.fillRect(-14, -214, 28, 34)
    g.strokeRect(-14, -214, 28, 34)
  }
  g.restore()
  ring(172, YELLOW)
  ring(164, BLACK)
  ring(138, RED)
  ring(104, YELLOW)
  ring(96, BLACK)
  ring(70, RED)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function useDisposable<T extends { dispose: () => void }>(make: () => T): T {
  const value = useMemo(make, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => value.dispose(), [value])
  return value
}

/** Turns slowly, and leans toward the mouse. */
function useTurn(speed: number, tilt = 0.25) {
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y += delta * speed
    g.rotation.x += (state.pointer.y * -tilt - g.rotation.x) * Math.min(1, delta * 3)
  })
  return group
}

function Spear() {
  const band = useDisposable(bandTexture)
  const grip = useDisposable(() => {
    const t = band.clone()
    t.repeat.set(2, 4)
    t.needsUpdate = true
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.75 })
  })
  const wood = useDisposable(() => new THREE.MeshStandardMaterial({ color: '#6b4423', roughness: 0.7 }))
  const metal = useDisposable(() => new THREE.MeshStandardMaterial({ color: '#d9d4cc', metalness: 0.9, roughness: 0.28 }))
  const blade = useDisposable(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0.07, 0.06),
          new THREE.Vector2(0.17, 0.45),
          new THREE.Vector2(0.14, 0.8),
          new THREE.Vector2(0, 1.15),
        ],
        24,
      ),
  )
  const group = useTurn(0.55)
  return (
    <group ref={group} rotation={[0, 0, 0.42]}>
      <mesh material={wood} position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 3, 16]} />
      </mesh>
      <mesh material={grip} position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 1, 24, 1, true]} />
      </mesh>
      <mesh geometry={blade} material={metal} position={[0, 1.22, 0]} scale={[1, 1, 0.45]} />
      <mesh material={metal} position={[0, -1.85, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.05, 0.3, 12]} />
      </mesh>
    </group>
  )
}

function Shield() {
  const face = useDisposable(() => new THREE.MeshStandardMaterial({ map: ringTexture(), roughness: 0.6 }))
  const edge = useDisposable(() => new THREE.MeshStandardMaterial({ color: BLACK, roughness: 0.5 }))
  const gold = useDisposable(() => new THREE.MeshStandardMaterial({ color: YELLOW, metalness: 0.7, roughness: 0.3 }))
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.rotation.y = Math.sin(t * 0.6) * 0.55 + state.pointer.x * 0.3
    g.rotation.x += (state.pointer.y * -0.25 - g.rotation.x) * Math.min(1, delta * 3)
  })
  return (
    <group ref={group}>
      {/* the face: a shallow disc whose front carries the Dinguza rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={[edge, face, edge]}>
        <cylinderGeometry args={[1.2, 1.2, 0.12, 72]} />
      </mesh>
      <mesh material={gold}>
        <torusGeometry args={[1.2, 0.055, 12, 96]} />
      </mesh>
      <mesh material={gold} position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  )
}

function Gates() {
  const band = useDisposable(bandTexture)
  const lit = useMemo(
    () =>
      Array.from({ length: 7 }, () => {
        const t = band.clone()
        t.repeat.set(1, 3)
        t.needsUpdate = true
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.65, emissive: YELLOW, emissiveIntensity: 0 })
      }),
    [band],
  )
  useEffect(() => () => lit.forEach((m) => m.dispose()), [lit])
  const group = useTurn(0.25, 0.12)
  // the gates light up one after another, so the count of seven reads at a glance
  useFrame((state) => {
    const t = state.clock.elapsedTime
    lit.forEach((m, i) => {
      const phase = (t * 0.9 - i * 0.55) % 3.85
      m.emissiveIntensity = phase > 0 && phase < 0.55 ? Math.sin((phase / 0.55) * Math.PI) * 0.6 : 0
    })
  })
  const R = 1.55
  return (
    <group position={[0, -0.45, 0]} rotation={[0.32, 0, 0]}>
      <group ref={group}>
        {lit.map((material, i) => {
          const a = (i / 7) * Math.PI * 2
          return (
            <group key={i} position={[Math.sin(a) * R, 0, Math.cos(a) * R]} rotation={[0, a, 0]}>
              <mesh material={material} position={[-0.32, 0.5, 0]}>
                <boxGeometry args={[0.16, 1, 0.16]} />
              </mesh>
              <mesh material={material} position={[0.32, 0.5, 0]}>
                <boxGeometry args={[0.16, 1, 0.16]} />
              </mesh>
              <mesh material={material} position={[0, 1, 0]}>
                <torusGeometry args={[0.32, 0.08, 10, 24, Math.PI]} />
              </mesh>
            </group>
          )
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R, 0.02, 8, 96]} />
          <meshStandardMaterial color={YELLOW} />
        </mesh>
      </group>
    </group>
  )
}

const KINGS = 54

function Kings() {
  const crown = useDisposable(() => {
    const s = new THREE.Shape()
    // a crown with a stepped top, echoing the steps of the Dinguza blocks
    const top: [number, number][] = [
      [0.5, 0], [0.5, 0.8], [0.3, 0.8], [0.3, 0.6], [0.1, 0.6], [0.1, 0.95],
      [-0.1, 0.95], [-0.1, 0.6], [-0.3, 0.6], [-0.3, 0.8], [-0.5, 0.8], [-0.5, 0],
    ]
    s.moveTo(-0.5, 0)
    top.forEach(([x, y]) => s.lineTo(x, y))
    const geometry = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 })
    geometry.center()
    return geometry
  })
  const material = useDisposable(() => new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.25 }))
  const mesh = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    const dummy = new THREE.Object3D()
    // red, black and yellow in equal numbers
    const colours = [new THREE.Color(RED), new THREE.Color('#2b2522'), new THREE.Color(YELLOW)]
    for (let i = 0; i < KINGS; i++) {
      const t = i / KINGS
      const a = t * Math.PI * 2 * 3
      dummy.position.set(Math.sin(a) * 1.35, (t - 0.5) * 2.7, Math.cos(a) * 1.35)
      dummy.rotation.set(0, a, 0)
      dummy.scale.setScalar(0.24)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      m.setColorAt(i, colours[i % 3])
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [])

  const group = useTurn(0.3, 0.15)
  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[crown, material, KINGS]} />
    </group>
  )
}

type HeritageSceneProps = {
  variant: MotifVariant
  /** Render frames only while true (on screen, tab visible) */
  active: boolean
  onReady: () => void
}

export default function HeritageScene({ variant, active, onReady }: HeritageSceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 35, position: [0, 0, 6] }}
      gl={{ antialias: true, alpha: true }}
      onCreated={onReady}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.2} />
      <pointLight position={[-3, -1, 2]} intensity={6} color="#ebb977" />
      {variant === 'spear' ? <Spear /> : null}
      {variant === 'shield' ? <Shield /> : null}
      {variant === 'gates' ? <Gates /> : null}
      {variant === 'kings' ? <Kings /> : null}
    </Canvas>
  )
}
