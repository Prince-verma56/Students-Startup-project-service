"use client";

/**
 * @author: @dorianbaffier
 * @description: Card Flip
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { ArrowRight, Repeat2, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface CardFlipProps {
  title: string;
  subtitle: string;
  description?: string;
  features?: string[];
  image?: string;
  price?: string;
  accentColor?: string;
  className?: string;
  link?: string;
}

export default function CardFlip({
  title,
  subtitle,
  description,
  features = [],
  image,
  price,
  accentColor = "blue",
  className,
  link = "#",
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const accentStyles: Record<string, { text: string; bg: string; border: string; glow: string; hover: string }> = {
    orange: { 
      text: "text-orange-600", 
      bg: "bg-orange-50", 
      border: "border-orange-100", 
      glow: "shadow-orange-200/50",
      hover: "hover:bg-orange-600" 
    },
    blue: { 
      text: "text-blue-600", 
      bg: "bg-blue-50", 
      border: "border-blue-100", 
      glow: "shadow-blue-200/50",
      hover: "hover:bg-blue-600" 
    },
    violet: { 
      text: "text-violet-600", 
      bg: "bg-violet-50", 
      border: "border-violet-100", 
      glow: "shadow-violet-200/50",
      hover: "hover:bg-violet-600" 
    },
    emerald: { 
      text: "text-emerald-600", 
      bg: "bg-emerald-50", 
      border: "border-emerald-100", 
      glow: "shadow-emerald-200/50",
      hover: "hover:bg-emerald-600" 
    },
    rose: { 
      text: "text-rose-600", 
      bg: "bg-rose-50", 
      border: "border-rose-100", 
      glow: "shadow-rose-200/50",
      hover: "hover:bg-rose-600" 
    },
  };

  const currentStyle = accentStyles[accentColor] || accentStyles.blue;

  return (
    <div
      className={cn(
        "group relative h-[450px] w-full [perspective:2000px] cursor-pointer",
        isFlipped ? "z-30" : "z-10",
        className
      )}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative h-full w-full",
          "[transform-style:preserve-3d]",
          "transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front Side */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden]",
            "rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden",
            "transition-opacity duration-1000 ease-in-out",
            "group-hover:shadow-xl group-hover:border-zinc-300",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          {/* Top Section: Image */}
          <div className="relative h-3/5 w-full overflow-hidden bg-zinc-50">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
                <Sparkles className={cn("h-12 w-12 opacity-20", currentStyle.text)} />
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Price Badge */}
            {price && (
              <div className={cn(
                "absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-xl border",
                "bg-white/90 border-white/20",
                currentStyle.text
              )}>
                {price}
              </div>
            )}
          </div>

          {/* Bottom Section: Content */}
          <div className="p-6 flex flex-col justify-between h-2/5">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-neulis text-zinc-900 tracking-tight">
                {title}
              </h3>
              <p className="text-sm font-medium font-robert text-zinc-500">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Tap to Flip
              </span>
              <div className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                "bg-zinc-50 text-zinc-400 group-hover:rotate-12",
                "group-hover:bg-zinc-100 group-hover:text-zinc-900"
              )}>
                <Repeat2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "rounded-3xl border border-zinc-200 bg-white p-8",
            "flex flex-col shadow-xl",
            "transition-opacity duration-1000 ease-in-out",
            isFlipped ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold font-neulis text-zinc-900 tracking-tight">
                  {title}
                </h3>
                <Sparkles className={cn("h-5 w-5", currentStyle.text)} />
              </div>
              <p className="text-sm font-medium font-robert text-zinc-600 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                What&apos;s Included
              </p>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm font-medium font-robert text-zinc-700"
                    style={{
                      transform: isFlipped ? "translateX(0)" : "translateX(-10px)",
                      opacity: isFlipped ? 1 : 0,
                      transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 100 + 200}ms`,
                    }}
                  >
                    <div className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", currentStyle.text.replace("text", "bg"))} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-zinc-100">
            <Link
              href={link}
              className={cn(
                "group/btn relative flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300",
                "bg-zinc-900 text-white shadow-lg",
                "hover:scale-[1.02] active:scale-[0.98]",
                currentStyle.hover
              )}
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
