/**
 * 3D Background Component
 * Cinematic particle system for auth pages
 */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 2000, mouse }) => {
  const points = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create a spherical distribution
      const radius = 8 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Colors - blue/purple gradient
      const color = new THREE.Color().setHSL(
        0.6 + Math.random() * 0.2,
        0.8,
        0.5 + Math.random() * 0.3
      );
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate based on mouse position
    if (points.current) {
      points.current.rotation.y = time * 0.05 + (mouse.x * 0.5);
      points.current.rotation.x = Math.sin(time * 0.2) * 0.1 + (mouse.y * 0.3);
    }
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlesPosition.colors}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
};

const FloatingSphere = () => {
  const sphere = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (sphere.current) {
      sphere.current.position.y = Math.sin(time) * 1.5;
      sphere.current.rotation.x = time * 0.1;
      sphere.current.rotation.y = time * 0.2;
    }
  });

  return (
    <Sphere ref={sphere} args={[1.5, 64, 64]} position={[0, 0, -5]}>
      <MeshDistortMaterial
        color="#4f46e5"
        emissive="#312e81"
        roughness={0.2}
        metalness={0.8}
        distort={0.3}
        speed={1.5}
      />
    </Sphere>
  );
};

const ThreeDBackground = ({ mouse }) => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit for performance
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <FloatingSphere />
        <ParticleField count={1500} mouse={mouse} />
        
        {/* Additional floating particles */}
        <Points position={[2, 1, -2]}>
          <PointMaterial color="#8b5cf6" size={0.1} sizeAttenuation={true} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={50}
              array={new Float32Array(150).map(() => (Math.random() - 0.5) * 5)}
              itemSize={3}
            />
          </bufferGeometry>
        </Points>
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;