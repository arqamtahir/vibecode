"use client";

import { useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { bytesToBase64, decodeBase64, encodeBase64 } from "@/lib/tools/base64";

type Direction = "encode" | "decode";

export function Base64Tool() {
  const [direction, setDirection] = useState<Direction>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function reset() {
    setInput("");
    setOutput("");
    setError("");
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function switchDirection(next: Direction) {
    setDirection(next);
    reset();
  }

  function run() {
    if (direction === "encode") {
      setOutput(encodeBase64(input));
      setError("");
    } else {
      const result = decodeBase64(input);
      if (result.ok) {
        setOutput(result.output);
        setError("");
      } else {
        setOutput("");
        setError(result.error);
      }
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const bytes = new Uint8Array(reader.result as ArrayBuffer);
      setOutput(bytesToBase64(bytes));
      setError("");
    };
    reader.onerror = () => setError("Could not read that file.");
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-medium text-primary">Direction</legend>
        <div className="mt-2 inline-flex rounded-full border border-[var(--glass-border)] p-1">
          {(["encode", "decode"] as Direction[]).map((d) => (
            <label
              key={d}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
                direction === d ? "[background:var(--gradient-brand)] text-white" : "text-secondary"
              }`}
            >
              <input
                type="radio"
                name="b64-direction"
                value={d}
                checked={direction === d}
                onChange={() => switchDirection(d)}
                className="sr-only"
              />
              {d}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor="b64-input" className="text-sm font-medium text-primary">
            {direction === "encode" ? "Text to encode" : "Base64 to decode"}
          </label>
          <textarea
            id="b64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder={direction === "encode" ? "Hello, world! 👋" : "SGVsbG8sIHdvcmxkIQ=="}
            className="mt-2 h-56 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />

          {direction === "encode" ? (
            <div className="mt-3">
              <label
                htmlFor="b64-file"
                className="text-xs text-secondary"
              >
                …or encode a file
              </label>
              <input
                ref={fileRef}
                id="b64-file"
                type="file"
                onChange={onFile}
                className="mt-1 block w-full text-sm text-secondary file:mr-3 file:rounded-full file:border-0 file:[background:var(--bg-elevated)] file:px-4 file:py-2 file:text-sm file:text-primary hover:file:border-[var(--accent)]"
              />
              {fileName ? (
                <p className="mt-1 text-xs text-muted">Encoded: {fileName}</p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={run} className="glow-button">
              {direction === "encode" ? "Encode" : "Decode"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center rounded-full border border-[var(--glass-border)] px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              Clear
            </button>
          </div>

          <div aria-live="assertive" role="alert" className="mt-3">
            {error ? (
              <p className="rounded-xl border border-[var(--brand-purple)] [background:color-mix(in_srgb,var(--brand-purple)_10%,transparent)] p-3 text-sm text-secondary">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span id="b64-output-label" className="text-sm font-medium text-primary">
              Result
            </span>
            <CopyButton value={output} label="Copy result" />
          </div>
          <textarea
            readOnly
            aria-labelledby="b64-output-label"
            value={output}
            spellCheck={false}
            placeholder={direction === "encode" ? "Base64 output appears here." : "Decoded text appears here."}
            className="mt-2 h-56 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
