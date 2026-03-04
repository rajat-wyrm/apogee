/**
 * Cosmic 3D Background Component
 * Lightning fast, multi-dimensional particle system
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Performance-optimized particle field
const ParticleField = ({ count = 2000, colors = ['#6366f1', '#8b5cf6', '#ec4899'] }) => {
  const points = useRef();
  const { viewport } = useThree();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colorsArray = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Distribute particles in a spherical shell
      const radius = 8 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Color based on position
      const color = new THREE.Color().setHSL(
        0.6 + (positions[i * 3] / 15) * 0.2,
        0.8,
        0.5 + (positions[i * 3 + 1] / 15) * 0.3
      );
      
      colorsArray[i * 3] = color.r;
      colorsArray[i * 3 + 1] = color.g;
      colorsArray[i * 3 + 2] = color.b;
    }
    
    return { positions, colors: colorsArray };
  }, [count]);

  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();
    
    if (points.current) {
      // Smooth rotation based on mouse and time
      points.current.rotation.y = time * 0.02 + mouse.x * 0.5;
      points.current.rotation.x = Math.sin(time * 0.1) * 0.1 + mouse.y * 0.3;
      
      // Pulsing scale effect
      points.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    }
  });

  return (
    <Points ref={points}>
      <PointMaterial
        transparent
        vertexColors
        size={0.1}
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

// Central glowing sphere
const CoreSphere = () => {
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
    <Trail
      width={0.5}
      length={8}
      color={new THREE.Color('#6366f1')}
      attenuation={(t) => t * t}
    >
      <Sphere ref={sphere} args={[1.2, 64, 64]} position={[0, 0, -3]}>
        <MeshDistortMaterial
          color="#4f46e5"
          emissive="#312e81"
          roughness={0.2}
          metalness={0.9}
          distort={0.4}
          speed={2}
          emissiveIntensity={1.5}
        />
      </Sphere>
    </Trail>
  );
};

// Floating geometric shapes
const FloatingShapes = () => {
  const group = useRef();
  const shapes = useMemo(() => {
    return [...Array(5)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15 - 5
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.3 + Math.random() * 0.3,
      color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6)
    }));
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={group}>
      {shapes.map((shape, i) => (
        <mesh
          key={i}
          position={shape.position}
          rotation={shape.rotation}
          scale={shape.scale}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
};

// Light rays/beams
const LightBeams = () => {
  const beams = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      position: [Math.sin(i * Math.PI / 4) * 10, Math.cos(i * Math.PI / 4) * 10, -10],
      rotation: [0, i * Math.PI / 4, 0],
      color: i % 2 === 0 ? '#6366f1' : '#8b5cf6'
    }));
  }, []);

  return (
    <>
      {beams.map((beam, i) => (
        <mesh key={i} position={beam.position} rotation={beam.rotation}>
          <cylinderGeometry args={[0.1, 0.1, 20, 8]} />
          <meshBasicMaterial color={beam.color} transparent opacity={0.1} />
        </mesh>
      ))}
    </>
  );
};

// Main component
const CosmicBackground = ({ intensity = 0.7 }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ 
          background: 'radial-gradient(circle at 50% 50%, #0a0a1a, #030014)',
          opacity: intensity
        }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        performance={{ min: 0.5 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        
        {/* Scene elements */}
        <CoreSphere />
        <ParticleField count={1500} />
        <FloatingShapes />
        <LightBeams />
        
        {/* Additional ambient particles */}
        <Points position={[0, 0, -5]}>
          <PointMaterial color="#8b5cf6" size={0.05} sizeAttenuation={true} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={100}
              array={new Float32Array(300).map(() => (Math.random() - 0.5) * 20)}
              itemSize={3}
            />
          </bufferGeometry>
        </Points>

        {/* Lens flare effect */}
        <mesh position={[5, 5, 5]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-5, -3, 2]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#8b5cf6" />
        </mesh>
      </Canvas>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-900/20 pointer-events-none" />
    </div>
  );
}; 

export default CosmicBackground;