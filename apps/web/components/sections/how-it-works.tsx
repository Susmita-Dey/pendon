"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    title: "Capture",
    description: "Jot down ideas at the speed of thought without worrying about where they belong.",
  },
  {
    title: "Connect",
    description: "Let the canvas automatically organize and link your thoughts contextually.",
  },
  {
    title: "Reason",
    description: "Use integrated AI to synthesize, expand, and structure your connected knowledge.",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={containerRef} className="bg-[#fafafa] px-6 py-32 sm:py-48">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-16 md:gap-24 relative">
        
        {/* Sticky Header */}
        <div className="md:w-1/3">
          <div className="md:sticky top-32 md:top-48 z-10 bg-[#fafafa]/90 py-4 md:py-0">
            <motion.h2 
              style={{ opacity: useTransform(scrollYProgress, [0.1, 0.2, 0.8, 0.9], [0, 1, 1, 0]) }}
              className="font-lora text-4xl font-medium tracking-tight text-gray-950 sm:text-5xl leading-tight"
            >
              How Pendon Works
            </motion.h2>
          </div>
        </div>
        
        {/* Scrolling Steps */}
        <div className="md:w-2/3 flex flex-col gap-32 pb-32">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-150px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              <div className="mb-6 flex h-14 w-14 sm:mb-8 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-lg font-medium text-gray-900">
                0{index + 1}
              </div>
              <h3 className="mb-4 font-lora text-2xl sm:text-3xl font-medium text-gray-950">{step.title}</h3>
              <p className="text-lg sm:text-xl text-gray-500 leading-relaxed text-balance">{step.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
