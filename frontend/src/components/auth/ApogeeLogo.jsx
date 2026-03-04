/**
 * ApogeeLogo.jsx
 * Minimalist MAANG-style animated logo
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ApogeeLogo = ({ size = "md", animated = true, className = "" }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!animated) return;
    
    const handleMouseMove = (e) => {
      const rect = document.getElementById("apogee-logo")?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [animated]);

  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  return (
    <motion.div
      id="apogee-logo"
      className={`relative ${sizes[size]} ${className} cursor-pointer`}
      style={{
        rotateX: animated ? mousePosition.y * 10 : 0,
        rotateY: animated ? mousePosition.x * 10 : 0,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Main circle */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3)_0%,transparent_70%)]" />
        
        {/* Animated rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-white/20 rounded-2xl"
        />
        
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border border-white/10 rounded-xl"
        />
        
        {/* Geometric patterns */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="35" fill="none" stroke="url(#logoGradient)" strokeWidth="1" />
          <path d="M30,30 L70,70 M70,30 L30,70" stroke="url(#logoGradient)" strokeWidth="1" />
        </svg>

        {/* Main letter A */}
        <motion.span
          animate={{
            textShadow: [
              "0 0 10px rgba(255,255,255,0.5)",
              "0 0 20px rgba(255,255,255,0.8)",
              "0 0 10px rgba(255,255,255,0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10 text-white font-black text-4xl"
        >
          A
        </motion.span>
      </div>

      {/* Floating particles */}
      {animated && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </motion.div>
  );
};

export default ApogeeLogo;
