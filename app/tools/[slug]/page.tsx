import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { SeoExplainer } from "@/components/SeoExplainer";
import { getToolBySlug, tools } from "@/data/tools";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Params = { slug: string };

/** Pre-render every tool route at build time (fully static). */
export function generateStaticParams(): Params[] {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const canonical = `/tools/${tool.slug}`;
  return {
    title: { absolute: tool.seoTitle },
    description: tool.seoDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: absoluteUrl(canonical),
      title: tool.seoTitle,
      description: tool.seoDescription,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <ToolLayout
      tool={tool}
      explainer={
        <SeoExplainer heading={`About the ${tool.name}`}>
          <p>{tool.seoDescription}</p>
          <p>
            Like every Vibecode tool, the {tool.name} runs entirely in your browser. Your
            data is never uploaded to a server, so it stays private and works even when
            you&apos;re offline.
          </p>
        </SeoExplainer>
      }
    >
      {/* Placeholder body — the interactive widget ships in a later phase. */}
      <div className="glass-card flex flex-col items-center gap-3 p-12 text-center">
        <span className="premium-badge">Coming soon</span>
        <p className="text-lg font-medium text-primary">
          The {tool.name} widget is on its way.
        </p>
        <p className="max-w-md text-sm text-secondary">
          This tool&apos;s page, metadata, and structured data are live — the interactive
          interface lands in an upcoming release.
        </p>
      </div>
    </ToolLayout>
  );
}
