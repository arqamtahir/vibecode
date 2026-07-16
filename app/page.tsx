import Link from "next/link";
import { HomeToolGrid } from "@/components/HomeToolGrid";
import { AgencyCTA } from "@/components/AgencyCTA";
import { JsonLd } from "@/components/JsonLd";
import { tools } from "@/data/tools";
import { siteConfig } from "@/lib/site";

const principles = [
  {
    title: "Client-side only",
    body: "Every tool runs in your browser. It can't leak what it never sends.",
  },
  {
    title: "Offline after load",
    body: "Tools keep working when the network doesn't. No round trips, no spinners.",
  },
  {
    title: "No accounts",
    body: "Paste, convert, copy, leave. Nothing to sign up for, nothing to cancel.",
  },
];

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
      <section className="px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs tracking-[0.08em] text-[var(--accent)]">
            a studio toolbox by algocrew
          </p>

          <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-primary sm:text-7xl">
            <em>Quiet</em> tools for serious developers.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary sm:text-xl">
            {tools.length} formatters, converters, and generators that run
            entirely in your browser. Nothing uploads. Nothing tracks. Nothing
            costs.
          </p>

          <p className="mt-8 font-mono text-sm text-muted">
            {tools.length} tools · 0 servers · $0 forever
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#tools-heading" className="btn-primary">
              Browse the tools
            </a>
            <span className="hidden font-mono text-sm text-muted md:inline">
              or press{" "}
              <kbd className="rounded border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-1.5 py-0.5 text-xs text-secondary">
                ⌘K
              </kbd>
            </span>
            <Link
              href="/about"
              className="font-medium text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline md:hidden"
            >
              About Vibecode
            </Link>
          </div>
        </div>
      </section>

      <HomeToolGrid tools={tools} />

      {/* Principles */}
      <section aria-labelledby="principles-heading" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl border-t border-[var(--border-hairline)] pt-12">
          <h2 id="principles-heading" className="sr-only">
            How Vibecode works
          </h2>
          <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {principles.map((p, i) => (
              <div key={p.title}>
                <dt className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-mono text-xs text-[var(--accent)]">
                    0{i + 1}
                  </span>
                  <span className="font-serif text-xl text-primary">{p.title}</span>
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-secondary">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <AgencyCTA />
    </>
  );
}
