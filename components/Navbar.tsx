"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "services", label: "Services" },
  { id: "demo Projects", label: "demo Projects" },
  { id: "how_it_works", label: "How it Works" },
  { id: "req_a_project", label: "Req. a Project" },
  { id: "telegram", label: "Telegram" },
  { id: "why_trust_me", label: "Why Trust me" },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.id);
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      className={[
        "fixed top-0 left-0 w-full z-50 transition-colors duration-500 px-4 md:px-6 lg:px-12",
        hasScrolled ? "bg-white/20 backdrop-blur" : "bg-transparent",
      ].join(" ")}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto px-2 md:px-4 h-16 md:h-14 mt-12 flex items-center justify-between gap-4">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link href="#" id="hero" className="flex items-center flex-shrink-0">
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl font-florish whitespace-nowrap">
              LOGO
            </h1>
          </Link>
        </motion.div>

        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-florish text-sm xl:text-base">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className={`nav-link relative pb-1 cursor-pointer transition-opacity duration-300
                  ${isActive ? "opacity-100 font-semibold" : "opacity-50 hover:opacity-90"}`}
                aria-label={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0.5 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.08 }}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-current rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <motion.button
          className="lg:hidden p-2 rounded-full border border-gray-300 flex-shrink-0 hover:bg-gray-100 transition-colors flex flex-col justify-center items-center"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((v) => !v)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center
            ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center my-[3px]
            ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center
            ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-drawer"
            role="dialog"
            aria-label="Mobile navigation"
            className="lg:hidden fixed inset-x-0 top-16 bg-white/80 backdrop-blur-lg shadow-2xl border-b border-white/20 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 md:px-6 py-4 space-y-2 font-florish">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => { scrollToId(item.id); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded border-l-2 text-sm md:text-base transition-colors hover:bg-black/5
                    ${activeId === item.id
                      ? "border-l-black text-black font-semibold"
                      : "border-l-transparent text-gray-700 hover:border-l-black"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;