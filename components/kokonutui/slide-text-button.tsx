"use client";

import React from "react";

import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SlideTextButtonProps {
  /** The default visible text on the button */
  text: string;
  /** The content that slides in on hover. Accepts text or JSX (e.g. icons). Defaults to `text` if not provided */
  slideText?: React.ReactNode;
  /** If provided, renders as a Next.js <Link>. If omitted, renders as a <button> */
  href?: string;
  className?: string;
  variant?: "default" | "ghost";
  /** Only used when rendered as a <button> (no href) */
  onClick?: () => void;
  disabled?: boolean;
}

export default function SlideTextButton({
  text,
  slideText,
  href,
  className,
  variant = "default",
  onClick,
  disabled,
}: SlideTextButtonProps) {
  const hoverText = slideText ?? text;

  const variantStyles =
    variant === "ghost"
      ? "border border-black/10 text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
      : "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90";

  const sharedClassName = cn(
    "group relative inline-flex h-10 items-center justify-center overflow-hidden cursor-pointer rounded-lg px-8 font-medium text-md tracking-tighter transition-all duration-300 md:min-w-56",
    variantStyles,
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className
  );

  const inner = (
    <span className="relative inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
      {/* Default text */}
      <span className="flex items-center gap-2 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        <span className="font-medium tracking-wider text-center">{text}</span>
      </span>
      {/* Slide-in hover text */}
      <span className="absolute top-full left-0 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="font-medium">{hoverText}</span>
      </span>
    </span>
  );

  return (
    <motion.div
      animate={{ x: 0, opacity: 1, transition: { duration: 0.2 } }}
      className="relative"
      initial={{ x: 200, opacity: 0 }}
    >
      {href ? (
        <Link className={sharedClassName} href={href}>
          {inner}
        </Link>
      ) : (
        <button className={sharedClassName} onClick={onClick} disabled={disabled} type="button">
          {inner}
        </button>
      )}
    </motion.div>
  );
}