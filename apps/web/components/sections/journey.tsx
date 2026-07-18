"use client";

import { useRef, type ReactElement } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Journey(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const stages = [
    { label: "Completed", title: "Core Editor", desc: "Markdown, Blocks, Formulas", status: "completed" },
    { label: "Current Milestone", title: "Graph View", desc: "Visualizing idea connections", status: "current" },
    { label: "Up Next", title: "Workflows", desc: "Custom node behaviors", status: "next" },
    { label: "Future", title: "Multiplayer", desc: "Real-time collaboration", status: "future" },
  ];

  return (
    <section ref={containerRef} className="relative bg-[#fafafa] px-6 py-24 sm:py-48 flex flex-col items-center justify-center overflow-hidden border-t border-gray-100">
      <div className="mx-auto text-center max-w-5xl z-10 w-full">
        <h2 className="font-lora text-4xl sm:text-6xl font-medium tracking-tight text-gray-950 mb-24">
          Built in public.
        </h2>
        
        <div className="relative flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-12 sm:gap-4 mt-8">
          {/* Animated connection line through the journey */}
          <div className="absolute top-4 left-[5%] right-[5%] h-px hidden sm:block">
            {/* Background line */}
            <div className="absolute inset-0 bg-gray-200" />
            {/* Progress line */}
            <svg className="absolute inset-0 w-full h-[20px] overflow-visible pointer-events-none -translate-y-[10px]" preserveAspectRatio="none">
              <motion.line 
                x1="0" y1="10" x2="100%" y2="10" 
                stroke="#10b981" 
                strokeWidth="2" 
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
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="relative flex flex-col items-center sm:items-start text-center sm:text-left gap-4 flex-1 px-2"
            >
              <div className="relative flex items-center justify-center w-full sm:w-auto mb-2">
                {stage.status === "completed" && (
                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 shadow-md shadow-emerald-500/20">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                {stage.status === "current" && (
                  <div className="relative h-8 w-8 flex items-center justify-center z-10">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-8 w-8 bg-blue-500 border-4 border-blue-100 shadow-md shadow-blue-500/20" />
                  </div>
                )}
                {(stage.status === "next" || stage.status === "future") && (
                  <div className="h-8 w-8 rounded-full border-2 border-gray-300 bg-[#fafafa] z-10" />
                )}
              </div>
              
              <div className="flex flex-col items-center sm:items-start">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider mb-2 ${
                  stage.status === "completed" ? "text-emerald-600" :
                  stage.status === "current" ? "text-blue-600" : "text-gray-400"
                }`}>
                  {stage.label}
                </span>
                <span className="text-lg font-medium text-gray-900 mb-1">{stage.title}</span>
                <span className="text-sm text-gray-500">{stage.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
