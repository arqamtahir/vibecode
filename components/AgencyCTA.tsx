import { agencyUrls } from "@/data/agency";
import { TechMarquee } from "@/components/TechMarquee";

/**
 * The lead-gen band. Appears on every tool page and the homepage, funnelling to
 * AlgoCrew. Uses descriptive link text and external links over HTTPS.
 */
export function AgencyCTA() {
  return (
    <section aria-labelledby="agency-cta-heading" className="px-4 py-16 sm:px-6">
      <div className="panel mx-auto max-w-5xl overflow-hidden p-8 sm:p-12">
        <p className="badge">built by algocrew</p>
        <h2
          id="agency-cta-heading"
          className="mt-5 font-serif text-3xl tracking-tight text-primary sm:text-4xl"
        >
          Need more than a toolbox?{" "}
          <em className="text-[var(--accent)]">AlgoCrew builds the rest.</em>
        </h2>
        <p className="mt-4 max-w-2xl text-secondary">
          Web, mobile, cloud, and AI products — shipped by the studio that
          maintains these tools. If Vibecode saved you time today, imagine what
          a dedicated team does for your roadmap.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href={agencyUrls.contact} className="btn-primary">
            Start a project
          </a>
          <a href={agencyUrls.home} className="btn-secondary">
            See our services
          </a>
        </div>

        <div className="mt-10">
          <TechMarquee />
        </div>
      </div>
    </section>
  );
}
