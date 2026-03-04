/**
 * Dragon Logo Component
 * Custom-crafted dragon-shaped 'A' logo with premium animations
 */

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DragonLogo = ({ size = 'md', animated = true }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  useEffect(() => {
    if (!animated || !ref.current) return;

    const handleMouseMove = (e) => {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const normalizedX = (e.clientX - centerX) / (rect.width / 2);
      const normalizedY = (e.clientY - centerY) / (rect.height / 2);
      
      mouseX.set(Math.max(-0.5, Math.min(0.5, normalizedX)));
      mouseY.set(Math.max(-0.5, Math.min(0.5, normalizedY)));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animated, mouseX, mouseY]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  // SVG Path for dragon-shaped 'A'
  const dragonPath = `
    M50,10 
    C60,5 75,8 82,18 
    C95,35 98,55 85,72 
    C78,82 65,88 52,85 
    C35,80 22,68 18,52 
    C12,32 22,15 38,12 
    C44,10 48,10 50,10 
    Z 
    M45,25 
    L30,45 
    L45,45 
    L45,70 
    L55,70 
    L55,45 
    L70,45 
    L55,25 
    Z
  `;

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX: animated ? rotateX : 0,
        rotateY: animated ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      className={`relative ${sizeClasses[size]} cursor-pointer group`}
    >
      {/* Main Logo Container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden"
        style={{
          transform: 'translateZ(20px)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 30px rgba(249,115,22,0.3)'
        }}
      >
        {/* Fire effect background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,200,100,0.8)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,100,50,0.6)_0%,transparent_50%)]" />
        </div>

        {/* Dragon SVG */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full filter drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 0 10px rgba(249,115,22,0.5))' }}
        >
          <defs>
            <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <pattern id="scales" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M0,5 L5,0 L10,5 L5,10 Z" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>

          {/* Dragon body with scales */}
          <path
            d={dragonPath}
            fill="url(#dragonGradient)"
            stroke="url(#dragonGradient)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          {/* Scale pattern overlay */}
          <path
            d={dragonPath}
            fill="url(#scales)"
            stroke="none"
          />

          {/* Eye */}
          <circle cx="65" cy="35" r="4" fill="white">
            <animate
              attributeName="r"
              values="4;4.5;4"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="67" cy="33" r="1.5" fill="black" />

          {/* Horns */}
          <path d="M45,15 L35,5 L40,10" fill="#f97316" opacity="0.8" />
          <path d="M55,15 L65,5 L60,10" fill="#f97316" opacity="0.8" />

          {/* Fire breath */}
          <path
            d="M80,50 Q90,40 95,45 Q100,50 90,55 Q85,60 80,50"
            fill="url(#dragonGradient)"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.8;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        {/* Floating particles (dragon fire sparks) */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Outer Glow Ring */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-yellow-600/20 rounded-3xl blur-xl -z-10"
      />

      {/* Floating dragon scales */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm"
      />
      
      <motion.div
        animate={{
          y: [0, 5, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-sm"
      />
    </motion.div>
  );
};

export default DragonLogo;