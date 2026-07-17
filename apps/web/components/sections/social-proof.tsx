"use client";

import { motion } from "framer-motion";

export function SocialProof() {
  return (
    <section className="bg-white px-6 py-32 sm:py-48 flex items-center justify-center">
      <div className="mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-lora text-5xl font-medium tracking-tight text-gray-950 sm:text-7xl leading-tight text-balance"
        >
          Built by builders.<br/>
          Launching soon.<br/>
          <span className="text-gray-400">Join the first wave.</span>
        </motion.h2>
      </div>
    </section>
  );
}
