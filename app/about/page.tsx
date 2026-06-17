import type { Metadata } from "next";
import Link from "next/link";
import { AgencyCTA } from "@/components/AgencyCTA";
import { tools } from "@/data/tools";
import { siteConfig, absoluteUrl } from "@/lib/site";

const description =
  "Vibecode is a collection of 22 free developer tools that run 100% in your browser - no signup, no uploads, no tracking. Built and maintained by the software agency AlgoCrew.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/about"),
    title: "About Vibecode",
    description,
    images: [siteConfig.ogImage],
  },
  twitter: { card: "summary_large_image", title: "About Vibecode", description, images: [siteConfig.ogImage] },
};

const principles = [
  {
    title: "100% client-side",
    body: "Every tool runs entirely in your browser. Your data is never sent to a server - it can't be, because there isn't one.",
  },
  {
    title: "Private by design",
    body: "No accounts, no uploads, no analytics inside the tools. What you paste stays on your machine.",
  },
  {
    title: "Fast and offline-ready",
    body: "Tools load once and keep working without a connection. No spinners waiting on an API.",
  },
  {
    title: "Free, forever",
    body: "All 22 tools cost nothing to use. They're our way of giving back to the developer community.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-heading" className="px-4 pt-20 pb-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="premium-badge">About Vibecode</p>
          <h1 id="about-heading" className="mt-6 text-4xl font-bold text-primary sm:text-5xl">
            Useful tools,{" "}
            <span className="gradient-text">zero strings attached</span>
          </h1>
          <p className="mt-5 text-lg text-secondary">
            Vibecode is a set of {tools.length} developer utilities - formatters,
            converters, generators, and AI helpers - that run completely in your browser.
            We built them because the web is full of &ldquo;free&rdquo; tools that upload
            your data, gate features behind signups, or bury you in ads. Ours don&apos;t.
          </p>
        </div>
      </section>

      <section aria-labelledby="principles-heading" className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 id="principles-heading" className="text-2xl font-bold text-primary">
            What we stand for
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <li key={p.title} className="glass-card p-5">
                <h3 className="font-semibold text-primary">{p.title}</h3>
                <p className="mt-2 text-sm text-secondary">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="about-team-heading" className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 id="about-team-heading" className="text-2xl font-bold text-primary">Who makes Vibecode?</h2>
          <p className="mt-4 text-secondary">
            Vibecode is built and maintained by{" "}
            <a href="https://algocrew.io" className="text-[var(--accent)] hover:underline">
              AlgoCrew
            </a>
            , a full-stack software agency. If a tool ever saves you time, that&apos;s the
            point - and if you need a team to build something bigger,{" "}
            <Link href="/contact" className="text-[var(--accent)] hover:underline">
              get in touch
            </Link>
            .
          </p>
        </div>
      </section>

      <AgencyCTA />
    </>
  );
}
