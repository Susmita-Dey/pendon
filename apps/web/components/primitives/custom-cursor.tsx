"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorType = "default" | "pointer" | "text";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [isTouch, setIsTouch] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const computedCursor = window.getComputedStyle(target).cursor;
      
      if (
        computedCursor === "text" || 
        target.tagName === "INPUT" || 
        target.tagName === "TEXTAREA"
      ) {
        setCursorType("text");
      } else if (
        computedCursor === "pointer" ||
        target.closest("a") !== null ||
        target.closest("button") !== null
      ) {
        setCursorType("pointer");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    
    setIsVisible(true);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  return (
    <>
      {/* Trailing Spring (Ring) that follows the native system cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div 
          className="rounded-full border border-[#D9A441]/50 bg-[#D9A441]/10 backdrop-blur-[1px]"
          animate={{
            width: cursorType === "text" ? 24 : cursorType === "pointer" ? 48 : 32,
            height: cursorType === "text" ? 24 : cursorType === "pointer" ? 48 : 32,
            opacity: isVisible ? (cursorType === "pointer" ? 0.8 : cursorType === "text" ? 0.4 : 1) : 0,
            x: "-50%",
            y: "-50%",
          }}
        />
      </motion.div>
    </>
  );
}
