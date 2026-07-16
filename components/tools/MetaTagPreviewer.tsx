"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  buildMetaTags,
  defaultMetaInput,
  displayHost,
  truncate,
  type MetaInput,
} from "@/lib/tools/meta-tags";

/** Module-scoped so it can own its error state; remount on src change via key. */
function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center [background:var(--bg-elevated)] text-xs text-muted">
        No image
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary user-supplied OG image URL
    <img
      src={src}
      alt={alt}
      width={524}
      height={274}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover"
    />
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  const cls =
    "mt-1.5 w-full rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none";
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder} className={`${cls} resize-y`} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

export function MetaTagPreviewer() {
  const [input, setInput] = useState<MetaInput>(defaultMetaInput);
  const set = (patch: Partial<MetaInput>) => setInput((s) => ({ ...s, ...patch }));

  const tags = useMemo(() => buildMetaTags(input), [input]);
  const host = displayHost(input.url);
  const title = input.title.trim() || "Your page title";
  const description = input.description.trim() || "Your meta description will appear here.";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <Field id="meta-title" label="Title" value={input.title} onChange={(v) => set({ title: v })} placeholder="My awesome page" />
        <Field id="meta-desc" label="Description" value={input.description} onChange={(v) => set({ description: v })} textarea placeholder="A short, compelling summary…" />
        <Field id="meta-url" label="URL" value={input.url} onChange={(v) => set({ url: v })} placeholder="https://example.com/page" />
        <Field id="meta-image" label="Image URL" value={input.image} onChange={(v) => set({ image: v })} placeholder="https://example.com/og.png" />
        <Field id="meta-site" label="Site name" value={input.siteName} onChange={(v) => set({ siteName: v })} placeholder="Example" />

        <div>
          <label htmlFor="meta-card" className="block text-sm font-medium text-primary">
            Twitter card type
          </label>
          <select
            id="meta-card"
            value={input.twitterCard}
            onChange={(e) => set({ twitterCard: e.target.value as MetaInput["twitterCard"] })}
            className="mt-1.5 w-full rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="summary_large_image">summary_large_image</option>
            <option value="summary">summary</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <span id="meta-tags-label" className="text-sm font-medium text-primary">
              Generated meta tags
            </span>
            <CopyButton value={tags} label="Copy tags" />
          </div>
          <pre
            aria-labelledby="meta-tags-label"
            className="mt-2 max-h-56 overflow-auto rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-xs text-primary"
          >
            <code>{tags}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        {/* Google */}
        <section aria-label="Google search result preview">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Google</h3>
          {/* Facsimile of a real (white) Google result page, so the colors are
              Google's own rather than theme tokens. */}
          <div className="rounded-xl border border-[var(--border-hairline)] [background:#ffffff] p-4">
            <p className="text-xs text-[#202124]">{host}</p>
            <p className="mt-1 text-lg text-[#1a0dab]">{truncate(title, 60)}</p>
            <p className="mt-1 text-sm text-[#4d5156]">{truncate(description, 160)}</p>
          </div>
        </section>

        {/* Twitter / X */}
        <section aria-label="Twitter card preview">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Twitter / X</h3>
          <div className="overflow-hidden rounded-xl border border-[var(--border-hairline)]">
            {input.twitterCard === "summary_large_image" ? (
              <div className="aspect-[1.91/1] w-full">
                <PreviewImage key={`tw-${input.image}`} src={input.image} alt="Twitter card preview" />
              </div>
            ) : null}
            <div className="p-3">
              <p className="text-sm font-semibold text-primary">{truncate(title, 70)}</p>
              <p className="mt-1 text-sm text-secondary">{truncate(description, 120)}</p>
              <p className="mt-1 text-xs text-muted">{host}</p>
            </div>
          </div>
        </section>

        {/* Facebook */}
        <section aria-label="Facebook card preview">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Facebook</h3>
          <div className="overflow-hidden rounded-xl border border-[var(--border-hairline)]">
            <div className="aspect-[1.91/1] w-full">
              <PreviewImage key={`fb-${input.image}`} src={input.image} alt="Facebook card preview" />
            </div>
            <div className="p-3 [background:var(--bg-elevated)]">
              <p className="text-xs uppercase text-muted">{host}</p>
              <p className="mt-1 text-sm font-semibold text-primary">{truncate(title, 70)}</p>
              <p className="mt-1 text-sm text-secondary">{truncate(description, 120)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
