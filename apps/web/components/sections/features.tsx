"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
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
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.1), transparent 40%)`
          ),
        }}
      />
      {children}
    </div>
  );
}

export function Features() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiText, setAiText] = useState("");
  const aiFullText = "Based on your notes, this project depends on the Q3 roadmap and marketing budget.";
  
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

  // Simulated AI reasoning stream
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setAiText(aiFullText.substring(0, i));
      i++;
      if (i > aiFullText.length) {
        setTimeout(() => { i = 0; }, 3000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="bg-[#fafafa] px-6 py-24 sm:py-48 relative overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-24 text-center">
          <h2 className="font-lora text-4xl font-medium tracking-tight text-gray-950 sm:text-6xl text-balance">
            Everything you need. <br />Nothing you don't.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          
          {/* Thinking Canvas - Wide & Draggable */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 h-[450px]"
          >
            <SpotlightCard className="group h-full flex flex-col justify-between rounded-[2.5rem] border border-gray-200 bg-white p-6 md:p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="max-w-md z-20 pointer-events-none">
                <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">Thinking Canvas</h3>
                <p className="text-gray-500 text-lg leading-relaxed">An infinite, fluid workspace that adapts to your mental model. Grab a note and move it around.</p>
              </div>
              <div className="absolute inset-0 mt-32 rounded-xl bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_20%,transparent_100%)] z-0" />
              
              <div className="relative flex-1 w-full h-full">
                <motion.div 
                  drag dragConstraints={{ left: -50, right: 250, top: -50, bottom: 100 }}
                  whileDrag={{ scale: 1.02, cursor: "grabbing", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  className="absolute top-4 left-4 w-56 bg-white border border-gray-200 rounded-sm shadow-md cursor-grab flex flex-col p-4 z-20 hover:border-[#D9A441]/50 transition-colors" 
                >
                  <span className="font-mono text-sm font-bold text-gray-900 mb-2">Q3 Roadmap</span>
                  <span className="text-sm text-gray-500 mb-3">Focus on product market fit and user onboarding.</span>
                  <div className="flex gap-2">
                    <span className="h-4 w-12 bg-gray-100 rounded-sm"></span>
                    <span className="h-4 w-8 bg-[#D9A441]/20 rounded-sm"></span>
                  </div>
                </motion.div>
                
                <motion.div 
                  drag dragConstraints={{ left: -250, right: 100, top: -100, bottom: 50 }}
                  whileDrag={{ scale: 1.02, cursor: "grabbing", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  className="absolute bottom-4 right-10 w-48 bg-white border border-gray-200 rounded-sm shadow-md cursor-grab flex flex-col p-4 z-20 hover:border-[#D9A441]/50 transition-colors" 
                >
                  <span className="font-mono text-xs text-[#D9A441] mb-1 uppercase tracking-wider">Formula</span>
                  <span className="font-mono text-sm font-medium text-gray-900 mb-2">Budget</span>
                  <div className="w-full h-1 bg-gray-100 rounded-full mb-1"></div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mb-1"></div>
                  <div className="w-2/3 h-1 bg-emerald-200 rounded-full"></div>
                </motion.div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Knowledge Graph - Interactive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 h-[450px]"
          >
            <SpotlightCard className="group h-full flex flex-col justify-between rounded-[2.5rem] border border-gray-200 bg-white p-6 md:p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="z-20 pointer-events-none">
                <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">Knowledge Graph</h3>
                <p className="text-gray-500 text-lg leading-relaxed">See how ideas connect in real-time.</p>
              </div>
              <div className="relative flex-1 flex items-center justify-center">
                <motion.div 
                  className="absolute w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm cursor-pointer z-20 hover:border-[#D9A441] hover:text-[#D9A441] transition-colors"
                  drag dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="font-mono text-xs font-bold">Root</span>
                </motion.div>
                <motion.div 
                  className="absolute w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm cursor-pointer z-20 -translate-x-16 translate-y-12 hover:border-[#D9A441] transition-colors"
                  drag dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div 
                  className="absolute w-10 h-10 bg-white rounded-full border border-gray-200 shadow-sm cursor-pointer z-20 translate-x-16 translate-y-8 hover:border-[#D9A441] transition-colors"
                  drag dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                  whileHover={{ scale: 1.2 }}
                />
                <motion.div 
                  className="absolute w-6 h-6 bg-white rounded-full border border-gray-200 shadow-sm cursor-pointer z-20 translate-x-4 -translate-y-16 hover:border-[#D9A441] transition-colors"
                  drag dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
                  whileHover={{ scale: 1.2 }}
                />
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <motion.line x1="50%" y1="50%" x2="25%" y2="70%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4" />
                  <motion.line x1="50%" y1="50%" x2="75%" y2="65%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4" />
                  <motion.line x1="50%" y1="50%" x2="55%" y2="25%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4" />
                  <motion.circle r="3" fill="#D9A441" animate={{ cx: ["50%", "25%"], cy: ["50%", "70%"], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                </svg>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Smart Search - Typing Simulation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-12 h-64"
          >
            <SpotlightCard className="group h-full flex flex-col md:flex-row items-center justify-between rounded-[2.5rem] border border-gray-200 bg-white p-6 md:p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="max-w-md z-20 pointer-events-none mb-6 md:mb-0 text-center md:text-left w-full">
                <h3 className="mb-2 font-lora text-3xl font-medium text-gray-950">Smart Search</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Find exactly what you meant.</p>
              </div>
              <div className="flex-1 w-full relative flex items-center justify-center md:justify-end z-20">
                <div className="w-full max-w-lg h-16 bg-white border border-gray-200 rounded-full flex items-center px-6 shadow-sm group-hover:border-[#D9A441]/50 group-hover:shadow-[#D9A441]/10 transition-all">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <span className="text-gray-900 font-mono text-base">{searchQuery}</span>
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ duration: 0.8, repeat: Infinity }} 
                    className="w-0.5 h-6 bg-[#D9A441] ml-1"
                  />
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Projects - Mini Board */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 h-[450px]"
          >
            <SpotlightCard className="group h-full flex flex-col justify-between rounded-[2.5rem] border border-gray-200 bg-white p-6 md:p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="z-20 pointer-events-none">
                <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">Projects</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Organize seamlessly.</p>
              </div>
              <div className="relative flex-1 mt-6 flex flex-col gap-3">
                <motion.div whileHover={{ x: 5 }} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center cursor-pointer">
                  <span className="font-mono text-sm font-medium text-gray-900">Brand Redesign</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center cursor-pointer">
                  <span className="font-mono text-sm font-medium text-gray-900">V7 Launch</span>
                  <span className="w-2 h-2 rounded-full bg-[#D9A441]"></span>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center cursor-pointer">
                  <span className="font-mono text-sm font-medium text-gray-900">Q3 Planning</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </motion.div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Memory - 3D Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 h-full"
          >
            <SpotlightCard className="group h-full flex flex-col justify-between rounded-[2.5rem] border border-gray-200 bg-white p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 cursor-default">
              <div className="z-20 pointer-events-none">
                <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">Memory</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Never lose a thought.</p>
              </div>
              <div className="mt-8 flex-1 relative flex items-center justify-center perspective-[1000px]">
                <motion.div 
                  className="absolute w-40 h-28 bg-white border border-gray-200 rounded-sm shadow-sm transition-transform duration-700 group-hover:-translate-y-12 group-hover:-translate-x-8 group-hover:-rotate-6"
                />
                <motion.div 
                  className="absolute w-40 h-28 bg-white border border-gray-200 rounded-sm shadow-md transition-transform duration-700 group-hover:-translate-y-4 group-hover:translate-x-8 group-hover:rotate-6"
                />
                <motion.div 
                  className="absolute w-40 h-28 bg-white border border-gray-200 rounded-sm shadow-lg transition-transform duration-700 group-hover:translate-y-6"
                >
                  <div className="p-4 space-y-2">
                    <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
                    <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* AI Context - Reasoning Stream */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-4 h-full"
          >
            <SpotlightCard className="group h-full flex flex-col justify-between rounded-[2.5rem] border border-gray-200 bg-white p-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
              <div className="z-20 pointer-events-none">
                <h3 className="mb-4 font-lora text-3xl font-medium text-gray-950">AI Context</h3>
                <p className="text-gray-500 text-lg leading-relaxed">Always-on intelligence.</p>
              </div>
              <div className="mt-8 flex-1 relative rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col p-6 overflow-hidden group-hover:border-[#D9A441]/30 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#D9A441] animate-pulse"></div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D9A441]">Reasoning</span>
                </div>
                <p className="text-gray-700 font-mono text-sm leading-relaxed min-h-[4rem]">
                  {aiText}
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 h-3.5 bg-gray-400 ml-1 translate-y-0.5" />
                </p>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
