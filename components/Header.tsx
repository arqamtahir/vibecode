import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { agencyUrls } from "@/data/agency";

const navLinks = [
  { href: "/", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--glass-border)] [background:color-mix(in_srgb,var(--bg-page)_82%,transparent)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Vibecode home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={agencyUrls.contact}
            className="hidden rounded-lg px-3 py-2 text-sm text-secondary transition-colors hover:text-primary sm:inline-block"
          >
            Hire AlgoCrew
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
