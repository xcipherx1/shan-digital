"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const LIME = new THREE.Color("#c9f73a");
const TEAL = new THREE.Color("#2dd4bf");
const DIM = new THREE.Color("#2b3346");

const FIELD_RADIUS = 11;
const GRID = 54;
const SPREAD = 24;

/**
 * The map: a circular field of dots standing in for a service area,
 * brightest at the centre and fading toward the edge of coverage.
 */
function MapField() {
  const { positions, colors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const c = new THREE.Color();

    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const x = (i / (GRID - 1) - 0.5) * SPREAD;
        const z = (j / (GRID - 1) - 0.5) * SPREAD;
        const d = Math.hypot(x, z);
        if (d > FIELD_RADIUS) continue;

        pos.push(x, 0, z);
        // Teal near the centre, fading into the background further out.
        const t = Math.min(1, d / FIELD_RADIUS);
        c.copy(TEAL).lerp(DIM, t * t);
        col.push(c.r, c.g, c.b);
      }
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** One radar pulse: a ring expanding out across the field, then fading. */
function Pulse({ delay, period }: { delay: number; period: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = ((clock.getElapsedTime() + delay) % period) / period;
    const scale = 0.4 + t * FIELD_RADIUS;
    mesh.current?.scale.setScalar(scale);
    if (material.current) {
      // Fade in quickly, then out across the sweep.
      material.current.opacity = Math.min(t * 6, 1) * (1 - t) * 0.55;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.98, 1, 96]} />
      <meshBasicMaterial
        ref={material}
        color={LIME}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * A business on the map. The primary pin is the client we put there;
 * the rest are the surrounding area being scanned.
 */
function Pin({
  position,
  primary = false,
}: {
  position: [number, number];
  primary?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const [x, z] = position;
  const height = primary ? 1.5 : 0.9;
  const color = primary ? LIME : TEAL;

  useFrame(({ clock }) => {
    if (!group.current) return;
    // A slow bob so the map reads as alive, not a screenshot.
    const t = clock.getElapsedTime();
    group.current.position.y =
      Math.sin(t * 1.1 + x * 0.7 + z * 0.4) * 0.07 + (primary ? 0.06 : 0);
  });

  return (
    <group ref={group} position={[x, 0, z]}>
      {/* stem down to the map */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, height, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      {/* the marker */}
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[primary ? 0.17 : 0.1, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* ground halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[primary ? 0.42 : 0.26, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);

  // Surrounding businesses, scattered but clear of the centre pin.
  const pins = useMemo<[number, number][]>(
    () => [
      [-4.2, -1.8],
      [3.6, -2.6],
      [-2.4, 3.1],
      [5.1, 1.9],
      [-6.2, 1.2],
      [1.8, 4.3],
    ],
    [],
  );

  useFrame(({ pointer }) => {
    if (!group.current) return;
    // Gentle parallax so the map responds to the visitor.
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.16,
      0.035,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.05,
      0.035,
    );
  });

  return (
    <group ref={group}>
      <MapField />
      <Pulse delay={0} period={4.5} />
      <Pulse delay={1.5} period={4.5} />
      <Pulse delay={3} period={4.5} />
      <Pin position={[0, 0]} primary />
      {pins.map(([x, z]) => (
        <Pin key={`${x}:${z}`} position={[x, z]} />
      ))}
    </group>
  );
}

/**
 * Local search, visualised: a radar sweeping a service area, with the
 * client's business pinned at the centre of it. Replaces the abstract
 * terrain with something that says what the agency actually does.
 */
export default function HeroScene() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 6.4, 9.2], fov: 46 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Scene />
    </Canvas>
  );
}
