import type { Tool } from "@/data/tools";

/**
 * Case-insensitive tool search over name, description, and target search query.
 * Pure and framework-free; shared by the homepage grid and the command palette.
 */
export function filterTools(tools: Tool[], query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (q === "") return tools;
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.searchQuery.toLowerCase().includes(q) ||
      tool.slug.includes(q),
  );
}
