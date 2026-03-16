// ── ClayAirplane — drop-in SVG component ─────────────────────────────────────
// Usage: <ClayAirplane className="..." style={{...}} />

export default function ClayAirplane({
  className = "",
  style = {},
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 220 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        {/* Clay body gradient — warm orange */}
        <radialGradient id="bodyGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#FF9F5A" />
          <stop offset="55%"  stopColor="#FF6B1A" />
          <stop offset="100%" stopColor="#D94F00" />
        </radialGradient>

        {/* Wing gradient — soft cream */}
        <radialGradient id="wingGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="60%"  stopColor="#E8E8F0" />
          <stop offset="100%" stopColor="#C8C8DC" />
        </radialGradient>

        {/* Cockpit glass gradient */}
        <radialGradient id="glassGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#C5D8FF" />
          <stop offset="100%" stopColor="#7EB0FF" />
        </radialGradient>

        {/* Engine gradient */}
        <radialGradient id="engineGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#4A4A6A" />
          <stop offset="100%" stopColor="#1E1E3A" />
        </radialGradient>

        {/* Drop shadow filter */}
        <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="rgba(0,0,0,0.22)" />
        </filter>

        {/* Highlight blur */}
        <filter id="softHighlight" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>

        {/* Exhaust glow */}
        <radialGradient id="exhaustGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFD580" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#clayShadow)">

        {/* ── Exhaust flame ─────────────────────────────────────────────────── */}
        <ellipse cx="18" cy="50" rx="14" ry="6" fill="url(#exhaustGrad)" opacity="0.85">
          <animate attributeName="rx" values="14;9;14" dur="0.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.85;0.5;0.85" dur="0.4s" repeatCount="indefinite" />
        </ellipse>

        {/* ── Main fuselage body ────────────────────────────────────────────── */}
        {/* Fat clay tube shape — widest at cockpit, tapers to tail */}
        <path
          d="M 30 44
             C 60 32, 100 30, 140 34
             C 170 36, 195 42, 205 46
             C 205 48, 202 52, 198 54
             C 180 56, 155 58, 130 57
             C 95 56, 58 55, 30 56
             Z"
          fill="url(#bodyGrad)"
        />

        {/* Clay body inner highlight */}
        <path
          d="M 55 38 C 90 32, 140 31, 175 38"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          filter="url(#softHighlight)"
        />

        {/* ── Nose cone ────────────────────────────────────────────────────── */}
        <path
          d="M 198 46 C 210 46, 218 48, 218 50 C 218 52, 210 53, 198 54 Z"
          fill="#FF7730"
        />
        {/* Nose tip highlight */}
        <circle cx="214" cy="49" r="1.5" fill="rgba(255,255,255,0.6)" />

        {/* ── Cockpit window ────────────────────────────────────────────────── */}
        <ellipse cx="178" cy="43" rx="14" ry="9" fill="url(#glassGrad)" />
        {/* Glass shine */}
        <ellipse cx="174" cy="40" rx="5" ry="3" fill="rgba(255,255,255,0.5)"
          transform="rotate(-15 174 40)" />

        {/* ── Main wing (bottom) ────────────────────────────────────────────── */}
        <path
          d="M 80 55
             C 90 55, 120 56, 140 57
             L 150 80
             C 130 78, 95 72, 70 68
             Z"
          fill="url(#wingGrad)"
        />
        {/* Wing highlight */}
        <path d="M 85 58 C 105 57, 130 58, 145 60"
          stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* ── Top stabiliser fin ───────────────────────────────────────────── */}
        <path
          d="M 38 44
             C 42 40, 50 32, 55 28
             C 58 26, 62 27, 65 30
             C 62 35, 54 40, 48 44
             Z"
          fill="url(#wingGrad)"
        />
        {/* Fin highlight */}
        <path d="M 44 40 C 50 34, 58 29, 62 28"
          stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* ── Tail horizontal stabilisers ───────────────────────────────────── */}
        <path
          d="M 32 50 C 36 48, 46 47, 52 48 L 58 58 C 48 58, 36 56, 30 55 Z"
          fill="url(#wingGrad)"
        />
        <path
          d="M 32 50 C 36 52, 46 53, 52 52 L 58 42 C 48 42, 36 44, 30 45 Z"
          fill="url(#wingGrad)"
        />

        {/* ── Engine pod ───────────────────────────────────────────────────── */}
        <ellipse cx="100" cy="62" rx="16" ry="8" fill="url(#engineGrad)" />
        {/* Engine intake ring */}
        <ellipse cx="114" cy="62" rx="5" ry="8" fill="#0A0A20" />
        <ellipse cx="114" cy="62" rx="3" ry="6" fill="#1A1A40" />
        {/* Engine highlight */}
        <ellipse cx="98" cy="58" rx="8" ry="3" fill="rgba(255,255,255,0.12)" />

        {/* ── Rivets / detail dots ─────────────────────────────────────────── */}
        {[100, 120, 140, 160].map((x, i) => (
          <circle key={i} cx={x} cy="37" r="1.2" fill="rgba(0,0,0,0.15)" />
        ))}

      </g>
    </svg>
  )
}