/**
 * CosmicBackground.jsx
 * Ultra-premium 3D particle system with multiple dimensions
 */

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Trail, Stars } from "@react-three/drei";
import * as THREE from "three";

// First dimension: Floating particles
const ParticleField = ({ count = 2000, color = "#4f46e5" }) => {
  const points = useRef();
  const { mouse } = useThree();
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute in a torus shape
      const r = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      // Color gradient based on position
      const c = new THREE.Color().setHSL(
        0.6 + (pos[i * 3] / 15) * 0.3,
        0.8,
        0.5 + (pos[i * 3 + 1] / 15) * 0.3
      );
      
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    
    return [pos, cols];
  }, [count]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (points.current) {
      points.current.rotation.y = time * 0.05 + mouse.x * 0.5;
      points.current.rotation.x = Math.sin(time * 0.2) * 0.1 + mouse.y * 0.3;
      points.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
    }
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
};

// Second dimension: Central glowing orb
const CentralOrb = () => {
  const orb = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (orb.current) {
      orb.current.position.y = Math.sin(time) * 0.5;
      orb.current.rotation.x = time * 0.1;
      orb.current.rotation.y = time * 0.2;
    }
  });

  return (
    <Trail
      width={0.8}
      length={8}
      color={new THREE.Color("#4f46e5")}
      attenuation={(t) => t * t}
    >
      <Sphere ref={orb} args={[0.8, 64, 64]} position={[0, 0, -2]}>
        <MeshDistortMaterial
          color="#4f46e5"
          emissive="#312e81"
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={2}
          emissiveIntensity={2}
        />
      </Sphere>
    </Trail>
  );
};

// Third dimension: Floating rings
const FloatingRings = () => {
  const ring1 = useRef();
  const ring2 = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = Math.sin(time * 0.2) * 0.3;
      ring1.current.rotation.y += 0.002;
      ring2.current.rotation.x = Math.cos(time * 0.2) * 0.3;
      ring2.current.rotation.y -= 0.003;
    }
  });

  return (
    <>
      {/* Ring 1 */}
      <mesh ref={ring1} position={[0, 0, -1]}>
        <torusGeometry args={[2.5, 0.05, 32, 100]} />
        <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.3} transparent opacity={0.2} />
      </mesh>
      
      {/* Ring 2 */}
      <mesh ref={ring2} position={[0, 0, 1]}>
        <torusGeometry args={[3, 0.05, 32, 100]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} transparent opacity={0.2} />
      </mesh>
    </>
  );
};

// Fourth dimension: Shooting stars
const ShootingStars = () => {
  const stars = useRef();
  
  useFrame(({ clock }) => {
    if (stars.current) {
      stars.current.rotation.y += 0.001;
    }
  });

  return (
    <Stars 
      ref={stars}
      radius={50}
      depth={50}
      count={500}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
};

// Main component
const CosmicBackground = ({ intensity = 0.8 }) => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        style={{ background: "radial-gradient(circle at 30% 30%, #0a0a1a, #030014)" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <ShootingStars />
        <FloatingRings />
        <CentralOrb />
        <ParticleField count={2500} />
        
        {/* Additional ambient particles */}
        <Points position={[2, 1, 5]}>
          <PointMaterial color="#8b5cf6" size={0.05} sizeAttenuation transparent opacity={0.3} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={100}
              array={new Float32Array(300).map(() => (Math.random() - 0.5) * 10)}
              itemSize={3}
            />
          </bufferGeometry>
        </Points>
      </Canvas>
    </div>
  );
};

export default CosmicBackground;
