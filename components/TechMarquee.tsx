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
            className="whitespace-nowrap rounded-full border border-[var(--glass-border)] px-4 py-1.5 text-sm text-secondary"
          >
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}
