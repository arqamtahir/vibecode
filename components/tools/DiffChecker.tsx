"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { diffLines, diffStats, toUnified } from "@/lib/tools/diff";

export function DiffChecker() {
  const [original, setOriginal] = useState("");
  const [revised, setRevised] = useState("");

  const hasInput = original !== "" || revised !== "";
  const ops = useMemo(
    () => (hasInput ? diffLines(original, revised) : []),
    [original, revised, hasInput],
  );
  const stats = useMemo(() => diffStats(ops), [ops]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="diff-original" className="text-sm font-medium text-primary">
            Original text
          </label>
          <textarea
            id="diff-original"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            spellCheck={false}
            placeholder="Paste the first version…"
            className="mt-2 h-56 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="diff-revised" className="text-sm font-medium text-primary">
            Changed text
          </label>
          <textarea
            id="diff-revised"
            value={revised}
            onChange={(e) => setRevised(e.target.value)}
            spellCheck={false}
            placeholder="Paste the second version…"
            className="mt-2 h-56 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      {hasInput ? (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="font-mono text-xs text-muted">
              <span className="text-[var(--diff-add,inherit)]">+{stats.added}</span> added ·{" "}
              -{stats.removed} removed · {stats.unchanged} unchanged
            </p>
            <CopyButton value={toUnified(ops)} label="Copy diff" />
          </div>
          <div
            aria-label="Line-by-line diff"
            className="mt-2 max-h-[28rem] overflow-auto rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)]"
          >
            <table className="w-full border-collapse font-mono text-xs">
              <tbody>
                {ops.map((op, i) => (
                  <tr
                    key={i}
                    className={
                      op.type === "add"
                        ? "[background:color-mix(in_srgb,#16a34a_12%,transparent)]"
                        : op.type === "del"
                          ? "[background:color-mix(in_srgb,var(--danger)_10%,transparent)]"
                          : undefined
                    }
                  >
                    <td className="w-10 select-none border-r border-[var(--border-hairline)] px-2 py-0.5 text-right text-muted">
                      {op.aLine ?? ""}
                    </td>
                    <td className="w-10 select-none border-r border-[var(--border-hairline)] px-2 py-0.5 text-right text-muted">
                      {op.bLine ?? ""}
                    </td>
                    <td className="w-6 select-none px-2 py-0.5 text-center text-secondary">
                      {op.type === "add" ? "+" : op.type === "del" ? "-" : ""}
                    </td>
                    <td className="whitespace-pre-wrap px-2 py-0.5 text-primary">
                      {op.text || " "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">
          Paste two versions of a text to see a line-by-line comparison. Everything
          stays in your browser.
        </p>
      )}
    </div>
  );
}
