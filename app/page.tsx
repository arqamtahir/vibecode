import Link from "next/link";
import { HomeToolGrid } from "@/components/HomeToolGrid";
import { AgencyCTA } from "@/components/AgencyCTA";
import { JsonLd } from "@/components/JsonLd";
import { tools } from "@/data/tools";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@type": "Organization", name: "AlgoCrew", url: "https://algocrew.io" },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-12 sm:px-6">
        <div
          className="animated-grid pointer-events-none absolute inset-0 -z-10 opacity-40"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="premium-badge mx-auto w-fit">22 tools · 100% client-side · $0</p>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-primary sm:text-6xl">
            Developer tools that{" "}
            <span className="gradient-text">never leave your browser</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-secondary">
            Format, convert, generate, and debug - instantly and privately. No signup, no
            uploads, no tracking. Everything runs locally and works offline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#tools-heading" className="glow-button">
              Browse all tools
            </a>
            <Link
              href="/about"
              className="inline-flex items-center rounded-full border border-[var(--glass-border)] px-6 py-3 font-medium text-primary transition-colors hover:border-[var(--accent)]"
            >
              Why Vibecode?
            </Link>
          </div>
        </div>
      </section>

      <HomeToolGrid tools={tools} />
      <AgencyCTA />
    </>
  );
}
