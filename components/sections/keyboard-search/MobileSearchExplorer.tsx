"use client"

import React, { memo }              from "react"
import { motion, AnimatePresence }   from "framer-motion"
import { Search, X, PackageSearch }  from "lucide-react"
import { Input }                     from "@/components/ui/input"
import { Button }                    from "@/components/ui/button"
import { ScrollArea }                from "@/components/ui/scroll-area"
import { cn }                        from "@/lib/utils"
import {
  type ProjectData,
  SUGGESTION_PILLS,
}                                    from "@/data/keyboard-search-data"
import SearchResultCard              from "./SearchResultCard"

// ── Props ─────────────────────────────────────────────────────────────────────
interface MobileSearchExplorerProps {
  query:         string
  onQueryChange: (q: string) => void
  results:       ProjectData[]
  isEmpty:       boolean
  isSearching:   boolean
}

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = memo(function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1,  y: 0  }}
      exit={{    opacity: 0,  y: -8 }}
      className="flex flex-col items-center justify-center gap-3 py-12 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
        <PackageSearch size={26} className="text-indigo-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground mb-1">
          Haven&apos;t built &ldquo;{query}&rdquo; yet — but I can.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Drop me a message and I&apos;ll build exactly what you need.
        </p>
      </div>
      <Button
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 px-5 rounded-xl"
        onClick={() =>
          document.getElementById("req_a_project")?.scrollIntoView({ behavior: "smooth" })
        }>
        Request a custom project →
      </Button>
    </motion.div>
  )
})

// ── Main component ────────────────────────────────────────────────────────────
export default function MobileSearchExplorer({
  query,
  onQueryChange,
  results,
  isEmpty,
  isSearching,
}: MobileSearchExplorerProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Search input ─────────────────────────────────────────────── */}
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3.5 text-muted-foreground/60 pointer-events-none z-10"
        />
        <Input
          type="text"
          placeholder='Type a project idea... e.g. "attendance system"'
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          className={cn(
            "pl-9 pr-9 h-11 rounded-2xl border-border bg-white",
            "text-sm placeholder:text-muted-foreground/50",
            "focus-visible:ring-indigo-300/60 focus-visible:border-indigo-300",
            "shadow-sm"
          )}
        />
        {/* Clear button */}
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1   }}
              exit={{    opacity: 0, scale: 0.8 }}
              className="absolute right-2.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onQueryChange("")}
                className="h-7 w-7 rounded-full hover:bg-gray-100">
                <X size={13} className="text-gray-500" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestion pills ─────────────────────────────────────────── */}
      <ScrollArea className="w-full" type="scroll">
        <div className="flex gap-2 pb-2">
          {SUGGESTION_PILLS.map((pill, i) => {
            const isActive = query === pill.query
            return (
              <motion.div
                key={pill.query}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => onQueryChange(isActive ? "" : pill.query)}
                  className={cn(
                    "rounded-full whitespace-nowrap h-8 px-3.5 text-xs font-medium shrink-0",
                    isActive
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600"
                      : "bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 text-foreground"
                  )}>
                  {pill.label}
                </Button>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>

      {/* ── Results heading ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {isSearching
            ? `Results for "${query}"`
            : "All Projects"}
        </p>
        {isSearching && !isEmpty && (
          <span className="text-xs text-muted-foreground">
            {results.length} project{results.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Results list ─────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {isEmpty ? (
          <EmptyState key="empty" query={query} />
        ) : (
          <div key="results" className="flex flex-col gap-3">
            {results.map((project, idx) => (
              <SearchResultCard
                key={project.id}
                project={project}
                index={idx}
                isCompact={false}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
