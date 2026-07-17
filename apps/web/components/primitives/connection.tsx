"use client";

import { motion } from "framer-motion";

interface ConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay?: number;
}

export function Connection({ startX, startY, endX, endY, delay = 0 }: ConnectionProps) {
  // Simple cubic bezier curve for a nice organic line
  const controlPointX = startX + (endX - startX) / 2;
  const path = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;

  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none z-0 overflow-visible">
      <motion.path
        d={path}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ 
          duration: 1.5, 
          delay: delay,
          ease: "easeInOut"
        }}
        stroke="#9ca3af" // gray-400
        strokeWidth="2"
        fill="none"
        strokeDasharray="4 4"
      />
      {/* Pulsing dot at the end */}
      <motion.circle
        cx={endX}
        cy={endY}
        r="4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 0.5, delay: delay + 1.2 }}
        fill="#9ca3af"
      />
    </svg>
  );
}
