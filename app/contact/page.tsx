import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig, absoluteUrl } from "@/lib/site";

const description =
  "Get in touch with the team behind Vibecode. Have feedback on a tool, a bug to report, or a project for AlgoCrew? Send us a message.";

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    title: "Contact Vibecode",
    description,
    images: [siteConfig.ogImage],
  },
  twitter: { card: "summary_large_image", title: "Contact Vibecode", description, images: [siteConfig.ogImage] },
};

export default function ContactPage() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-xl">
        <p className="badge">contact</p>
        <h1 className="mt-6 font-serif text-4xl tracking-tight text-primary sm:text-6xl">
          Say <em className="text-[var(--accent)]">hello.</em>
        </h1>
        <p className="mt-4 max-w-md text-secondary">
          A bug, a feature request, or a project to scope with AlgoCrew — we
          read everything.
        </p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
