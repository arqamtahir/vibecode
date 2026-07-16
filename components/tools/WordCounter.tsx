"use client";

import { useMemo, useState } from "react";
import { analyzeText, formatMinutes } from "@/lib/tools/word-counter";

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => analyzeText(text), [text]);

  const cards = [
    { label: "words", value: stats.words.toLocaleString() },
    { label: "characters", value: stats.characters.toLocaleString() },
    { label: "chars (no spaces)", value: stats.charactersNoSpaces.toLocaleString() },
    { label: "sentences", value: stats.sentences.toLocaleString() },
    { label: "paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "reading time", value: formatMinutes(stats.readingMinutes) },
    { label: "speaking time", value: formatMinutes(stats.speakingMinutes) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="wc-input" className="text-sm font-medium text-primary">
          Your text
        </label>
        <textarea
          id="wc-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here…"
          className="mt-2 h-64 w-full resize-y rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-3 text-sm text-primary placeholder:text-muted focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <dl
        aria-live="polite"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {cards.map((c) => (
          <div key={c.label} className="panel p-4">
            <dt className="font-mono text-xs text-muted">{c.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tracking-tight text-primary">
              {c.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-xs text-muted">
        Reading time assumes ~225 words per minute; speaking time ~140. Counts
        update as you type and never leave your browser.
      </p>
    </div>
  );
}
