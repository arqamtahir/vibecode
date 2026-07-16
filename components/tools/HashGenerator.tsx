"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { hashAll, HASH_ALGORITHMS, type HashAlgorithm } from "@/lib/tools/hash";

type Hashes = Partial<Record<HashAlgorithm, string>>;

export function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Hashes>({});
  // Guards against out-of-order async results while typing quickly.
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    if (input === "") return;
    hashAll(input).then((result) => {
      if (requestId.current === id) setHashes(result);
    });
  }, [input]);

  const showResults = input !== "";

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="hash-input" className="text-sm font-medium text-primary">
          Text to hash
        </label>
        <textarea
          id="hash-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="Type or paste any text…"
          className="mt-2 h-40 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div aria-live="polite">
        {showResults ? (
          <ul className="space-y-3">
            {HASH_ALGORITHMS.map((algo) => (
              <li key={algo} className="panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    {algo}
                    {algo === "MD5" || algo === "SHA-1" ? (
                      <span className="ml-2 normal-case text-muted">
                        (legacy - not for security)
                      </span>
                    ) : null}
                  </h3>
                  <CopyButton value={hashes[algo] ?? ""} />
                </div>
                <p className="mt-2 break-all font-mono text-sm text-primary">
                  {hashes[algo] ?? "…"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">
            Digests (MD5, SHA-1, SHA-256, SHA-384, SHA-512) appear here as you type.
            Everything is computed locally with the Web Crypto API.
          </p>
        )}
      </div>
    </div>
  );
}
