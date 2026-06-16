import type { ReactNode } from "react";
import Link from "next/link";
import type { Tool } from "@/data/tools";
import { AgencyCTA } from "@/components/AgencyCTA";
import { JsonLd } from "@/components/JsonLd";
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
 * SoftwareApplication JSON-LD, the SEO explainer, and the AlgoCrew CTA.
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

  return (
    <>
      <JsonLd data={jsonLd} />

      <article className="px-4 pt-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-primary">
                Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="text-secondary">{tool.category}</span>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-secondary">
              {tool.name}
            </li>
          </ol>
        </nav>

        <header className="mx-auto mt-6 max-w-5xl">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">{tool.name}</h1>
          <p className="mt-3 max-w-2xl text-secondary">{tool.shortDescription}</p>
        </header>

        <div className="mx-auto mt-8 max-w-5xl">{children}</div>
      </article>

      {explainer}
      <AgencyCTA />
    </>
  );
}
