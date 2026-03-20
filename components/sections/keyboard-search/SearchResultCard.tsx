"use client"

import React, { memo, useMemo } from "react"
import { motion }               from "framer-motion"
import * as LucideIcons         from "lucide-react"
import { Clock }                from "lucide-react"
import { Card, CardContent }    from "@/components/ui/card"
import { Badge }                from "@/components/ui/badge"
import { Button }               from "@/components/ui/button"
import { cn }                   from "@/lib/utils"


import { type ProjectData, COMPLEXITY_CONFIG } from "@/app/data/keyboard-search-data"
// ── Props ─────────────────────────────────────────────────────────────────────
interface SearchResultCardProps {
  project:   ProjectData
  index:     number
  isCompact?: boolean  // true = inside monitor (smaller), false = mobile (full)
}

// ── Dynamic lucide icon renderer ─────────────────────────────────────────────
// Memoised so the icon lookup doesn't run on every render
function useDynamicIcon(iconName: string) {
  return useMemo(() => {
    const Icon = (LucideIcons as Record<string, unknown>)[iconName]
    if (typeof Icon !== "function") return null
    return Icon as React.FC<{ size?: number; className?: string }>
  }, [iconName])
}

// ── Inner tech badge ──────────────────────────────────────────────────────────
const TechBadge = memo(function TechBadge({
  tech,
  compact,
}: {
  tech:    ProjectData["techStack"][number]
  compact: boolean
}) {
  const Icon = useDynamicIcon(tech.icon)
  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 font-medium border",
        tech.color,
        tech.bgColor,
        compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"
      )}>
      {Icon && <Icon size={compact ? 8 : 10} />}
      {tech.name}
    </Badge>
  )
})

// ── Card component (memoised) ─────────────────────────────────────────────────
const SearchResultCard = memo(function SearchResultCard({
  project,
  index,
  isCompact = false,
}: SearchResultCardProps) {
  const cfg = COMPLEXITY_CONFIG[project.complexity]

  const handleRequest = () => {
    document.getElementById("req_a_project")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.div
      layoutId={project.id}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: -10, scale: 0.96 }}
      transition={{
        type:      "spring",
        stiffness: 400,
        damping:   30,
        delay:     index * 0.06,
      }}>
      <Card
        className={cn(
          "group overflow-hidden border border-border bg-white hover:shadow-md transition-shadow duration-200",
          isCompact ? "rounded-xl" : "rounded-2xl"
        )}>
        {/* accent strip at top */}
        <div
          className="h-0.5 w-full"
          style={{ background: project.accentColor }}
        />

        <CardContent className={cn(isCompact ? "p-2.5" : "p-4")}>

          {/* ── Row 1: title + complexity badge ── */}
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3
              className={cn(
                "font-semibold text-foreground leading-tight line-clamp-1",
                isCompact ? "text-[11px]" : "text-sm"
              )}>
              {project.title}
            </h3>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 font-medium border",
                cfg.color,
                cfg.bgColor,
                cfg.borderColor,
                isCompact ? "text-[8px] px-1.5 py-0 leading-4" : "text-[10px] px-2 py-0.5"
              )}>
              {cfg.label}
            </Badge>
          </div>

          {/* ── Row 2: category + delivery ── */}
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={cn(
                "text-muted-foreground",
                isCompact ? "text-[9px]" : "text-xs"
              )}>
              {project.category}
            </span>
            <span
              className={cn(
                "flex items-center gap-0.5 text-muted-foreground",
                isCompact ? "text-[9px]" : "text-xs"
              )}>
              <Clock size={isCompact ? 9 : 11} />
              {project.deliveryDays}d delivery
            </span>
          </div>

          {/* ── Description ── */}
          <p
            className={cn(
              "text-muted-foreground line-clamp-2 mb-2",
              isCompact ? "text-[9px] leading-relaxed" : "text-xs leading-relaxed"
            )}>
            {project.description}
          </p>

          {/* ── Tech stack badges ── */}
          <div className={cn("flex flex-wrap gap-1 mb-2.5")}>
            {project.techStack.slice(0, isCompact ? 2 : 4).map(tech => (
              <TechBadge key={tech.name} tech={tech} compact={isCompact} />
            ))}
          </div>

          {/* ── Bottom row: price + CTA ── */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "font-bold tabular-nums",
                isCompact ? "text-sm" : "text-base"
              )}
              style={{ color: project.accentColor }}>
              {project.price}
            </span>
            <Button
              size={isCompact ? "sm" : "sm"}
              onClick={handleRequest}
              className={cn(
                "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shrink-0",
                isCompact
                  ? "text-[9px] h-6 px-2 rounded-lg"
                  : "text-xs h-7 px-3 rounded-xl"
              )}>
              Request this →
            </Button>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  )
})

export default SearchResultCard
