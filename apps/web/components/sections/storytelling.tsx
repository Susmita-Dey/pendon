"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lines = [
    { text: "Imagine never losing an idea.", weight: "text-gray-950 font-medium text-4xl sm:text-6xl mb-12", parallax: [50, -50] },
    { text: "Capture it once.", weight: "text-gray-400 text-3xl sm:text-5xl", parallax: [40, -40] },
    { text: "Everything connects itself.", weight: "text-gray-400 text-3xl sm:text-5xl", parallax: [30, -30] },
    { text: "Weeks later, AI already understands what you meant.", weight: "text-gray-400 text-3xl sm:text-5xl", parallax: [20, -20] },
    { text: "No searching.", weight: "text-gray-400 text-3xl sm:text-5xl mt-8", parallax: [10, -10] },
    { text: "No folders.", weight: "text-gray-400 text-3xl sm:text-5xl", parallax: [0, 0] },
    { text: "No mental overhead.", weight: "text-gray-400 text-3xl sm:text-5xl", parallax: [-10, 10] },
    { text: "Just thinking.", weight: "text-gray-950 font-medium text-5xl sm:text-7xl mt-16", parallax: [-20, 20] }
  ];

  return (
    <section ref={containerRef} className="bg-white px-6 py-40 sm:py-56 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6 items-center text-center">
          {lines.map((line, index) => {
            // Setup parallax
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y = useTransform(scrollYProgress, [0, 1], line.parallax);
            return (
              <motion.p
                key={index}
                style={{ y }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className={`font-lora tracking-tight text-balance ${line.weight}`}
              >
                {line.text}
              </motion.p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
