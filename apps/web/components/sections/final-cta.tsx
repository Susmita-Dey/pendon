"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

function MagneticButton({ children, disabled }: { children: React.ReactNode, disabled?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      disabled={disabled}
      type="submit"
      className="relative flex h-10 w-[130px] items-center justify-center rounded-full bg-gray-950 text-sm font-medium text-white transition-all hover:bg-[#D9A441] disabled:opacity-50 disabled:hover:bg-gray-950 shadow-sm hover:shadow-md hover:shadow-[#D9A441]/20 group"
    >
      {children}
    </motion.button>
  );
}

function WaitlistForm({ onSubmit, status }: { onSubmit: (e: React.FormEvent) => void, status: string }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-md group flex flex-col gap-4">
      <motion.div 
        animate={{ borderColor: isFocused ? "#D9A441" : "#e5e7eb", boxShadow: isFocused ? "0 0 0 4px rgba(217, 164, 65, 0.1)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
        className="relative flex flex-col w-full overflow-hidden rounded-2xl border bg-white p-2 transition-all duration-300"
      >
        <input 
          type="email" 
          name="email"
          placeholder="Email address" 
          required 
          disabled={status !== "idle"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="relative h-12 w-full bg-transparent px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 border-b border-gray-100 mb-2 caret-[#D9A441]"
        />
        <textarea
          name="feedback"
          placeholder="What would you build first with Pendon? (Optional)"
          disabled={status !== "idle"}
          rows={2}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="relative w-full resize-none bg-transparent px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 text-sm caret-[#D9A441]"
        />
        <div className="flex justify-end p-2 mt-2">
          <MagneticButton disabled={status !== "idle"}>
            {status === "submitting" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
              />
            ) : (
              <span className="flex items-center">
                Join Waitlist
                <motion.span 
                  className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </span>
            )}
          </MagneticButton>
        </div>
      </motion.div>
    </form>
  );
}

export function FinalCTA() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    
    setStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const feedback = formData.get("feedback");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feedback }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("idle");
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative overflow-hidden bg-white px-6 py-32 sm:py-48 text-center border-t border-gray-100">
      
      {/* Visual Identity: Connected notes pulsing in background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30">
        <svg className="absolute w-[800px] h-[800px]" viewBox="0 0 800 800">
          <motion.path
            d="M 200 200 Q 300 300 400 450"
            fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M 600 200 Q 500 300 400 450"
            fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path
            d="M 400 750 Q 400 650 400 550"
            fill="none" stroke="#D9A441" strokeWidth="2" strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
          />
          
          <motion.circle cx="200" cy="200" r="8" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.circle cx="600" cy="200" r="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
          <motion.circle cx="400" cy="750" r="6" fill="#fdf8ef" stroke="#D9A441" strokeWidth="2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center z-10 min-h-[300px]">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="h-16 w-16 rounded-full bg-[#fdf8ef] flex items-center justify-center mb-6 shadow-sm border border-[#D9A441]/20">
                <svg className="h-8 w-8 text-[#D9A441]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-lora text-4xl font-medium tracking-tight text-gray-950 mb-4">
                You're on the list.
              </h2>
              <p className="text-gray-500 text-xl max-w-sm">
                We'll reach out when it's your turn to shape the future of thought.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center w-full"
            >
              <h2 className="font-lora text-4xl font-medium tracking-tight sm:text-5xl text-balance leading-tight mb-4 text-gray-950">
                Help shape Pendon.
              </h2>
              
              <p className="text-gray-500 text-lg sm:text-xl text-balance max-w-md mb-12">
                Pendon is being built in public. Every week we ship something new. Join early and help shape what comes next.
              </p>
              
              <div className="w-full flex justify-center">
                <WaitlistForm onSubmit={handleSubmit} status={status} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
