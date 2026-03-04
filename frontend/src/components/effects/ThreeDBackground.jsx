import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles() {
  const points = useRef();
  
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const r = 5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        color="#4f46e5"
        size={0.1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
}

export default function ThreeDBackground() {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
      background: "#030014"
    }}>
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
}
