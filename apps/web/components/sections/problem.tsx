"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative mr-3 mt-3 inline-block">
      <span className="absolute opacity-0">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

export function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const text = "People don't struggle because they lack information. They struggle because information is fragmented.";
  const words = text.split(" ");

  return (
    <section ref={containerRef} className="relative h-[150vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <h2 className="font-lora text-3xl font-medium tracking-tight text-gray-950 sm:text-6xl leading-[1.2] sm:leading-[1.1] flex flex-wrap justify-center">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word key={i} progress={scrollYProgress} range={[start, end]}>
                  {word}
                </Word>
              );
            })}
          </h2>
          <motion.p 
            style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]) }}
            className="mx-auto mt-12 max-w-2xl text-xl text-gray-500 leading-relaxed text-balance"
          >
            We spend more time organizing, tagging, and searching than we do actual thinking. Pendon removes the friction between a raw thought and a structured insight.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
