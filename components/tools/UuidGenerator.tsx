"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { clampCount, generateUuids, MAX_UUIDS } from "@/lib/tools/uuid";

export function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  function regenerate() {
    setUuids(generateUuids(count));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="uuid-count" className="block text-sm font-medium text-primary">
            How many?
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={MAX_UUIDS}
            value={count}
            onChange={(e) => setCount(clampCount(Number(e.target.value)))}
            className="mt-1.5 w-28 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2 text-primary focus:border-[var(--accent)] focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted">1–{MAX_UUIDS} version-4 UUIDs.</p>
        </div>
        <button type="button" onClick={regenerate} className="btn-primary">
          Generate
        </button>
        {uuids.length > 1 ? (
          <CopyButton value={uuids.join("\n")} label={`Copy all ${uuids.length}`} />
        ) : null}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {uuids.length} {uuids.length === 1 ? "UUID" : "UUIDs"} generated
      </p>

      {uuids.length === 0 ? (
        <p className="panel p-8 text-center text-secondary">
          Choose a count and select <span className="text-primary">Generate</span> to
          create version-4 UUIDs.
        </p>
      ) : null}

      <ul className="space-y-2">
        {uuids.map((id, i) => (
          <li
            key={`${id}-${i}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] px-3 py-2"
          >
            <code className="overflow-x-auto font-mono text-sm text-primary">{id}</code>
            <CopyButton value={id} label="Copy" />
          </li>
        ))}
      </ul>
    </div>
  );
}
