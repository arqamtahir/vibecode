import type { ReactNode } from "react";

/**
 * Long-form, crawlable copy block beneath a tool. This is where the page earns
 * its keyword relevance - pass a heading and rich explanatory content. Rendered
 * as a semantic <section> with a proper heading for correct document outline.
 */
export function SeoExplainer({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby="seo-explainer-heading"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6"
    >
      <h2 id="seo-explainer-heading" className="text-xl font-bold text-primary">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 text-secondary [&_a]:text-[var(--accent)] [&_a:hover]:underline">
        {children}
      </div>
    </section>
  );
}
