"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  defaultLoremOptions,
  generateLorem,
  type LoremOptions,
} from "@/lib/tools/lorem-ipsum";

export function LoremIpsumGenerator() {
  const [options, setOptions] = useState<LoremOptions>(defaultLoremOptions);
  const [output, setOutput] = useState("");

  /** Update options and regenerate in the same user action. */
  function update(patch: Partial<LoremOptions>) {
    const next = { ...options, ...patch };
    setOptions(next);
    setOutput(generateLorem(next));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-6">
        <div>
          <label
            htmlFor="lorem-paragraphs"
            className="flex justify-between gap-4 text-sm font-medium text-primary"
          >
            <span>Paragraphs</span>
            <span className="font-mono text-muted">{options.paragraphs}</span>
          </label>
          <input
            id="lorem-paragraphs"
            type="range"
            min={1}
            max={10}
            value={options.paragraphs}
            onChange={(e) => update({ paragraphs: Number(e.target.value) })}
            className="mt-1.5 w-44 accent-[var(--accent)]"
          />
        </div>
        <div>
          <label
            htmlFor="lorem-sentences"
            className="flex justify-between gap-4 text-sm font-medium text-primary"
          >
            <span>Sentences each</span>
            <span className="font-mono text-muted">{options.sentencesPerParagraph}</span>
          </label>
          <input
            id="lorem-sentences"
            type="range"
            min={2}
            max={10}
            value={options.sentencesPerParagraph}
            onChange={(e) => update({ sentencesPerParagraph: Number(e.target.value) })}
            className="mt-1.5 w-44 accent-[var(--accent)]"
          />
        </div>
        <label className="flex items-center gap-2 pb-1 text-sm text-secondary">
          <input
            type="checkbox"
            checked={options.startWithLorem}
            onChange={(e) => update({ startWithLorem: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Start with “Lorem ipsum…”
        </label>
        <label className="flex items-center gap-2 pb-1 text-sm text-secondary">
          <input
            type="checkbox"
            checked={options.html}
            onChange={(e) => update({ html: e.target.checked })}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          HTML &lt;p&gt; tags
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOutput(generateLorem(options))}
          className="btn-primary"
        >
          Generate text
        </button>
        <CopyButton value={output} />
      </div>

      <div>
        <span id="lorem-output-label" className="text-sm font-medium text-primary">
          Placeholder text
        </span>
        <textarea
          readOnly
          aria-labelledby="lorem-output-label"
          aria-live="polite"
          value={output}
          placeholder="Press “Generate text” to create placeholder copy."
          className="mt-2 h-72 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 text-sm leading-relaxed text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
    </div>
  );
}
