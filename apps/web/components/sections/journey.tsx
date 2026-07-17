"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const stages = [
    { label: "Today", desc: "Plain Notes" },
    { label: "Next", desc: "Formula Notes" },
    { label: "Soon", desc: "Tasks" },
    { label: "Future", desc: "API Behaviors" },
  ];

  return (
    <section ref={containerRef} className="relative bg-white px-6 py-32 sm:py-48 flex flex-col items-center justify-center overflow-hidden border-t border-gray-100">
      <div className="mx-auto text-center max-w-3xl z-10">
        <h2 className="font-lora text-4xl sm:text-6xl font-medium tracking-tight text-gray-950 mb-20">
          Built in public.
        </h2>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-center w-full max-w-2xl gap-8 sm:gap-0">
          {/* Animated connection line through the journey */}
          <div className="absolute top-1/2 left-0 right-0 h-px hidden sm:block">
            <svg className="w-full h-[20px] overflow-visible pointer-events-none" preserveAspectRatio="none">
              <motion.line 
                x1="0" y1="10" x2="100%" y2="10" 
                stroke="#d1d5db" 
                strokeWidth="2" 
                strokeDasharray="4 4"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {stages.map((stage, i) => (
            <motion.div 
              key={stage.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative flex flex-col items-center gap-4 bg-white px-4"
            >
              <div className="h-4 w-4 rounded-full border-2 border-gray-300 bg-white z-10" />
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-widest">{stage.label}</span>
                <span className="text-sm font-medium text-gray-900 mt-1">{stage.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
