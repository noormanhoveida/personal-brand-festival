/**
 * "نور" — the platform's mascot: a simple geometric figure with a
 * glowing, star-topped head (representing a clear, shining personal
 * identity) and an open, welcoming posture. Deliberately abstract
 * rather than a literal human illustration, and built with CSS
 * variables so it reads correctly in both dark themes. Used in two
 * places: the landing page hero, and every participant's published
 * public page — so the same friendly character becomes a consistent,
 * recognizable visual signature of the platform.
 */
export function BrandMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="نماد فستیوال برند شخصی"
    >
      <defs>
        <radialGradient id="mascot-glow" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind the head */}
      <circle cx="120" cy="85" r="70" fill="url(#mascot-glow)" />

      {/* Body: a soft gem/teardrop torso */}
      <path
        d="M120 105 C155 105 178 135 178 168 C178 200 152 218 120 218 C88 218 62 200 62 168 C62 135 85 105 120 105 Z"
        fill="var(--surface)"
        stroke="var(--accent)"
        strokeWidth="2.5"
      />

      {/* Arms — open, welcoming gesture */}
      <path
        d="M66 160 C48 150 34 155 26 172"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M174 160 C192 150 206 155 214 172"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Head */}
      <circle cx="120" cy="82" r="38" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2.5" />

      {/* Face: two calm dots, a simple smile */}
      <circle cx="107" cy="80" r="3.5" fill="var(--accent)" />
      <circle cx="133" cy="80" r="3.5" fill="var(--accent)" />
      <path d="M108 94 Q120 103 132 94" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />

      {/* Star above the head — the "identity light" */}
      <path
        d="M120 18 L125 32 L140 32 L128 41 L133 55 L120 46 L107 55 L112 41 L100 32 L115 32 Z"
        fill="var(--accent)"
      />

      {/* Small ascending steps beneath — growth/journey motif */}
      <rect x="60" y="222" width="24" height="6" rx="3" fill="var(--surface)" />
      <rect x="92" y="228" width="28" height="6" rx="3" fill="var(--surface)" />
      <rect x="128" y="222" width="28" height="6" rx="3" fill="var(--surface)" />
      <rect x="164" y="228" width="24" height="6" rx="3" fill="var(--surface)" />
    </svg>
  );
}
