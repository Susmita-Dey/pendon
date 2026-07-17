"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Button } from "@repo/ui/button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Docs", href: "#" },
  { name: "Blog", href: "#" },
  { name: "GitHub", href: "#" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("");
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-4 sm:px-6 py-2 transition-all duration-500 rounded-full w-[95%] sm:w-auto sm:min-w-[700px] max-w-4xl ${
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
              className={`relative px-4 py-2 text-sm font-medium transition-colors z-10 ${
                activeSection === link.href.replace("#", "") ? "text-gray-950" : "text-gray-500 hover:text-gray-950"
              }`}
              onClick={() => setActiveSection(link.href.replace("#", ""))}
            >
              {activeSection === link.href.replace("#", "") && link.href.startsWith("#") && (
                <motion.div
                  layoutId="navbar-pill"
                  className="absolute inset-0 rounded-full bg-gray-100/80 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" className="hidden sm:inline-flex h-9 px-4 text-sm font-medium hover:bg-gray-100 rounded-full">
          Sign In
        </Button>
        <Button className="h-9 px-5 rounded-full text-sm font-medium hover:scale-105 active:scale-95 transition-transform">
          Join Waitlist
        </Button>
      </div>
    </motion.header>
  );
}
