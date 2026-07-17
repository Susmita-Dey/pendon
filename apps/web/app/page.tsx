"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { EvolvingNote, NoteState } from "@/components/primitives/evolving-note";
import { Journey } from "@/components/sections/journey";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/sections/footer";
import { useState, useEffect as ReactEffect } from "react";
import type { MotionValue } from "framer-motion";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const cursorBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(0,0,0,0.03), transparent 40%)`
  );

  // Map scroll progress to active scenario index (0 to 5)
  const activeIndex = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.35, 0.4, 0.55, 0.6, 0.75, 0.8, 0.95], 
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]
  );

  const scenarios = [
    {
      title: "Start with a note\nin canvas.\nEnd anywhere.",
      description: "Everything begins with a thought.",
      state: "plain" as NoteState,
    },
    {
      title: "Add a Formula",
      description: "Watch ideas become live calculations.",
      state: "formula" as NoteState,
    },
    {
      title: "Turn it into a Checklist",
      description: "Structure your execution and track progress.",
      state: "checklist" as NoteState,
    },
    {
      title: "Make it a Workflow",
      description: "Transform static lists into active systems.",
      state: "workflow" as NoteState,
    },
    {
      title: "Connect as a Graph",
      description: "Reveal relationships hidden inside your work.",
      state: "graph" as NoteState,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]" onMouseMove={handleMouseMove}>
      <Navbar />
      
      {/* The Continuous Canvas Scrollytelling Section */}
      <main ref={containerRef} className="relative h-[625vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Environment Effects (Hero Only & Cursor Radial) */}
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply" 
            style={{ background: cursorBackground }}
          />
          {/* Animated Paper Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[2rem_2rem] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] opacity-50 pointer-events-none" />

          {/* Central Canvas Demo */}
          <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-12 pb-[10vh]">
            
            {/* Storytelling Copy */}
            <div className="flex-1 w-full text-center md:text-left h-[200px] md:h-[400px] flex flex-col justify-center">
              {scenarios.map((scenario, index) => {
                const opacity = useTransform(activeIndex, (latest) => Math.round(latest) === index ? 1 : 0);
                const y = useTransform(activeIndex, (latest) => Math.round(latest) === index ? 0 : 20);
                const pointerEvents = useTransform(activeIndex, (latest) => Math.round(latest) === index ? "auto" : "none");

                return (
                  <motion.div 
                    key={index}
                    style={{ opacity, y, pointerEvents }}
                    className={`absolute flex flex-col gap-4 ${index === 0 ? 'w-full md:w-[120%]' : 'max-w-sm'}`}
                  >
                    <h2 className={`font-lora font-medium tracking-tighter text-gray-950 leading-[1.05] whitespace-pre-line ${
                      index === 0 
                        ? 'text-6xl sm:text-[5.5rem] lg:text-[7rem]' 
                        : 'text-3xl sm:text-5xl'
                    }`}>
                      {scenario.title}
                    </h2>
                    {scenario.description && (
                      <p className="text-xl sm:text-2xl text-gray-500 font-medium tracking-tight">
                        {scenario.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* The Evolving Canvas Component */}
            <div className="flex-1 flex justify-center items-center md:items-end h-[450px] w-full relative perspective-[1200px]">
              <motion.div 
                initial={{ opacity: 0, y: 150, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex items-center justify-center w-full h-full preserve-3d origin-bottom"
              >
                <MotionEvolvingNote activeIndex={activeIndex} scenarios={scenarios} />
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      {/* Mid-page breathes (Journey) */}
      <Journey />

      <Features />
      
      {/* Final CTA with Node Network */}
      <FinalCTA />

      <Footer />
    </div>
  );
}


function MotionEvolvingNote({ activeIndex, scenarios }: { activeIndex: MotionValue<number>, scenarios: any[] }) {
  const [index, setIndex] = useState(0);

  ReactEffect(() => {
    return activeIndex.onChange((latest: number) => {
      setIndex(Math.round(latest));
    });
  }, [activeIndex]);

  return <EvolvingNote state={scenarios[index]?.state || "plain"} />;
}
