"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ToolCard";
import { categories, type Tool, type ToolCategory } from "@/data/tools";

type Filter = "All" | ToolCategory;

/**
 * Searchable, category-filterable grid of all tools. Client component because of
 * the live filtering; receives the full registry as props from the server.
 */
export function HomeToolGrid({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = filter === "All" || tool.category === filter;
      const matchesQuery =
        q === "" ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.searchQuery.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [tools, query, filter]);

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
              placeholder="Search 22 tools — e.g. JSON, regex, gradient…"
              className="w-full rounded-xl border border-[var(--glass-border)] [background:var(--bg-elevated)] px-4 py-3 text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
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
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-[var(--accent)] text-primary [background:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                      : "border-[var(--glass-border)] text-secondary hover:text-primary"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">
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
                <h3 className="text-lg font-semibold text-primary">{group.category}</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
