import { useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function darken(hex, amt) {
  const c = parseInt(hex.replace('#', ''), 16)
  const r = Math.max((c >> 16) - amt, 0)
  const g = Math.max(((c >> 8) & 0xff) - amt, 0)
  const b = Math.max((c & 0xff) - amt, 0)
  return `rgb(${r},${g},${b})`
}

function LEDStrip({ pos, len, axis = 'x', color = '#FFD700', intensity = 0.5 }) {
  const s = axis === 'x' ? [len, 0.02, 0.02] : axis === 'z' ? [0.02, 0.02, len] : [0.02, len, 0.02]
  return (
    <group position={pos}>
      <mesh>
        <boxGeometry args={s} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      <pointLight position={[0, 0, 0]} distance={1.5} intensity={intensity} color={color} />
    </group>
  )
}

function LEDGlow({ on, color = '#FFD700' }) {
  if (!on) return null
  const c = color
  return (
    <group>
      <ambientLight intensity={0.12} color={c} />
      <pointLight position={[0, -0.3, 0]} distance={3} intensity={0.3} color={c} />
    </group>
  )
}

function ChairModel({ fabric, wood, legs, cushion, backrest, armstyle, basetype, led_positions, ledColor }) {
  const isAngle = cushion === 'firm'
  const backH = backrest === 'low' ? 80 : backrest === 'mid' ? 120 : 160

  return (
    <group>
      {legs === 'straight' && [1, -1].map(x => [1, -1].map(z => (
        <mesh key={`leg${x}${z}`} position={[x * 0.6, -0.45, z * 0.5]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )))}
      {legs === 'angled' && [1, -1].map(x => [1, -1].map(z => {
        const s = z === 1 ? 1 : -1
        return <mesh key={`aleg${x}${z}`} position={[x * 0.7, -0.45, s * 0.65]} rotation={[s * 0.15, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 0.7]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      }))}
      {legs === 'cross' && (
        <><mesh position={[0, -0.55, 0]} rotation={[0, 0, 0.5]}><cylinderGeometry args={[0.04, 0.04, 1.6]} /><meshStandardMaterial color={wood} /></mesh>
        <mesh position={[0, -0.55, 0]} rotation={[0, 0, -0.5]}><cylinderGeometry args={[0.04, 0.04, 1.6]} /><meshStandardMaterial color={wood} /></mesh></>
      )}
      {legs === 'flared' && [1, -1].map(x => [1, -1].map(z => (
        <mesh key={`fleg${x}${z}`} position={[x * 0.55, -0.5, z * 0.45]} rotation={[z * 0.2, 0, x * 0.15]}>
          <cylinderGeometry args={[0.04, 0.09, 0.6]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )))}
      {legs === 'metal' && [1, -1].map(x => [1, -1].map(z => (
        <mesh key={`mleg${x}${z}`} position={[x * 0.55, -0.45, z * 0.45]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7]} />
          <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
        </mesh>
      )))}

      <mesh position={[0, 0.5, -0.55]}>
        <boxGeometry args={[1.5, backH / 100, 0.08]} />
        <meshStandardMaterial color={fabric} />
      </mesh>
      {backrest === 'high' && (
        <mesh position={[0, 0.9, -0.58]}>
          <boxGeometry args={[1.3, 0.1, 0.04]} />
          <meshStandardMaterial color={fabric} />
        </mesh>
      )}

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.12, isAngle ? 1.2 : 1.4]} />
        <meshStandardMaterial color={fabric} />
      </mesh>

      {armstyle !== 'none' && armstyle && (
        <><mesh position={[-0.95, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.5, armstyle === 'wooden' ? 0.8 : 1]} />
          <meshStandardMaterial color={armstyle === 'wooden' ? wood : armstyle === 'metal' ? '#888' : fabric} />
        </mesh>
        <mesh position={[0.95, 0.1, 0]}>
          <boxGeometry args={[0.06, 0.5, armstyle === 'wooden' ? 0.8 : 1]} />
          <meshStandardMaterial color={armstyle === 'wooden' ? wood : armstyle === 'metal' ? '#888' : fabric} />
        </mesh></>
      )}

      {led_positions?.includes('seat') && <LEDStrip pos={[-0.8, -0.4, 0.65]} len={1.6} color={ledColor} />}
      {led_positions?.includes('back') && <LEDStrip pos={[-0.75, -0.3, -0.55]} len={1.5} color={ledColor} />}
      {led_positions?.includes('arms') && armstyle !== 'none' && armstyle && <><LEDStrip pos={[-0.95, -0.2, 0]} len={0.01} axis="z" color={ledColor} /><LEDStrip pos={[0.95, -0.2, 0]} len={0.01} axis="z" color={ledColor} /></>}
      {led_positions?.includes('base') && <LEDStrip pos={[-0.8, -0.5, -0.65]} len={1.6} color={ledColor} />}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}
    </group>
  )
}

function SofaModel({ fabric, wood, legs, cushion, seats, backstyle, armstyle, depth, led_positions, ledColor }) {
  const w = seats === '2-seat' ? 2.2 : seats === '3-seat' ? 3.0 : 2.6
  const isDeep = depth === 'deep'

  return (
    <group>
      {[1, -1].map(x => [1, -1].map(z => (
        <mesh key={`leg${x}${z}`} position={[x * w / 2.5, -0.5, z * 0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )))}

      <mesh position={[0, 0.7, -0.65]}>
        <boxGeometry args={[w, 1.2, 0.15]} />
        <meshStandardMaterial color={fabric} />
      </mesh>

      <mesh position={[0, 0.05, 0.15]}>
        <boxGeometry args={[w, 0.15, isDeep ? 1.3 : 1.1]} />
        <meshStandardMaterial color={fabric} />
      </mesh>

      {armstyle === 'square' && (
        <><mesh position={[-w / 2 - 0.1, 0.1, 0.15]}><boxGeometry args={[0.15, 0.5, 1]} /><meshStandardMaterial color={fabric} /></mesh>
        <mesh position={[w / 2 + 0.1, 0.1, 0.15]}><boxGeometry args={[0.15, 0.5, 1]} /><meshStandardMaterial color={fabric} /></mesh></>
      )}

      {led_positions?.includes('seat') && <LEDStrip pos={[-w / 2 + 0.15, -0.4, 0.7]} len={w - 0.3} color={ledColor} />}
      {led_positions?.includes('back') && <LEDStrip pos={[-w / 2 + 0.15, -0.3, -0.6]} len={w - 0.3} color={ledColor} />}
      {led_positions?.includes('base') && <LEDStrip pos={[-w / 2 + 0.15, -0.55, -0.3]} len={w - 0.3} color={ledColor} />}
      {led_positions?.includes('arms') && armstyle === 'square' && <><LEDStrip pos={[-w / 2 - 0.1, -0.2, 0.15]} len={0.01} axis="z" color={ledColor} /><LEDStrip pos={[w / 2 + 0.1, -0.2, 0.15]} len={0.01} axis="z" color={ledColor} /></>}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}}
    </group>
  )
}

function TableModel({ wood, shape, legs, size, edge, material, led_positions, ledColor }) {
  const dim = size === 'small' ? 1 : size === 'medium' ? 1.12 : size === 'large' ? 1.28 : 1.42
  const w = 1.6 * dim
  const d = shape === 'round' ? w : 0.9 * dim
  const t = 0.06
  const matColor = material === 'glass' ? '#d4e8e8' : material === 'marble' ? '#e8e0d8' : material === 'metal' ? '#bbb' : wood
  const isMetal = material === 'metal'
  const isGlass = material === 'glass'

  return (
    <group>
      {legs === 'pedestal' && (
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.9]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )}
      {legs !== 'pedestal' && legs !== 'trestle' && legs !== 'xbase' && [1, -1].map(x => [1, -1].map(z => (
        <mesh key={`leg${x}${z}`} position={[x * w / 3, -0.45, z * d / 3]}>
          <cylinderGeometry args={[0.06, 0.06, 0.9]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )))}
      {legs === 'trestle' && (
        <><mesh position={[-w / 3, -0.45, 0]}><boxGeometry args={[0.15, 0.85, 0.15]} /><meshStandardMaterial color={wood} /></mesh>
        <mesh position={[w / 3, -0.45, 0]}><boxGeometry args={[0.15, 0.85, 0.15]} /><meshStandardMaterial color={wood} /></mesh></>
      )}
      {legs === 'xbase' && (
        <><mesh position={[0, -0.5, 0]} rotation={[0, 0, 0.6]}><boxGeometry args={[2, 0.06, 0.06]} /><meshStandardMaterial color={wood} /></mesh>
        <mesh position={[0, -0.5, 0]} rotation={[0, 0, -0.6]}><boxGeometry args={[2, 0.06, 0.06]} /><meshStandardMaterial color={wood} /></mesh></>
      )}

      {shape === 'round' ? (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[w / 2, w / 2, t, 32]} />
          <meshStandardMaterial color={matColor} metalness={isMetal ? 0.5 : 0} roughness={isGlass ? 0 : isMetal ? 0.3 : 0.8} transparent={isGlass} opacity={isGlass ? 0.55 : 1} />
        </mesh>
      ) : (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w, t, d]} />
          <meshStandardMaterial color={matColor} metalness={isMetal ? 0.5 : 0} roughness={isGlass ? 0 : isMetal ? 0.3 : 0.8} transparent={isGlass} opacity={isGlass ? 0.55 : 1} />
        </mesh>
      )}

      {led_positions?.includes('top') && <LEDStrip pos={[-w / 2 + 0.15, -0.01, d / 2 - 0.05]} len={w - 0.3} color={ledColor} />}
      {led_positions?.includes('base') && <LEDStrip pos={[-w / 4, -0.5, d / 4]} len={w / 2} color={ledColor} />}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}}
    </group>
  )
}

function BedModel({ fabric, wood, size, headboard, footboard, storage, led_positions, ledColor }) {
  const w = size === 'single' ? 1.4 : size === 'double' ? 1.8 : size === 'queen' ? 2.2 : 2.6

  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[w, 0.2, 2]} />
        <meshStandardMaterial color="#f5f5f0" />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[w + 0.2, 0.08, 2.1]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      <mesh position={[0, 0.45, -1.1]}>
        <boxGeometry args={[w + 0.15, headboard === 'sleek' ? 0.5 : 0.7, 0.1]} />
        <meshStandardMaterial color={headboard === 'simple' || headboard === 'panel' ? wood : fabric} />
      </mesh>
      {footboard !== 'none' && (
        <mesh position={[0, 0.15, 1.12]}>
          <boxGeometry args={[w + 0.15, 0.15, 0.06]} />
          <meshStandardMaterial color={wood} opacity={0.8} transparent />
        </mesh>
      )}
      {[1, -1].map(x => [1, -1].map(z => (
        <mesh key={`bleg${x}${z}`} position={[x * w / 2, -0.2, z * 0.9]}>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )))}

      {led_positions?.includes('headboard') && <LEDStrip pos={[0, 0.12, -1.05]} len={w - 0.2} color={ledColor} />}
      {led_positions?.includes('sides') && <><LEDStrip pos={[-w / 2 - 0.05, -0.1, 0.5]} len={0.01} axis="z" color={ledColor} /><LEDStrip pos={[w / 2 + 0.05, -0.1, 0.5]} len={0.01} axis="z" color={ledColor} /></>}
      {led_positions?.includes('base') && <LEDStrip pos={[-w / 2, -0.25, 0]} len={w} color={ledColor} />}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}}
    </group>
  )
}

function CabinetModel({ wood, doors, style, handle, height, finish, led_positions, ledColor }) {
  const h = height === 'short' ? 1.8 : height === 'tall' ? 2.6 : 2.2
  const w = 1.8
  const isGlossy = finish === 'glossy'

  return (
    <group>
      <mesh position={[0, h / 2 - 0.1, 0]}>
        <boxGeometry args={[w, h, 0.6]} />
        <meshStandardMaterial color={wood} roughness={isGlossy ? 0.2 : 0.8} metalness={isGlossy ? 0.1 : 0} />
      </mesh>
      {Array.from({ length: doors }).map((_, i) => (
        <mesh key={i} position={[-w / 2 + (i + 0.5) * w / doors, h / 2 - 0.1, 0.31]}>
          <boxGeometry args={[w / doors - 0.04, h - 0.1, 0.01]} />
          <meshStandardMaterial color={style === 'rustic' ? '#efe0c0' : style === 'classic' ? '#e8dcc8' : style === 'industrial' ? '#d5d5d0' : '#fff'} />
        </mesh>
      ))}

      {led_positions?.includes('top') && <LEDStrip pos={[-w / 2 + 0.1, h - 0.12, 0.31]} len={w - 0.2} color={ledColor} />}
      {led_positions?.includes('bottom') && <LEDStrip pos={[-w / 2 + 0.1, 0.05, 0.31]} len={w - 0.2} color={ledColor} />}
      {led_positions?.includes('doors') && <LEDStrip pos={[0, h / 2 - 0.1, 0.35]} len={0.01} axis="y" color={ledColor} />}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}}
    </group>
  )
}

function OfficeChairModel({ fabric, frame, armrests, lumbar, headrest, material, tilt, led_positions, ledColor }) {
  const matColor = material === 'mesh' ? fabric : fabric

  return (
    <group>
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial color={frame} />
      </mesh>
      {[0, 60, 120, 180, 240, 300].map(deg => (
        <group key={deg} rotation={[0, deg * Math.PI / 180, 0]}>
          <mesh position={[0.6, -0.68, 0]}><boxGeometry args={[0.6, 0.04, 0.04]} /><meshStandardMaterial color={frame} /></mesh>
          <mesh position={[0.95, -0.75, 0]}><sphereGeometry args={[0.05]} /><meshStandardMaterial color="#555" /></mesh>
        </group>
      ))}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.5]} />
        <meshStandardMaterial color="#666" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.4, 0.1, 1.3]} />
        <meshStandardMaterial color={matColor} />
      </mesh>
      <mesh position={[0, 0.5, -0.65]}>
        <boxGeometry args={[1.3, 0.9, 0.08]} />
        <meshStandardMaterial color={matColor} />
      </mesh>
      {headrest === 'yes' && (
        <mesh position={[0, 1, -0.65]}>
          <boxGeometry args={[0.7, 0.2, 0.06]} />
          <meshStandardMaterial color={matColor} />
        </mesh>
      )}
      {armrests === 'yes' && (
        <><mesh position={[-0.85, 0.1, -0.1]}>
          <boxGeometry args={[0.06, 0.35, 0.5]} />
          <meshStandardMaterial color={frame} />
        </mesh>
        <mesh position={[0.85, 0.1, -0.1]}>
          <boxGeometry args={[0.06, 0.35, 0.5]} />
          <meshStandardMaterial color={frame} />
        </mesh></>
      )}
      {lumbar === 'yes' && (
        <mesh position={[0, 0.2, -0.7]}>
          <boxGeometry args={[0.7, 0.15, 0.04]} />
          <meshStandardMaterial color={darken(fabric, 20)} />
        </mesh>
      )}

      {led_positions?.includes('seat') && <LEDStrip pos={[-0.65, -0.5, 0.6]} len={1.3} color={ledColor} />}
      {led_positions?.includes('back') && <LEDStrip pos={[-0.6, -0.4, -0.65]} len={1.2} color={ledColor} />}
      {led_positions?.includes('base') && <LEDStrip pos={[-0.4, -0.68, 0]} len={0.8} color={ledColor} />}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}}
    </group>
  )
}

function DeskModel({ wood, shape, size, drawers, cable, standing, led_positions, ledColor }) {
  const w = size === 'small' ? 2 : size === 'large' ? 3 : 2.6
  const isL = shape === 'lshape' || shape === 'corner'

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w, 0.06, 1.2]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      {standing !== 'yes' && [1, -1].map(x => [1, -1].map(z => (
        <mesh key={`dleg${x}${z}`} position={[x * w / 3, -0.5, z * 0.5]}>
          <boxGeometry args={[0.08, 0.9, 0.08]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )))}
      {standing === 'yes' && [1, -1].map(x => (
        <mesh key={`sleg${x}`} position={[x * w / 3, -0.5, 0]}>
          <boxGeometry args={[0.12, 0.9, 0.12]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      ))}
      {isL && (
        <mesh position={[w / 2 + 0.4, 0, 0.4]}>
          <boxGeometry args={[0.8, 0.06, 0.8]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      )}
      {drawers === 'yes' && (
        <mesh position={[-w / 2 + 0.15, -0.2, 0.5]}>
          <boxGeometry args={[0.6, 0.4, 0.5]} />
          <meshStandardMaterial color={wood} opacity={0.15} transparent />
        </mesh>
      )}

      {led_positions?.includes('top') && <LEDStrip pos={[-w / 2 + 0.15, -0.01, 0.55]} len={w - 0.3} color={ledColor} />}
      {led_positions?.includes('front') && <LEDStrip pos={[-w / 2 + 0.15, -0.01, -0.55]} len={w - 0.3} color={ledColor} />}
      {led_positions?.includes('base') && <LEDStrip pos={[-w / 4, -0.5, 0]} len={w / 2} color={ledColor} />}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}}
    </group>
  )
}

function BookshelfModel({ wood, shelves, style, shape, backpanel, led_positions, ledColor }) {
  const isLadder = shape === 'ladder'
  const gap = 2 / (shelves - 1)

  return (
    <group>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.8, 2.4, isLadder ? 0.15 : 0.35]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      {(backpanel === 'yes') && (
        <mesh position={[0, 1.2, -0.18]}>
          <boxGeometry args={[1.7, 2.3, 0.01]} />
          <meshStandardMaterial color={wood} transparent opacity={0.1} />
        </mesh>
      )}
      {Array.from({ length: shelves }).map((_, i) => (
        <mesh key={i} position={[0, i * gap + 0.2, 0]}>
          <boxGeometry args={[1.7, 0.04, isLadder ? 0.15 : 0.32]} />
          <meshStandardMaterial color={darken(wood, 12)} />
        </mesh>
      ))}

      {led_positions?.includes('shelves') && <><LEDStrip pos={[-0.8, 0.4, 0.18]} len={0.01} axis="z" color={ledColor} /><LEDStrip pos={[-0.8, 1.2, 0.18]} len={0.01} axis="z" color={ledColor} /><LEDStrip pos={[-0.8, 2.0, 0.18]} len={0.01} axis="z" color={ledColor} /></>}
      {led_positions?.includes('top') && <LEDStrip pos={[-0.85, 2.35, 0]} len={1.7} color={ledColor} />}
      {led_positions?.includes('sides') && <><LEDStrip pos={[-0.9, 1.2, 0]} len={0.01} axis="y" color={ledColor} /><LEDStrip pos={[0.9, 1.2, 0]} len={0.01} axis="y" color={ledColor} /></>}
      {led_positions?.length > 0 && <LEDGlow on color={ledColor} />}}
    </group>
  )
}

const MODELS = {
  chair: ChairModel,
  sofa: SofaModel,
  table: TableModel,
  bed: BedModel,
  cabinet: CabinetModel,
  'office-chair': OfficeChairModel,
  desk: DeskModel,
  bookshelf: BookshelfModel,
}

function CameraController({ rotation, autoRotate, onRotationChange }) {
  const controlsRef = useRef()
  const { camera } = useThree()
  const prevRotation = useRef(rotation)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
      controlsRef.current.autoRotateSpeed = 8
    }
  }, [autoRotate])

  useEffect(() => {
    if (controlsRef.current && !autoRotate && prevRotation.current !== rotation) {
      const rad = rotation * Math.PI / 180
      const dist = 4
      camera.position.set(dist * Math.sin(rad), 1.5, dist * Math.cos(rad))
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
    prevRotation.current = rotation
  }, [rotation, autoRotate, camera])

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={1.5}
      maxDistance={8}
      target={[0, 0, 0]}
      onChange={() => {
        if (controlsRef.current && !autoRotate) {
          const pos = camera.position
          const angle = Math.atan2(pos.x, pos.z) * 180 / Math.PI
          const deg = ((angle % 360) + 360) % 360
          onRotationChange(Math.round(deg))
        }
      }}
    />
  )
}

function Scene({ type, props, rotation, autoRotate, onRotationChange }) {
  const Model = MODELS[type]

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} />
      <hemisphereLight args={['#ddeeff', '#222244', 0.4]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#2a2a3a" transparent opacity={0.2} />
      </mesh>

      {Model && <Model {...props} />}

      <CameraController rotation={rotation} autoRotate={autoRotate} onRotationChange={onRotationChange} />
    </>
  )
}

export default function Furniture3D({ type, props, rotation, autoRotate, onRotationChange }) {
  return (
    <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 40 }}>
      <Scene type={type} props={props} rotation={rotation} autoRotate={autoRotate} onRotationChange={onRotationChange} />
    </Canvas>
  )
}
