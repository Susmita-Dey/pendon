"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export type NoteState = "plain" | "formula" | "graph" | "workflow" | "checklist" | "diagram";

interface EvolvingNoteProps {
  state: NoteState;
}

export function EvolvingNote({ state }: EvolvingNoteProps) {
  const [isHovered, setIsHovered] = useState(false);

  // The visual signature: a subtle colored edge depending on state
  const edgeColor = 
    state === "formula" ? "bg-emerald-400" :
    state === "checklist" ? "bg-blue-400" :
    state === "workflow" ? "bg-purple-400" :
    state === "graph" ? "bg-amber-400" :
    "bg-gray-200";

  return (
    <motion.div
      layout
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        rotateX: 4, 
        rotateY: -4, 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        transition: { type: "spring", stiffness: 200, damping: 20 }
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg cursor-pointer transform-gpu"
      style={{
        width: state === "plain" ? 220 : state === "workflow" ? 300 : 260,
        minHeight: state === "plain" ? 80 : state === "graph" ? 220 : 160,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Visual Signature: The Evolving Colored Edge */}
      <motion.div 
        layout
        className={`absolute top-0 left-0 w-full h-1 ${edgeColor}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: state === "plain" ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Visual Signature: The Corner Fold (SVG cut-out effect top-right) */}
      <div className="absolute top-0 right-0 w-6 h-6 z-20 pointer-events-none">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 0H0L24 24V0Z" fill="#fafafa" />
          <path d="M0 0L24 24V0H0Z" fill="white" opacity="0.4" />
          <path d="M0 0L24 24" stroke="#e5e7eb" strokeWidth="1" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {state === "plain" && (
          <motion.div
            key="plain"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full items-center p-5"
          >
            <span className="font-mono text-sm text-gray-700 font-medium">Launch Product</span>
          </motion.div>
        )}

        {state === "formula" && (
          <motion.div
            key="formula"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full flex-col justify-center gap-3 p-5 pt-6"
          >
            <div className="font-mono text-sm font-medium text-gray-900 mb-1">Launch Product</div>
            <div className="flex justify-between font-mono text-sm text-gray-500">
              <span>Marketing</span>
              <span>$4000</span>
            </div>
            <div className="flex justify-between font-mono text-sm text-gray-500">
              <span>Servers</span>
              <span>$1200</span>
            </div>
            <div className="h-px w-full bg-gray-200 my-1" />
            <div className="flex justify-between font-mono text-sm font-medium text-gray-900">
              <span>Total Budget</span>
              <span className="text-emerald-600">$5200</span>
            </div>
          </motion.div>
        )}

        {state === "checklist" && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full flex-col gap-3 p-5 pt-6"
          >
            <div className="font-mono text-sm font-medium text-gray-900 mb-2">Launch Product</div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-sm border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="font-mono text-sm text-gray-400 line-through">Finalize copy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-sm border-2 border-gray-300" />
              <span className="font-mono text-sm text-gray-700">Deploy to production</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-sm border-2 border-gray-300" />
              <span className="font-mono text-sm text-gray-700">Send email blast</span>
            </div>
          </motion.div>
        )}

        {state === "workflow" && (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full flex-col gap-3 p-5 pt-6"
          >
            <div className="font-mono text-sm font-medium text-gray-900 mb-2">Launch Product</div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
              <span className="font-mono text-xs text-gray-600">To Do</span>
              <span className="h-5 w-5 rounded bg-white border border-gray-200 text-[10px] flex items-center justify-center text-gray-600 font-medium">3</span>
            </div>
            <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded border border-blue-100">
              <span className="font-mono text-xs text-blue-700">In Progress</span>
              <span className="h-5 w-5 rounded bg-white border border-blue-200 text-[10px] flex items-center justify-center text-blue-700 font-medium shadow-sm">1</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-50/50 p-2 rounded border border-emerald-100">
              <span className="font-mono text-xs text-emerald-700">Done</span>
              <span className="h-5 w-5 rounded bg-white border border-emerald-200 text-[10px] flex items-center justify-center text-emerald-700 font-medium shadow-sm">12</span>
            </div>
          </motion.div>
        )}

        {state === "graph" && (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative flex h-full w-full items-center justify-center p-5 pt-6"
          >
            <div className="absolute top-5 left-5 font-mono text-sm font-medium text-gray-900">Launch Product</div>
            
            {/* Knowledge graph nodes representing connected notes */}
            <motion.div 
              className="absolute h-10 w-24 rounded border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-mono text-xs shadow-sm"
              animate={isHovered ? { x: -5, y: -5 } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Marketing
            </motion.div>
            
            <motion.div 
              className="absolute h-8 w-20 rounded border border-rose-200 bg-rose-50 flex items-center justify-center text-rose-700 font-mono text-[10px] shadow-sm -translate-x-16 translate-y-16"
              animate={isHovered ? { x: -10, y: 10 } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Assets
            </motion.div>
            
            <motion.div 
              className="absolute h-8 w-20 rounded border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-700 font-mono text-[10px] shadow-sm translate-x-16 translate-y-12"
              animate={isHovered ? { x: 10, y: 10 } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Servers
            </motion.div>
            
            <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: -1 }}>
              <motion.line 
                x1="50%" y1="50%" x2="25%" y2="80%" 
                stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 3" 
                animate={isHovered ? { x2: "20%", y2: "85%" } : { x2: "25%", y2: "80%" }}
              />
              <motion.line 
                x1="50%" y1="50%" x2="75%" y2="70%" 
                stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 3" 
                animate={isHovered ? { x2: "80%", y2: "75%" } : { x2: "75%", y2: "70%" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
