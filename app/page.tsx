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
      <section className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
        {/* Subtle ambient glow — behind content, reduced-motion safe */}
        <div
          className="hero-glow pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-4xl">
          {/* Eyebrow */}
          <p className="text-sm font-medium tracking-widest text-[var(--accent)] uppercase">
            By AlgoCrew
          </p>

          {/* Headline */}
          <h1 className="mt-5 text-5xl font-bold leading-[1.08] tracking-tight text-primary sm:text-7xl">
            Developer tools.<br />
            <span className="gradient-text">Private by design.</span>
          </h1>

          {/* Sub */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary sm:text-xl">
            22 utilities — formatters, converters, generators — that run entirely
            in your browser. No signup, no uploads, no telemetry.
          </p>

          {/* Stats row */}
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { value: "22", label: "free tools" },
              { value: "100%", label: "client-side" },
              { value: "$0", label: "forever" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <dt className="text-2xl font-semibold tracking-tight text-primary">{s.value}</dt>
                <dd className="text-sm text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#tools-heading" className="glow-button">
              Browse all tools
            </a>
            <Link
              href="/about"
              className="inline-flex items-center rounded-full border border-[var(--glass-border)] px-6 py-3 text-sm font-medium text-secondary transition-colors hover:border-[var(--accent)] hover:text-primary"
            >
              About Vibecode
            </Link>
          </div>
        </div>
      </section>

      <HomeToolGrid tools={tools} />
      <AgencyCTA />
    </>
  );
}
