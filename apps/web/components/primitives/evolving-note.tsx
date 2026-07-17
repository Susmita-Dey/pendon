"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export type NoteState = "plain" | "formula" | "graph" | "workflow" | "checklist" | "diagram";

interface EvolvingNoteProps {
  state: NoteState;
}

export function EvolvingNote({ state }: EvolvingNoteProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [checkedItems, setCheckedItems] = useState([false, false, false]);

  const toggleCheck = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newChecked = [...checkedItems];
    newChecked[idx] = !newChecked[idx];
    setCheckedItems(newChecked);
  };

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
        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.15)",
        transition: { type: "spring", stiffness: 200, damping: 20 }
      }}
      transition={{ duration: 0.8, ease: "anticipate" }}
      className="relative flex flex-col overflow-hidden rounded-sm bg-[#fdfdfc] shadow-xl shadow-gray-200/50 cursor-pointer transform-gpu"
      style={{
        width: state === "plain" ? 360 : state === "workflow" ? 480 : 420,
        height: state === "plain" ? 130 : state === "graph" ? 360 : state === "workflow" ? 320 : 260,
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
            initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="flex h-full w-full items-center p-8 absolute inset-0"
          >
            <span className="font-mono text-lg text-gray-700 font-medium">Launch Product</span>
          </motion.div>
        )}

        {state === "formula" && (
          <motion.div
            key="formula"
            initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="flex h-full w-full flex-col justify-center gap-4 p-8 pt-10 absolute inset-0"
          >
            <div className="font-mono text-lg font-medium text-gray-900 mb-2">Launch Product</div>
            <div className="flex justify-between font-mono text-base text-gray-500 hover:text-gray-900 transition-colors">
              <span>Marketing</span>
              <span>$4000</span>
            </div>
            <div className="flex justify-between font-mono text-base text-gray-500 hover:text-gray-900 transition-colors">
              <span>Servers</span>
              <span>$1200</span>
            </div>
            <div className="h-px w-full bg-gray-200 my-2" />
            <div className="flex justify-between font-mono text-base font-medium text-gray-900">
              <span>Total Budget</span>
              <span className="text-[#D9A441]">$5200</span>
            </div>
          </motion.div>
        )}

        {state === "checklist" && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="flex h-full w-full flex-col gap-4 p-8 pt-10 absolute inset-0"
          >
            <div className="font-mono text-lg font-medium text-gray-900 mb-4">Launch Product</div>
            <div className="flex items-center gap-4 group cursor-pointer" onClick={(e) => toggleCheck(0, e)}>
              <motion.div 
                animate={{ backgroundColor: checkedItems[0] ? "#D9A441" : "#ffffff", borderColor: checkedItems[0] ? "#D9A441" : "#d1d5db" }}
                className="h-5 w-5 rounded-sm border-2 flex items-center justify-center transition-colors shadow-sm"
              >
                <motion.svg animate={{ opacity: checkedItems[0] ? 1 : 0, scale: checkedItems[0] ? 1 : 0.5 }} className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>
              </motion.div>
              <span className={`font-mono text-base transition-colors ${checkedItems[0] ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-gray-900"}`}>Finalize copy</span>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer" onClick={(e) => toggleCheck(1, e)}>
              <motion.div 
                animate={{ backgroundColor: checkedItems[1] ? "#D9A441" : "#ffffff", borderColor: checkedItems[1] ? "#D9A441" : "#d1d5db" }}
                className="h-5 w-5 rounded-sm border-2 flex items-center justify-center transition-colors shadow-sm"
              >
                <motion.svg animate={{ opacity: checkedItems[1] ? 1 : 0, scale: checkedItems[1] ? 1 : 0.5 }} className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>
              </motion.div>
              <span className={`font-mono text-base transition-colors ${checkedItems[1] ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-gray-900"}`}>Deploy to production</span>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer" onClick={(e) => toggleCheck(2, e)}>
              <motion.div 
                animate={{ backgroundColor: checkedItems[2] ? "#D9A441" : "#ffffff", borderColor: checkedItems[2] ? "#D9A441" : "#d1d5db" }}
                className="h-5 w-5 rounded-sm border-2 flex items-center justify-center transition-colors shadow-sm"
              >
                <motion.svg animate={{ opacity: checkedItems[2] ? 1 : 0, scale: checkedItems[2] ? 1 : 0.5 }} className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></motion.svg>
              </motion.div>
              <span className={`font-mono text-base transition-colors ${checkedItems[2] ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-gray-900"}`}>Send email blast</span>
            </div>
          </motion.div>
        )}

        {state === "workflow" && (
          <motion.div
            key="workflow"
            initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="flex h-full w-full flex-col gap-4 p-8 absolute inset-0"
          >
            <div className="font-mono text-lg font-medium text-gray-900 mb-4">Launch Product</div>
            <motion.div whileHover={{ x: 4, backgroundColor: "#f9fafb" }} className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200 cursor-pointer">
              <span className="font-mono text-sm text-gray-600">To Do</span>
              <span className="h-6 w-6 rounded bg-white border border-gray-200 text-xs flex items-center justify-center text-gray-600 font-medium">3</span>
            </motion.div>
            <motion.div whileHover={{ x: 4, backgroundColor: "#eff6ff" }} className="flex justify-between items-center bg-blue-50/50 p-3 rounded border border-blue-100 cursor-pointer">
              <span className="font-mono text-sm text-blue-700">In Progress</span>
              <span className="h-6 w-6 rounded bg-white border border-blue-200 text-xs flex items-center justify-center text-blue-700 font-medium shadow-sm">1</span>
            </motion.div>
            <motion.div whileHover={{ x: 4, backgroundColor: "#fdf8ef" }} className="flex justify-between items-center bg-[#D9A441]/10 p-3 rounded border border-[#D9A441]/20 cursor-pointer">
              <span className="font-mono text-sm text-[#D9A441]">Done</span>
              <span className="h-6 w-6 rounded bg-white border border-[#D9A441]/30 text-xs flex items-center justify-center text-[#D9A441] font-medium shadow-sm">12</span>
            </motion.div>
          </motion.div>
        )}

        {state === "graph" && (
          <motion.div
            key="graph"
            initial={{ opacity: 0, x: 50, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -50, filter: "blur(4px)" }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            className="relative flex h-full w-full items-center justify-center p-8 pt-10 absolute inset-0"
          >
            {/* Knowledge graph central node */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -mt-6 -ml-16 z-10 h-12 w-32 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-900 font-mono text-sm shadow-md cursor-pointer hover:border-[#D9A441] hover:text-[#D9A441] transition-colors group"
              animate={isHovered ? { x: -2, y: -2, scale: 1.05 } : { x: 0, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Launch Product
              <motion.div className="absolute -inset-2 rounded bg-[#D9A441]/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/2 -mt-5 -ml-14 h-10 w-28 rounded border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-mono text-xs shadow-sm -translate-x-28 -translate-y-20 cursor-pointer hover:bg-indigo-100 hover:scale-110 transition-all z-10"
              animate={isHovered ? { x: -6, y: -6 } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Marketing
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/2 -mt-5 -ml-14 h-10 w-28 rounded border border-rose-200 bg-rose-50 flex items-center justify-center text-rose-700 font-mono text-xs shadow-sm translate-x-32 -translate-y-12 cursor-pointer hover:bg-rose-100 hover:scale-110 transition-all z-10"
              animate={isHovered ? { x: 6, y: -4 } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Design
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/2 -mt-5 -ml-14 h-10 w-28 rounded border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-700 font-mono text-xs shadow-sm -translate-x-8 translate-y-24 cursor-pointer hover:bg-amber-100 hover:scale-110 transition-all z-10"
              animate={isHovered ? { x: 2, y: 8 } : { x: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Servers
            </motion.div>
            
            <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
              {/* Animated pulses along lines */}
              <motion.circle r="3" fill="#D9A441"
                animate={{ cx: ["50%", "25%"], cy: ["50%", "25%"], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
              />
              <motion.circle r="3" fill="#D9A441"
                animate={{ cx: ["50%", "75%"], cy: ["50%", "35%"], opacity: [0, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 1 }}
              />
              <motion.circle r="3" fill="#D9A441"
                animate={{ cx: ["50%", "42%"], cy: ["50%", "80%"], opacity: [0, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.2 }}
              />
              
              <motion.line 
                x1="50%" y1="50%" x2="25%" y2="25%" 
                stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />
              <motion.line 
                x1="50%" y1="50%" x2="75%" y2="35%" 
                stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
              />
              <motion.line 
                x1="50%" y1="50%" x2="42%" y2="80%" 
                stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 4" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.9 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
