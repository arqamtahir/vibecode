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
        <div className="text-center">
          <p className="premium-badge mx-auto w-fit">Contact</p>
          <h1 className="mt-6 text-4xl font-bold text-primary sm:text-5xl">
            Let&apos;s <span className="gradient-text">talk</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-secondary">
            Feedback on a tool, a bug, or a project to scope with AlgoCrew? We read every
            message.
          </p>
        </div>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
