/**
 * Renders a JSON-LD structured-data script. Server component - emitted into the
 * static HTML for crawlers. `data` is serialized as-is, so only pass trusted,
 * app-controlled objects (never user input).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is build-time/app-controlled, never user-supplied.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
