"use client"

import { useMemo } from "react"
import { type ProjectData } from "@/app/data/keyboard-search-data"

// ── Complexity sort order ─────────────────────────────────────────────────────
const COMPLEXITY_ORDER: Record<ProjectData["complexity"], number> = {
  basic:     0,
  frontend:  1,
  fullstack: 2,
  complete:  3,
}

// ── Return type ───────────────────────────────────────────────────────────────
interface UseKeyboardSearchReturn {
  results:     ProjectData[]
  isEmpty:     boolean
  isSearching: boolean
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// query below 2 chars → return all projects sorted by complexity
// query 2+ chars → search all three keyword layers + title + description
// sorted by relevance: title match > tech match > intent match
export function useKeyboardSearch(
  projects: ProjectData[],
  query:    string
): UseKeyboardSearchReturn {
  const results = useMemo(() => {
    const q = query.toLowerCase().trim()

    // ── No meaningful query: return all sorted by complexity ─────────────
    if (q.length < 2) {
      return [...projects].sort(
        (a, b) => COMPLEXITY_ORDER[a.complexity] - COMPLEXITY_ORDER[b.complexity]
      )
    }

    // ── Score each project across all keyword layers ──────────────────────
    const scored = projects.map(project => {
      const titleMatch    = project.title.toLowerCase().includes(q)
      const categoryMatch = project.category.toLowerCase().includes(q)
      const descMatch     = project.description.toLowerCase().includes(q)
      const techMatch     = project.techKeywords.some(kw    => kw.includes(q) || q.includes(kw))
      const featureMatch  = project.featureKeywords.some(kw => kw.includes(q) || q.includes(kw))
      const intentMatch   = project.intentKeywords.some(kw  => kw.includes(q) || q.includes(kw))
      const priceMatch    = q.includes("1000") || q.includes("₹") || q.includes("cheap") || q.includes("budget")
        ? parseInt(project.price.replace(/[^0-9]/g, "")) <= 1000
        : false
      const speedMatch    = (q.includes("quick") || q.includes("fast") || q.includes("2 day"))
        ? parseInt(project.deliveryDays) <= 2
        : false

      // Relevance score — higher = better match
      let score = 0
      if (titleMatch)    score += 10
      if (categoryMatch) score += 6
      if (techMatch)     score += 5
      if (featureMatch)  score += 4
      if (intentMatch)   score += 3
      if (descMatch)     score += 2
      if (priceMatch)    score += 3
      if (speedMatch)    score += 3

      return { project, score }
    })

    // ── Filter to only matching (score > 0) then sort by score desc ───────
    return scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        // Tie-break: sort by complexity order
        return COMPLEXITY_ORDER[a.project.complexity] - COMPLEXITY_ORDER[b.project.complexity]
      })
      .map(({ project }) => project)
  }, [projects, query])

  const isSearching = query.trim().length >= 2
  const isEmpty     = isSearching && results.length === 0

  return { results, isEmpty, isSearching }
}
