/** Vibecode wordmark. Decorative glyph + text; used inside a labelled link. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-bold text-primary">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#vibe-logo)" />
        <path
          d="M8 9.5 10.5 12 8 14.5M13 15h3"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="vibe-logo" x1="2" y1="2" x2="22" y2="22">
            <stop stopColor="#06c8e8" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <span>
        Vibe<span className="gradient-text">code</span>
      </span>
    </span>
  );
}
