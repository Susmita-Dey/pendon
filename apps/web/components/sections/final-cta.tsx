"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AnimatedCounter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </div>
      <span>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-white"
        >
          {value.toLocaleString()}
        </motion.span>{" "}
        Founding Members joined
      </span>
    </div>
  );
}

function GlowingInput({ onSubmit, status }: { onSubmit: (e: React.FormEvent) => void, status: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 40%)`
  );

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-md group"
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className="relative flex w-full items-center overflow-hidden rounded-full border border-gray-800 bg-gray-900 p-1"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{ background }}
        />
        <input 
          type="email" 
          placeholder="Enter your email" 
          required 
          disabled={status !== "idle"}
          className="relative h-14 flex-1 bg-transparent px-6 text-white placeholder:text-gray-500 focus:outline-none disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={status !== "idle"}
          className="relative flex h-12 w-[140px] items-center justify-center rounded-full bg-white font-medium text-gray-950 transition-transform hover:scale-[0.98] active:scale-[0.95] disabled:opacity-80 disabled:hover:scale-100"
        >
          {status === "submitting" ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-5 w-5 rounded-full border-2 border-gray-900 border-t-transparent"
            />
          ) : (
            "Get Early Access"
          )}
        </button>
      </div>
    </form>
  );
}

export function FinalCTA() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [count, setCount] = useState(1248);

  // Simulate counter randomly ticking up
  useEffect(() => {
    if (status === "success") return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCount(prev => prev + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setCount(prev => prev + 1);
    }, 1500);
  };

  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 py-40 sm:py-56 text-center text-white">
      {/* Subtle animated background glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[120px]"
      />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center z-10 min-h-[300px]">
        
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.1 }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400"
              >
                <CheckCircleIcon className="h-10 w-10" />
              </motion.div>
              <h2 className="font-lora text-4xl font-medium tracking-tight text-white sm:text-5xl mb-4">
                You're on the list.
              </h2>
              <p className="text-gray-400 text-lg">
                Welcome to the first wave of thinkers. We'll be in touch soon.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8"
              >
                <AnimatedCounter value={count} />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-lora text-5xl font-medium tracking-tight sm:text-7xl text-balance leading-[1.1] mb-16"
              >
                Be among the first thinkers.
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-center"
              >
                <GlowingInput onSubmit={handleSubmit} status={status} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
