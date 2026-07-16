import Link from "next/link";
import type { Tool } from "@/data/tools";

/** Card linking to a tool page. Used in the homepage grid and related lists. */
export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="panel group flex h-full flex-col p-5 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
    >
      <span className="font-mono text-xs text-muted">/tools/{tool.slug}</span>
      <h3 className="mt-2 text-base font-semibold text-primary group-hover:text-[var(--accent)]">
        {tool.name}
      </h3>
      <p className="mt-2 text-sm text-secondary">{tool.shortDescription}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
        Open tool
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
