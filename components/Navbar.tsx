
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
  { id: "telegram", label: "Telegram " },
  { id: "why_trust_me", label: "Why Trust me" },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // Optional: track scroll to adjust style (transparent by default)
  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // FIX 2 — Active section tracking via IntersectionObserver
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

  // Smooth in-page navigation
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 72; // offset for fixed header
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // FIX 3 — Desktop NavLink with Framer Motion hover + active underline
  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = activeId === item.id;
    return (
      <motion.button
        onClick={() => { scrollToId(item.id); setIsOpen(false); }}
        className={`nav-link relative pb-1 transition-colors duration-200 cursor-pointer
          ${isActive ? 'opacity-100 font-semibold' : 'opacity-60 hover:opacity-100'}`}
        aria-label={item.label}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {item.label}
        {isActive && (
          <motion.span
            layoutId="nav-active-pill"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-current rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <header
      className={[
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 md:px-6 lg:px-12 ",
        hasScrolled ? "bg-white/20 backdrop-blur" : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto px-2 md:px-4 h-16 md:h-14 mt-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="#" id="hero" className="flex items-center flex-shrink-0">
          <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl font-florishabold whitespace-nowrap">LOGO</h1>
          {/* <img src="/images/xora.svg" alt="logo" width={120} height={40} /> */}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-florishabold text-sm xl:text-base">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id} item={item} />
          ))}
        </nav>

        {/* FIX 1 — Mobile Menu Button: 3-span animated hamburger → ✕ */}
        <button
          className="lg:hidden p-2 rounded-full border border-gray-300 flex-shrink-0 hover:bg-gray-100 transition-colors flex flex-col justify-center items-center"
          aria-label="Open menu"
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center
            ${isOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center my-[3px]
            ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out origin-center
            ${isOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* FIX 4 — Mobile Drawer: stagger animation with AnimatePresence */}
      <div
        className={[
          "lg:hidden fixed inset-x-0 top-16 bg-white/80 backdrop-blur-lg",
          "transition-all transform origin-top duration-300",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none",
          "shadow-2xl border-b border-white/20",
        ].join(" ")}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="px-4 md:px-6 py-4 space-y-2 font-florishabold">
          <AnimatePresence>
            {isOpen && NAV_ITEMS.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  scrollToId(item.id);
                  setIsOpen(false);
                }}
                className={`nav-item-mobile w-full text-left px-4 py-3 rounded hover:bg-black/5 border-l-2 hover:border-l-primary hover:text-primary text-sm md:text-base transition-all
                  ${activeId === item.id ? 'border-l-black text-black font-semibold' : 'border-l-transparent'}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {item.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;