"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function WaitlistForm({ onSubmit, status }: { onSubmit: (e: React.FormEvent) => void, status: string }) {
  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-md group flex flex-col gap-4">
      <div className="relative flex flex-col w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <input 
          type="email" 
          placeholder="Email address" 
          required 
          disabled={status !== "idle"}
          className="relative h-12 w-full bg-transparent px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 border-b border-gray-100 mb-2"
        />
        <textarea
          placeholder="What would make you use Pendon every week? (Optional)"
          disabled={status !== "idle"}
          rows={2}
          className="relative w-full resize-none bg-transparent px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 text-sm"
        />
        <div className="flex justify-end p-2 mt-2">
          <button 
            type="submit" 
            disabled={status !== "idle"}
            className="relative flex h-10 w-[120px] items-center justify-center rounded-full bg-gray-950 text-sm font-medium text-white transition-transform hover:scale-[0.98] active:scale-[0.95] disabled:opacity-80 disabled:hover:scale-100"
          >
            {status === "submitting" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
              />
            ) : (
              "Join Waitlist"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export function FinalCTA() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <section className="relative overflow-hidden bg-white px-6 py-32 sm:py-48 text-center border-t border-gray-100">
      
      {/* Visual Identity: Connected notes pulsing in background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30">
        <svg className="absolute w-[800px] h-[800px]" viewBox="0 0 800 800">
          <motion.path
            d="M 200 200 Q 400 300 600 200"
            fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M 600 200 Q 500 500 300 600"
            fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Nodes */}
          <motion.circle cx="200" cy="200" r="8" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} />
          <motion.circle cx="600" cy="200" r="12" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
          <motion.circle cx="300" cy="600" r="6" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col items-center z-10 min-h-[300px]">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-lora text-3xl font-medium tracking-tight text-gray-950 sm:text-4xl mb-4">
                You're on the list.
              </h2>
              <p className="text-gray-500 text-lg">
                We'll reach out when it's your turn.
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
