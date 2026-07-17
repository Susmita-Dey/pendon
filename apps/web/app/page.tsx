"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { EvolvingNote, NoteState } from "@/components/primitives/evolving-note";
import { Journey } from "@/components/sections/journey";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to active scenario index (0 to 5)
  const activeIndex = useTransform(scrollYProgress, 
    [0, 0.15, 0.2, 0.35, 0.4, 0.55, 0.6, 0.75, 0.8, 0.95], 
    [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]
  );

  const scenarios = [
    {
      title: "Start with a note.\nEnd anywhere.",
      description: "",
      state: "plain" as NoteState,
    },
    {
      title: "Budgeting",
      description: "A note becomes a formula. Values update instantly.",
      state: "formula" as NoteState,
    },
    {
      title: "Research",
      description: "A note becomes a knowledge graph. Relationships emerge.",
      state: "graph" as NoteState,
    },
    {
      title: "Project Planning",
      description: "A note becomes a workflow. Tasks track themselves.",
      state: "workflow" as NoteState,
    },
    {
      title: "Software Architecture",
      description: "A note becomes a connected system diagram.",
      state: "diagram" as NoteState,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      
      {/* The Continuous Canvas Scrollytelling Section */}
      <main ref={containerRef} className="relative h-[500vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Subtle Canvas Background Dots */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none" />

          {/* Central Canvas Demo */}
          <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Storytelling Copy (Left side on desktop, top on mobile) */}
            <div className="flex-1 w-full text-center md:text-left h-[150px] md:h-[200px] flex flex-col justify-center">
              {scenarios.map((scenario, index) => {
                // Determine opacity based on activeIndex
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
                    <p className="text-lg sm:text-xl text-gray-500 text-balance">
                      {scenario.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* The Evolving Canvas Component */}
            <div className="flex-1 flex justify-center items-center h-[300px] w-full relative">
              {/* Pulsing background nodes for visual identity */}
              <motion.div 
                className="absolute h-[400px] w-[400px] bg-gray-100 rounded-full blur-[100px] opacity-50 z-0"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <div className="relative z-10 flex items-center justify-center">
                {/* 
                  Instead of re-rendering, we pass a reactive state to EvolvingNote.
                  Since EvolvingNote takes a string prop, we use a wrapper component that subscribes to the motion value.
                */}
                <MotionEvolvingNote activeIndex={activeIndex} scenarios={scenarios} />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Journey />
      <FinalCTA />
    </div>
  );
}

// Wrapper to reactively pass the state to EvolvingNote based on MotionValue
import { useState, useEffect as ReactEffect } from "react";
import type { MotionValue } from "framer-motion";

function MotionEvolvingNote({ activeIndex, scenarios }: { activeIndex: MotionValue<number>, scenarios: any[] }) {
  const [index, setIndex] = useState(0);

  ReactEffect(() => {
    return activeIndex.onChange((latest: number) => {
      setIndex(Math.round(latest));
    });
  }, [activeIndex]);

  return <EvolvingNote state={scenarios[index]?.state || "plain"} />;
}
