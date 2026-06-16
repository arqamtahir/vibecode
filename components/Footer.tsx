import Link from "next/link";
import { Logo } from "@/components/Logo";
import { categories, toolsByCategory } from "@/data/tools";
import { agencyUrls } from "@/data/agency";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--glass-border)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" aria-label="Vibecode home">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-secondary">
              Free, privacy-first developer tools that run entirely in your browser.
              Built and maintained by{" "}
              <a
                href={agencyUrls.home}
                className="text-[var(--accent)] hover:underline"
              >
                AlgoCrew
              </a>
              .
            </p>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {category}
                </h2>
                <ul className="mt-3 space-y-2">
                  {toolsByCategory(category).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-sm text-secondary transition-colors hover:text-primary"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--glass-border)] pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Vibecode. A free toolset by AlgoCrew.</p>
          <div className="flex gap-4">
            <a href={agencyUrls.home} className="transition-colors hover:text-primary">
              algocrew.io
            </a>
            <a
              href={agencyUrls.contact}
              className="transition-colors hover:text-primary"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
