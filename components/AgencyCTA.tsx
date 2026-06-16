import { agencyUrls } from "@/data/agency";
import { TechMarquee } from "@/components/TechMarquee";

/**
 * The lead-gen band. Appears on every tool page and the homepage, funnelling to
 * AlgoCrew. Uses descriptive link text and external links over HTTPS.
 */
export function AgencyCTA() {
  return (
    <section aria-labelledby="agency-cta-heading" className="px-4 py-16 sm:px-6">
      <div className="glass-card mx-auto max-w-5xl overflow-hidden p-8 sm:p-12">
        <p className="premium-badge">Built by AlgoCrew</p>
        <h2
          id="agency-cta-heading"
          className="mt-5 text-2xl font-bold text-primary sm:text-3xl"
        >
          Need more than a tool?{" "}
          <span className="gradient-text">Let&apos;s build it together.</span>
        </h2>
        <p className="mt-3 max-w-2xl text-secondary">
          AlgoCrew is a full-stack software agency shipping web, mobile, cloud, and AI
          products. If Vibecode saved you time today, imagine what our team could do for
          your roadmap.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href={agencyUrls.contact} className="glow-button">
            Start a project with AlgoCrew
          </a>
          <a
            href={agencyUrls.home}
            className="inline-flex items-center rounded-full border border-[var(--glass-border)] px-6 py-3 font-medium text-primary transition-colors hover:border-[var(--accent)]"
          >
            Explore our services
          </a>
        </div>

        <div className="mt-10">
          <TechMarquee />
        </div>
      </div>
    </section>
  );
}
