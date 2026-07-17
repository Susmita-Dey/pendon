"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Button } from "@repo/ui/button";

const navLinks = [
  { name: "Demo", href: "#demo" },
  { name: "GitHub", href: "https://github.com" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 sm:px-6 py-2 transition-all duration-500 rounded-full w-[95%] sm:w-auto sm:min-w-[500px] max-w-2xl ${
        isScrolled 
          ? "bg-white/70 backdrop-blur-xl border border-gray-200/50 shadow-md shadow-gray-200/20" 
          : "bg-transparent border border-transparent"
      }`}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="font-lora text-xl font-medium text-gray-950">
          Pendon
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-950 transition-colors z-10 opacity-60 hover:opacity-100"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Button className="h-9 px-5 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-transform bg-gray-950 text-white hover:bg-gray-900">
          Join Waitlist
        </Button>
      </div>
    </motion.header>
  );
}
