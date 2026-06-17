/** Vibecode wordmark. Decorative glyph + text; used inside a labelled link. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5 text-lg font-bold text-white">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="#6366f1" />
        {/* > prompt chevron */}
        <path
          d="M9 10.5L14 14L9 17.5"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* _ cursor */}
        <path
          d="M15 17.5h5"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="vibe-icon-bg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <span>
        <span className="text-primary transition-colors hover:text-primary">
          Vibe
        </span>
        <span className="gradient-text">code</span>
      </span>
    </span>
  );
}
