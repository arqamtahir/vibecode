"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { decodeJwt, type DecodedJwt, type JwtStatus } from "@/lib/tools/jwt";

const statusLabel: Record<JwtStatus, string> = {
  valid: "Valid (not expired)",
  expired: "Expired",
  "not-yet-valid": "Not yet valid",
  "no-expiry": "No expiry claim",
};

function StatusBadge({ status }: { status: JwtStatus }) {
  const tone =
    status === "valid"
      ? "var(--brand-cyan)"
      : status === "expired" || status === "not-yet-valid"
        ? "var(--brand-purple)"
        : "var(--text-muted)";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
      style={{
        borderColor: tone,
        color: tone,
        background: `color-mix(in srgb, ${tone} 12%, transparent)`,
      }}
    >
      {statusLabel[status]}
    </span>
  );
}

function formatEpoch(seconds?: number): string | null {
  if (typeof seconds !== "number") return null;
  return new Date(seconds * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "long",
  });
}

function Section({ title, json }: { title: string; json: Record<string, unknown> }) {
  const text = JSON.stringify(json, null, 2);
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-primary">{title}</h3>
        <CopyButton value={text} label={`Copy ${title.toLowerCase()}`} />
      </div>
      <pre className="mt-2 max-h-72 overflow-auto rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary">
        <code>{text}</code>
      </pre>
    </div>
  );
}

export function JwtDecoder() {
  const [token, setToken] = useState("");

  const result = useMemo(() => (token.trim() ? decodeJwt(token) : null), [token]);
  const decoded: DecodedJwt | null = result?.ok ? result.value : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <label htmlFor="jwt-input" className="text-sm font-medium text-primary">
          JWT
        </label>
        <textarea
          id="jwt-input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          spellCheck={false}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.signature"
          className="mt-2 h-28 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
        <p className="mt-2 rounded-lg border border-[var(--glass-border)] p-2 text-xs text-secondary">
          <strong className="text-primary">Note:</strong> this tool decodes the header and
          payload only. The <strong>signature is never verified</strong> - verifying it
          requires the signing secret or public key. Decoding happens entirely in your
          browser.
        </p>
      </div>

      <div aria-live="assertive" role="alert">
        {result && !result.ok ? (
          <p className="rounded-xl border border-[var(--brand-purple)] [background:color-mix(in_srgb,var(--brand-purple)_10%,transparent)] p-3 text-sm text-secondary">
            {result.error}
          </p>
        ) : null}
      </div>

      {decoded ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={decoded.status} />
            {formatEpoch(decoded.exp) ? (
              <span className="text-xs text-secondary">
                Expires: <span className="text-primary">{formatEpoch(decoded.exp)}</span>
              </span>
            ) : null}
            {formatEpoch(decoded.iat) ? (
              <span className="text-xs text-secondary">
                Issued: <span className="text-primary">{formatEpoch(decoded.iat)}</span>
              </span>
            ) : null}
            {formatEpoch(decoded.nbf) ? (
              <span className="text-xs text-secondary">
                Not before:{" "}
                <span className="text-primary">{formatEpoch(decoded.nbf)}</span>
              </span>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Header" json={decoded.header} />
            <Section title="Payload" json={decoded.payload} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
