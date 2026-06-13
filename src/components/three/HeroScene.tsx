"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 110;
const ROWS = 55;
const WIDTH = 26;
const DEPTH = 13;

const LIME = new THREE.Color("#c9f73a");
const TEAL = new THREE.Color("#2dd4bf");
const INK = new THREE.Color("#3a4154");

/**
 * A low-poly particle terrain that ripples like a sonar/map surface —
 * a nod to "putting local businesses on the map". Colors sweep from
 * teal to lime across the field; the camera drifts with the pointer.
 */
function ParticleTerrain() {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const { positions, colors, basePositions } = useMemo(() => {
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c / (COLS - 1) - 0.5) * WIDTH;
        const z = (r / (ROWS - 1) - 0.5) * DEPTH;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;

        // Sweep: ink at edges, teal mid, lime hot-spot right of centre
        const t = c / (COLS - 1);
        if (t < 0.55) color.lerpColors(INK, TEAL, t / 0.55);
        else color.lerpColors(TEAL, LIME, (t - 0.55) / 0.45);
        const fade = 1 - Math.abs(r / (ROWS - 1) - 0.5) * 0.9;
        colors[i * 3] = color.r * fade;
        colors[i * 3 + 1] = color.g * fade;
        colors[i * 3 + 2] = color.b * fade;
        i++;
      }
    }
    return { positions, colors, basePositions: positions.slice() };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const geo = points.current?.geometry;
    if (geo) {
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        const x = basePositions[i];
        const z = basePositions[i + 2];
        pos[i + 1] =
          Math.sin(x * 0.55 + t * 0.8) * 0.45 +
          Math.cos(z * 0.9 + t * 0.6) * 0.35 +
          Math.sin((x + z) * 0.32 + t * 0.35) * 0.5;
      }
      geo.attributes.position.needsUpdate = true;
    }
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        pointer.x * 0.12,
        0.04,
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        0.42 - pointer.y * 0.06,
        0.04,
      );
    }
  });

  return (
    <group ref={group} rotation={[0.42, 0, 0]} position={[0, -1.1, 0]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 2.2, 7.5], fov: 55 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <ParticleTerrain />
    </Canvas>
  );
}
