"use client"
// SectionConnector — a subtle visual bridge between any two sections.
// Renders a thin gradient line + optional glow blob.
// Usage: <SectionConnector from="#F5F4F0" to="#FFFFFF" />

interface Props {
  from?: string   // color of section above
  to?:  string   // color of section below
  glow?: boolean // whether to add a radial glow dot at centre
}

export default function SectionConnector({
  from = "#F5F4F0",
  to   = "#FFFFFF",
  glow = true,
}: Props) {
  return (
    <div className="relative w-full pointer-events-none select-none"
      style={{ height: 80, marginTop: -40, marginBottom: -40, zIndex: 10 }}>
      {/* Gradient fade from above section color to below */}
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${from} 0%, ${to} 100%)` }} />
      {/* Centre glow dot */}
      {glow && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
            filter: "blur(20px)",
          }} />
      )}
      {/* Thin horizontal line at midpoint */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(480px, 60vw)", height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.20) 30%, rgba(99,102,241,0.20) 70%, transparent 100%)",
        }} />
    </div>
  )
}
