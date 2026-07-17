"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@repo/ui/button";

const navLinks = [
  { name: "Demo", href: "#demo" },
  { name: "GitHub", href: "https://github.com/Susmita-Dey/pendon" },
];

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
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
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block cursor-pointer"
    >
      {children}
    </motion.div>
  );
}

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 sm:px-8 py-3 transition-all duration-500 rounded-full w-[95%] sm:w-auto sm:min-w-[550px] max-w-3xl ${
        isScrolled 
          ? "bg-white/75 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/20" 
          : "bg-transparent border border-transparent"
      }`}
    >
      <div className="flex items-center gap-10">
        <Link href="/" className="font-lora text-2xl font-semibold text-gray-950 tracking-tight flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#D9A441] mr-2"></div>
          Pendon
        </Link>
        <nav className="hidden md:flex items-center gap-1" onMouseLeave={() => setHoveredLink(null)}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              className="relative px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors z-10"
            >
              {hoveredLink === link.name && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-gray-100/80 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <MagneticButton>
          <Button className="h-10 px-6 rounded-full text-sm font-medium transition-colors bg-gray-950 text-white hover:bg-[#D9A441] shadow-sm hover:shadow-md hover:shadow-[#D9A441]/20 group">
            Join Waitlist
            <motion.span 
              className="inline-block ml-1"
              animate={{ x: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Button>
        </MagneticButton>
      </div>
    </motion.header>
  );
}
