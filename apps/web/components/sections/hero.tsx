"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { Button } from "@repo/ui/button";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 200, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 40; // max shift 20px
      const y = (e.clientY / innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll parallax
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacityParallax = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafa] px-6 text-center"
    >
      {/* Interactive Thinking Canvas Background */}
      <motion.div 
        style={{ x: smoothX, y: smoothY }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-40"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative w-[150vw] h-[150vh] max-w-[2000px] max-h-[1500px]"
        >
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          {/* Drifting Note Blocks */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 15, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-[10%] sm:left-[20%] h-16 w-32 sm:h-20 sm:w-40 rounded-xl border border-gray-300 bg-white shadow-sm"
          />
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -20, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[35%] right-[5%] sm:right-[20%] h-24 w-40 sm:h-32 sm:w-56 rounded-xl border border-gray-200 bg-white shadow-sm"
          />
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, -25, 0], rotate: [0, 0.5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[30%] left-[20%] sm:left-[30%] h-20 w-36 sm:h-24 sm:w-48 rounded-xl border border-gray-300 bg-white shadow-sm"
          />
          
          {/* Animated Connecting SVG Lines */}
          <svg className="absolute inset-0 w-full h-full stroke-gray-300" strokeWidth="1" fill="none">
            <motion.path
              d="M 20% 25% Q 50% 30% 80% 35%"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
            />
            <motion.path
              d="M 30% 70% Q 60% 50% 80% 35%"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 4, ease: "easeInOut", delay: 2 }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Typography with Parallax */}
      <motion.div 
        style={{ y: yParallax, opacity: opacityParallax }}
        className="z-10 flex max-w-5xl flex-col items-center gap-10 mt-[-5vh]"
      >
        <motion.h1 
          initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-lora text-5xl font-medium leading-[0.9] tracking-tight text-gray-950 sm:text-[7rem] text-balance"
        >
          The workspace built for thinking.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-xl text-gray-600 sm:text-2xl leading-relaxed text-balance"
        >
          Capture ideas. Connect knowledge. Think with AI. Build clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6"
        >
          <Button size="lg" className="h-14 rounded-full px-10 text-lg font-medium transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.97]">
            Join Waitlist
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
