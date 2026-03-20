"use client"


import React, { useEffect, useRef, useState, memo } from "react"
import { motion, AnimatePresence }                   from "framer-motion"
import { Search, X, MonitorSmartphone }              from "lucide-react"
import { ScrollArea }                                from "@/components/ui/scroll-area"
import { Button }                                    from "@/components/ui/button"
import { cn }                                        from "@/lib/utils"
import { type ProjectData, TYPEWRITER_HINTS } from "@/app/data/keyboard-search-data"
import SearchResultCard from "./SearchResultCard"

// ── Props ─────────────────────────────────────────────────────────────────────
interface DesktopKeyboardExplorerProps {
  query:       string
  results:     ProjectData[]
  isEmpty:     boolean
  isSearching: boolean
  onClear:     () => void
}

// ── Typewriter hint component ─────────────────────────────────────────────────
// Cycles through TYPEWRITER_HINTS typing character by character
const TypewriterHint = memo(function TypewriterHint() {
  const [displayed, setDisplayed] = useState("")
  const [hintIdx,   setHintIdx]   = useState(0)
  const [phase,     setPhase]     = useState<"typing" | "waiting" | "deleting">("typing")
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const hint = TYPEWRITER_HINTS[hintIdx]

    const schedule = (cb: () => void, ms: number) => {
      frameRef.current = setTimeout(cb, ms)
    }

    if (phase === "typing") {
      if (displayed.length < hint.length) {
        schedule(() => setDisplayed(hint.slice(0, displayed.length + 1)), 55)
      } else {
        schedule(() => setPhase("waiting"), 1800)
      }
    } else if (phase === "waiting") {
      schedule(() => setPhase("deleting"), 400)
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        schedule(() => setDisplayed(d => d.slice(0, -1)), 28)
      } else {
        setHintIdx(i => (i + 1) % TYPEWRITER_HINTS.length)
        setPhase("typing")
      }
    }

    return () => {
      if (frameRef.current) clearTimeout(frameRef.current)
    }
  }, [displayed, phase, hintIdx])

  return (
    <span className="text-muted-foreground/60 text-sm select-none">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-px h-4 bg-indigo-400 ml-px align-middle"
      />
    </span>
  )
})

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = memo(function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1,  y: 0  }}
      exit={{    opacity: 0,  y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
        <MonitorSmartphone size={22} className="text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-1">
          Haven&apos;t built &ldquo;{query}&rdquo; yet — but I can.
        </p>
        <p className="text-xs text-muted-foreground">
          Drop me a message and I&apos;ll build exactly what you need.
        </p>
      </div>
      <Button
        size="sm"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-4 rounded-xl"
        onClick={() =>
          document.getElementById("req_a_project")?.scrollIntoView({ behavior: "smooth" })
        }>
        Request a custom project →
      </Button>
    </motion.div>
  )
})

// ── Monitor frame + screen ────────────────────────────────────────────────────
export default function DesktopKeyboardExplorer({
  query,
  results,
  isEmpty,
  isSearching,
  onClear,
}: DesktopKeyboardExplorerProps) {
  // Visible cards: max 4 in compact monitor grid
  const visibleResults = results.slice(0, 6)

  return (
    <div className="flex flex-col items-center w-full select-none">

      {/* ════════════════════════════════════════════════════════════════
          MONITOR FRAME
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="w-full max-w-4xl"
        style={{ perspective: "1200px" }}>

        {/* Outer bezel */}
        <div
          className={cn(
            "relative w-full rounded-[20px] p-[10px]",
            "bg-gradient-to-b from-[#D1D5DB] to-[#9CA3AF]",
            "shadow-[0_24px_80px_rgba(0,0,0,0.22),0_4px_12px_rgba(0,0,0,0.12)]",
            "ring-1 ring-black/10"
          )}>

          {/* Screen surface */}
          <div className="relative w-full rounded-[12px] overflow-hidden bg-[#FAFAFA]"
            style={{ minHeight: 440 }}>

            {/* ── Chrome bar (traffic lights + title) ── */}
            <div className="flex items-center gap-0 px-3 py-2.5 bg-[#F3F4F6] border-b border-[#E5E7EB]">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 mr-4">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)]" />
              </div>

              {/* Window title */}
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[11px] font-medium text-gray-500 tracking-tight">
                  DevStudio — Project Explorer
                </span>
              </div>

              {/* Spacer to balance traffic lights */}
              <div className="w-[60px]" />
            </div>

            {/* ── Screen content ── */}
            <div className="p-4 flex flex-col gap-3" style={{ minHeight: 390 }}>

              {/* Search bar inside screen */}
              <div className={cn(
                "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl",
                "bg-white border border-[#E5E7EB]",
                "shadow-[0_1px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
                "ring-1 ring-transparent focus-within:ring-indigo-300/60 focus-within:border-indigo-300 transition-all duration-150"
              )}>
                <Search size={15} className="text-muted-foreground/60 shrink-0" />

                {/* Query display or typewriter hint */}
                <div className="flex-1 min-w-0">
                  {query ? (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-foreground">
                        {query}
                      </span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="inline-block w-px h-4 bg-indigo-500 ml-0.5 align-middle"
                      />
                    </div>
                  ) : (
                    <TypewriterHint />
                  )}
                </div>

                {/* Clear button */}
                <AnimatePresence>
                  {query && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1   }}
                      exit={{    opacity: 0, scale: 0.8 }}
                      onClick={onClear}
                      className="shrink-0 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                      <X size={11} className="text-gray-600" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Result count badge */}
                <AnimatePresence>
                  {isSearching && !isEmpty && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1   }}
                      exit={{    opacity: 0, scale: 0.8 }}
                      className="shrink-0 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {results.length} found
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Results / empty state ── */}
              <div className="flex-1 relative" style={{ minHeight: 300 }}>

                <AnimatePresence mode="popLayout">
                  {isEmpty ? (
                    <EmptyState key="empty" query={query} />
                  ) : (
                    <ScrollArea className="h-full" key="results">
                      <div className="grid grid-cols-2 gap-2.5 pr-2">
                        {visibleResults.map((project, idx) => (
                          <SearchResultCard
                            key={project.id}
                            project={project}
                            index={idx}
                            isCompact
                          />
                        ))}
                      </div>

                      {/* Gradient fade at bottom if there are more results */}
                      {results.length > 6 && (
                        <div className="mt-1 text-center">
                          <span className="text-[10px] text-muted-foreground">
                            +{results.length - 6} more — refine your search to narrow results
                          </span>
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </AnimatePresence>

                {/* Subtle gradient fade at bottom when scrollable */}
                {results.length > 4 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none" />
                )}
              </div>

            </div>
          </div>

          {/* Bottom bezel brand dot */}
          <div className="flex justify-center mt-2">
            <div className="w-8 h-1 rounded-full bg-[#9CA3AF]/60" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MONITOR STAND
          ════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col items-center mt-0 pointer-events-none" aria-hidden>
        {/* Stem */}
        <div className="w-16 h-8 bg-gradient-to-b from-[#C4C9D1] to-[#9CA3AF]" />
        {/* Base */}
        <div
          className="h-3 rounded-b-xl bg-gradient-to-b from-[#B0B8C2] to-[#9CA3AF]"
          style={{ width: 180 }}
        />
        {/* Shadow */}
        <div
          className="mt-1 rounded-full bg-black/10"
          style={{ width: 200, height: 6, filter: "blur(4px)" }}
        />
      </div>

    </div>
  )
}
