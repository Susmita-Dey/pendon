"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Helper for cursor tracking spotlight
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(0,0,0,0.06), transparent 40%)`
          ),
        }}
      />
      {children}
    </div>
  );
}

export function Features() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Simulated typing effect for Search
  useEffect(() => {
    const text = "How did I structure the Q3 roadmap?";
    let i = 0;
    const interval = setInterval(() => {
      setSearchQuery(text.substring(0, i));
      i++;
      if (i > text.length) {
        setTimeout(() => { i = 0; }, 2000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="bg-[#fafafa] px-6 py-32 sm:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="mb-32 text-center">
          <h2 className="font-lora text-4xl font-medium tracking-tight text-gray-950 sm:text-6xl text-balance">
            Everything you need. <br />Nothing you don't.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 auto-rows-[450px]">
          
          {/* Thinking Canvas - Wide & Draggable */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="group md:col-span-8 flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white p-10 hover:shadow-lg transition-all duration-500"
          >
            <div className="max-w-md z-10 pointer-events-none">
              <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">Thinking Canvas</h3>
              <p className="text-gray-500 text-lg leading-relaxed">An infinite, fluid workspace that adapts to your mental model. Grab a note and move it around.</p>
            </div>
            <div className="absolute inset-0 mt-32 rounded-xl bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)]" />
            
            <div className="relative flex-1">
               <motion.div 
                 drag dragConstraints={{ left: -100, right: 300, top: -50, bottom: 150 }}
                 whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                 className="absolute top-10 left-10 w-48 h-24 bg-white border border-gray-200 rounded-xl shadow-sm cursor-grab flex items-center justify-center p-4 z-20 hover:border-gray-400 transition-colors" 
               >
                 <span className="text-sm text-gray-400">Drag me</span>
               </motion.div>
               <motion.div 
                 drag dragConstraints={{ left: -300, right: 100, top: -100, bottom: 50 }}
                 whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                 className="absolute bottom-10 right-10 w-32 h-32 bg-white border border-gray-200 rounded-xl shadow-sm cursor-grab flex items-center justify-center p-4 z-20 hover:border-gray-400 transition-colors" 
               >
                 <div className="w-full h-2 bg-gray-100 rounded-full mb-2"></div>
                 <div className="w-3/4 h-2 bg-gray-100 rounded-full"></div>
               </motion.div>
            </div>
          </motion.div>

          {/* AI Context - Narrow Spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 h-full"
          >
            <SpotlightCard className="group h-full flex flex-col justify-between rounded-[2.5rem] border border-gray-200 bg-white p-10 hover:shadow-lg transition-all duration-500">
              <div className="z-10 pointer-events-none">
                <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">AI Context</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Always-on intelligence that illuminates hidden connections.</p>
              </div>
              <div className="mt-8 flex-1 relative rounded-2xl border border-gray-100 bg-[#fafafa] flex items-center justify-center overflow-hidden">
                <p className="text-gray-300 font-lora text-xl px-8 text-center mix-blend-multiply">
                  Hover to reveal insights...
                </p>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0,transparent_100%)] flex items-center justify-center pointer-events-none">
                   <span className="text-gray-900 font-medium">Insights revealed.</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Memory - 3D Hover Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group md:col-span-5 flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white p-10 hover:shadow-lg transition-all duration-500 cursor-default"
          >
            <div className="z-10 pointer-events-none">
              <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">Memory</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Never lose a fleeting thought again. Everything is preserved.</p>
            </div>
            <div className="mt-8 flex-1 relative flex items-center justify-center perspective-[1000px]">
               <motion.div 
                 className="absolute w-48 h-32 bg-white border border-gray-200 rounded-xl shadow-sm transition-transform duration-500 group-hover:-translate-y-12 group-hover:-translate-x-8 group-hover:-rotate-6"
               />
               <motion.div 
                 className="absolute w-48 h-32 bg-white border border-gray-200 rounded-xl shadow-md transition-transform duration-500 group-hover:-translate-y-4 group-hover:translate-x-8 group-hover:rotate-6"
               />
               <motion.div 
                 className="absolute w-48 h-32 bg-white border border-gray-200 rounded-xl shadow-lg transition-transform duration-500 group-hover:translate-y-6"
               >
                 <div className="p-4 space-y-2">
                   <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
                   <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                 </div>
               </motion.div>
            </div>
          </motion.div>

          {/* Smart Search - Typing Simulation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group md:col-span-7 flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white p-10 hover:shadow-lg transition-all duration-500"
          >
            <div className="max-w-md z-10 pointer-events-none">
              <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">Smart Search</h3>
              <p className="text-gray-500 text-lg leading-relaxed">Find exactly what you meant, not just what you typed.</p>
            </div>
            <div className="mt-8 flex-1 relative flex items-center justify-center">
               <div className="w-full max-w-sm h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center px-6 shadow-inner">
                 <span className="text-gray-400 mr-3">⌘K</span>
                 <span className="text-gray-900 font-mono text-sm">{searchQuery}</span>
                 <motion.span 
                   animate={{ opacity: [1, 0] }} 
                   transition={{ duration: 0.8, repeat: Infinity }} 
                   className="w-0.5 h-5 bg-gray-900 ml-1"
                 />
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
