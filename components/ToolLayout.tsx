import type { ReactNode } from "react";
import Link from "next/link";
import { toolsByCategory, type Tool } from "@/data/tools";
import { AgencyCTA } from "@/components/AgencyCTA";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { siteConfig, absoluteUrl } from "@/lib/site";

interface ToolLayoutProps {
  tool: Tool;
  /** The interactive tool widget. */
  children: ReactNode;
  /** Long-form SEO copy (use <SeoExplainer>). */
  explainer?: ReactNode;
}

/**
 * Shared wrapper for every tool page: breadcrumb, title/description, the widget,
 * SoftwareApplication JSON-LD, the SEO explainer, related tools, and the
 * AlgoCrew CTA.
 */
export function ToolLayout({ tool, children, explainer }: ToolLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.seoDescription,
    url: absoluteUrl(`/tools/${tool.slug}`),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    publisher: { "@type": "Organization", name: "AlgoCrew", url: "https://algocrew.io" },
    inLanguage: "en",
    browserRequirements: "Requires JavaScript.",
    author: { "@type": "Organization", name: siteConfig.name },
  };

  const related = toolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="px-4 pt-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl">
          <ol className="flex items-center gap-2 font-mono text-xs text-muted">
            <li aria-hidden="true">~</li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--accent)]">
              {tool.slug}
            </li>
          </ol>
        </nav>

        <header className="mx-auto mt-6 max-w-5xl">
          <h1 className="font-serif text-4xl tracking-tight text-primary sm:text-5xl">
            {tool.name}
          </h1>
          <p className="mt-4 max-w-2xl text-secondary">{tool.shortDescription}</p>
          <p className="mt-4 font-mono text-xs text-muted">
            {tool.category.toLowerCase()} · client-side · works offline
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-5xl">{children}</div>
      </article>

      {explainer}

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-baseline gap-4">
              <h2
                id="related-heading"
                className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-muted"
              >
                More in {tool.category}
              </h2>
              <div aria-hidden="true" className="h-px w-full bg-[var(--border-hairline)]" />
            </div>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <li key={t.slug} className="h-full">
                  <ToolCard tool={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <AgencyCTA />
    </>
  );
}
