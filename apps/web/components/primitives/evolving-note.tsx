"use client";

import { motion, AnimatePresence } from "framer-motion";

export type NoteState = "plain" | "formula" | "graph" | "workflow" | "checklist" | "diagram";

interface EvolvingNoteProps {
  state: NoteState;
}

export function EvolvingNote({ state }: EvolvingNoteProps) {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative flex flex-col justify-center overflow-hidden rounded-xl border bg-white shadow-sm"
      style={{
        width: state === "plain" ? 240 : state === "diagram" ? 320 : 280,
        minHeight: state === "plain" ? 100 : state === "graph" ? 220 : 160,
        borderColor: state === "plain" ? "#e5e7eb" : "#d1d5db",
      }}
    >
      <AnimatePresence mode="wait">
        {state === "plain" && (
          <motion.div
            key="plain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full items-center p-6"
          >
            <span className="font-mono text-sm text-gray-500">Just a thought...</span>
          </motion.div>
        )}

        {state === "formula" && (
          <motion.div
            key="formula"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full flex-col justify-center gap-2 p-6"
          >
            <div className="flex justify-between font-mono text-sm text-gray-500">
              <span>Income</span>
              <span>$4000</span>
            </div>
            <div className="flex justify-between font-mono text-sm text-gray-500">
              <span>Expenses</span>
              <span>$1200</span>
            </div>
            <div className="h-px w-full bg-gray-200" />
            <div className="flex justify-between font-mono text-sm font-medium text-gray-900">
              <span>Savings</span>
              <span className="text-emerald-600">$2800</span>
            </div>
          </motion.div>
        )}

        {state === "checklist" && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full flex-col justify-center gap-3 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="font-mono text-sm text-gray-400 line-through">Define scope</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded border-2 border-gray-300" />
              <span className="font-mono text-sm text-gray-700">Write proposal</span>
            </div>
          </motion.div>
        )}

        {state === "workflow" && (
          <motion.div
            key="workflow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full flex-col justify-center gap-3 p-6"
          >
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
              <span className="font-mono text-xs text-gray-600">To Do</span>
              <span className="h-4 w-4 rounded-full bg-gray-200 text-[9px] flex items-center justify-center text-gray-600">3</span>
            </div>
            <div className="flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-100">
              <span className="font-mono text-xs text-blue-700">In Progress</span>
              <span className="h-4 w-4 rounded-full bg-blue-200 text-[9px] flex items-center justify-center text-blue-700">1</span>
            </div>
          </motion.div>
        )}

        {state === "graph" && (
          <motion.div
            key="graph"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-full w-full items-center justify-center p-6"
          >
            {/* Fake knowledge graph nodes */}
            <div className="absolute h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-mono text-[10px]">A</div>
            <div className="absolute h-6 w-6 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 font-mono text-[8px] -translate-x-12 translate-y-8">B</div>
            <div className="absolute h-6 w-6 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-mono text-[8px] translate-x-12 translate-y-6">C</div>
            <div className="absolute h-4 w-4 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-mono text-[6px] -translate-y-10 translate-x-6">D</div>
            
            <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: -1 }}>
              <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#e5e7eb" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="80%" y2="75%" stroke="#e5e7eb" strokeWidth="2" />
              <line x1="50%" y1="50%" x2="70%" y2="20%" stroke="#e5e7eb" strokeWidth="2" />
            </svg>
          </motion.div>
        )}

        {state === "diagram" && (
          <motion.div
            key="diagram"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full flex-col items-center justify-center gap-4 p-6"
          >
            <div className="flex gap-4 w-full justify-center">
              <div className="h-10 w-16 bg-gray-50 border border-gray-200 rounded flex items-center justify-center font-mono text-[10px] text-gray-500">Client</div>
              <div className="h-px w-8 bg-gray-300 mt-5" />
              <div className="h-10 w-16 bg-gray-800 border border-gray-900 rounded flex items-center justify-center font-mono text-[10px] text-gray-100 shadow-lg">API</div>
            </div>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex gap-2">
              <div className="h-8 w-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center font-mono text-[9px] text-gray-400">DB</div>
              <div className="h-8 w-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center font-mono text-[9px] text-gray-400">Cache</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
