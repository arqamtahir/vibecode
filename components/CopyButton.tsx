"use client";

import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  /** The text to copy to the clipboard. */
  value: string;
  /** Visible label (default "Copy"). */
  label?: string;
  className?: string;
}

/**
 * Accessible copy-to-clipboard button. Announces success/failure via an
 * aria-live region so screen-reader users get confirmation.
 */
export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  const message =
    status === "copied" ? "Copied to clipboard" : status === "error" ? "Copy failed" : "";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        disabled={!value}
        className={
          className ??
          "inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-sm text-secondary transition-colors hover:text-primary hover:border-[var(--accent)] disabled:opacity-50"
        }
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {status === "copied" ? (
            <path
              d="m5 13 4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <>
              <rect
                x="9"
                y="9"
                width="11"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M5 15V5a2 2 0 0 1 2-2h8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
        {status === "copied" ? "Copied" : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
    </>
  );
}
