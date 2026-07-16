import { techStack } from "@/data/agency";

/**
 * Decorative, infinitely-scrolling tech-stack strip. The track is duplicated so
 * the CSS translateX(-50%) loop is seamless. Motion is gated behind
 * prefers-reduced-motion in globals.css; with reduced motion it sits static.
 */
export function TechMarquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <ul className="marquee__track py-2">
        {[...techStack, ...techStack].map((tech, i) => (
          <li
            key={`${tech}-${i}`}
            className="whitespace-nowrap rounded-md border border-[var(--border-hairline)] px-3 py-1.5 font-mono text-xs text-secondary"
          >
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}
