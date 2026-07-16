"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { categories, type Tool, type ToolCategory } from "@/data/tools";
import { filterTools } from "@/lib/tools-search";

type Filter = "All" | ToolCategory;

/**
 * Searchable, category-filterable grid of all tools. Client component because of
 * the live filtering; receives the full registry as props from the server.
 */
export function HomeToolGrid({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () =>
      filterTools(tools, query).filter(
        (tool) => filter === "All" || tool.category === filter,
      ),
    [tools, query, filter],
  );

  const groups = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: filtered.filter((t) => t.category === category),
        }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  const filters: Filter[] = ["All", ...categories];

  return (
    <section aria-labelledby="tools-heading" className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 id="tools-heading" className="sr-only">
          Browse all tools
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="tool-search" className="sr-only">
              Search tools
            </label>
            <input
              id="tool-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`search ${tools.length} tools — json, regex, gradient…`}
              className="w-full rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-4 py-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--border-strong)] focus:outline-none"
            />
          </div>

          <div role="group" aria-label="Filter tools by category" className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
                    active
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border-hairline)] text-secondary hover:text-primary"
                  }`}
                >
                  {f.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        <p role="status" aria-live="polite" className="mt-4 font-mono text-xs text-muted">
          {filtered.length} {filtered.length === 1 ? "tool" : "tools"} shown
        </p>

        {groups.length === 0 ? (
          <p className="mt-10 text-center text-secondary">
            No tools match “{query}”. Try a different search.
          </p>
        ) : (
          <div className="mt-6 space-y-12">
            {groups.map((group) => (
              <div key={group.category}>
                <div className="flex items-baseline gap-4">
                  <h3 className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    {group.category}
                  </h3>
                  <div aria-hidden="true" className="h-px w-full bg-[var(--border-hairline)]" />
                </div>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((tool) => (
                    <li key={tool.slug} className="h-full">
                      <ToolCard tool={tool} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
