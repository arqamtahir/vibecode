"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { explainRegex, MAX_MATCHES, MAX_TEST_LENGTH, type MatchInfo } from "@/lib/tools/regex-tester";

/** Worker body: compiles + runs the regex with caps, isolated so it can be killed. */
const WORKER_SRC = `
self.onmessage = function (e) {
  var d = e.data, flags = d.flags.indexOf('g') >= 0 ? d.flags : d.flags + 'g', re;
  try { re = new RegExp(d.pattern, flags); }
  catch (err) { self.postMessage({ ok: false, error: (err && err.message) || 'Invalid regular expression.' }); return; }
  var matches = [], truncated = false, m;
  while ((m = re.exec(d.text)) !== null) {
    matches.push({ match: m[0], index: m.index, groups: Array.prototype.slice.call(m, 1), namedGroups: m.groups ? Object.assign({}, m.groups) : {} });
    if (m.index === re.lastIndex) re.lastIndex++;
    if (matches.length >= ${MAX_MATCHES}) { truncated = true; break; }
  }
  self.postMessage({ ok: true, matches: matches, truncated: truncated });
};`;

const FLAG_OPTIONS: { flag: string; label: string }[] = [
  { flag: "g", label: "global (g)" },
  { flag: "i", label: "ignore case (i)" },
  { flag: "m", label: "multiline (m)" },
  { flag: "s", label: "dotall (s)" },
  { flag: "u", label: "unicode (u)" },
];

interface RunState {
  matches: MatchInfo[];
  error: string;
  truncated: boolean;
}

function Highlighted({ text, matches }: { text: string; matches: MatchInfo[] }) {
  if (!text) return <span className="text-muted">Matches will be highlighted here.</span>;
  if (!matches.length) return <span>{text}</span>;

  const parts: React.ReactNode[] = [];
  let last = 0;
  matches.forEach((m, i) => {
    if (m.index > last) parts.push(<span key={`t${i}`}>{text.slice(last, m.index)}</span>);
    const end = m.index + m.match.length;
    if (end > m.index) {
      parts.push(
        <mark
          key={`m${i}`}
          className="rounded [background:color-mix(in_srgb,var(--accent)_30%,transparent)] text-primary"
        >
          {text.slice(m.index, end)}
        </mark>,
      );
    }
    last = Math.max(last, end);
  });
  if (last < text.length) parts.push(<span key="tail">{text.slice(last)}</span>);
  return <>{parts}</>;
}

export function RegexTester() {
  const [pattern, setPattern] = useState("(\\w+)@(\\w+)\\.com");
  const [flags, setFlags] = useState<Set<string>>(new Set(["g", "i"]));
  const [test, setTest] = useState("Contact a@b.com or c@d.com for details.");
  const [workerState, setWorkerState] = useState<RunState>({ matches: [], error: "", truncated: false });

  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flagStr = useMemo(() => [...flags].join(""), [flags]);
  const explanation = useMemo(() => explainRegex(pattern), [pattern]);

  const tooLong = test.length > MAX_TEST_LENGTH;
  const inactive = !pattern || tooLong;

  // Guard results are derived (no setState-in-effect); the effect only runs the worker.
  const state: RunState = !pattern
    ? { matches: [], error: "", truncated: false }
    : tooLong
      ? {
          matches: [],
          error: `Test string is too long (max ${MAX_TEST_LENGTH.toLocaleString()} characters).`,
          truncated: false,
        }
      : workerState;

  function toggleFlag(flag: string) {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  }

  useEffect(() => {
    if (inactive) return; // guard results are derived above - nothing to run

    const handle = setTimeout(() => {
      // Tear down any previous run.
      workerRef.current?.terminate();
      if (timerRef.current) clearTimeout(timerRef.current);

      const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      workerRef.current = worker;

      // Watchdog: kill a pattern that runs too long (catastrophic backtracking).
      timerRef.current = setTimeout(() => {
        worker.terminate();
        workerRef.current = null;
        URL.revokeObjectURL(url);
        setWorkerState({
          matches: [],
          error:
            "Pattern rejected - it took too long to run (possible catastrophic backtracking). Try simplifying it.",
          truncated: false,
        });
      }, 1000);

      worker.onmessage = (ev: MessageEvent) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        worker.terminate();
        workerRef.current = null;
        URL.revokeObjectURL(url);
        const data = ev.data as
          | { ok: true; matches: MatchInfo[]; truncated: boolean }
          | { ok: false; error: string };
        if (data.ok) setWorkerState({ matches: data.matches, error: "", truncated: data.truncated });
        else setWorkerState({ matches: [], error: data.error, truncated: false });
      };

      worker.postMessage({ pattern, flags: flagStr, text: test });
    }, 250);

    return () => clearTimeout(handle);
  }, [pattern, flagStr, test, inactive]);

  // Terminate any live worker on unmount.
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="re-pattern" className="text-sm font-medium text-primary">
            Regular expression
          </label>
          <input
            id="re-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            className="mt-1.5 w-full rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-primary">Flags</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {FLAG_OPTIONS.map((f) => (
              <label key={f.flag} className="flex items-center gap-1.5 text-xs text-secondary">
                <input
                  type="checkbox"
                  checked={flags.has(f.flag)}
                  onChange={() => toggleFlag(f.flag)}
                  className="accent-[var(--accent)]"
                />
                {f.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="re-test" className="text-sm font-medium text-primary">
          Test string
        </label>
        <textarea
          id="re-test"
          value={test}
          onChange={(e) => setTest(e.target.value)}
          spellCheck={false}
          className="mt-1.5 h-32 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
        />
      </div>

      <div aria-live="assertive" role="alert">
        {state.error ? (
          <p className="rounded-xl border border-[var(--brand-purple)] [background:color-mix(in_srgb,var(--brand-purple)_10%,transparent)] p-3 text-sm text-secondary">
            {state.error}
          </p>
        ) : null}
      </div>

      <div>
        <h2 className="text-sm font-medium text-primary">Highlighted matches</h2>
        <p className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-secondary">
          <Highlighted text={test} matches={state.matches} />
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium text-primary" aria-live="polite">
            {state.matches.length} match{state.matches.length === 1 ? "" : "es"}
            {state.truncated ? ` (showing first ${MAX_MATCHES.toLocaleString()})` : ""}
          </h2>
          {state.matches.length > 0 ? (
            <ol className="mt-2 space-y-2">
              {state.matches.slice(0, 200).map((m, i) => (
                <li key={i} className="rounded-lg border border-[var(--glass-border)] p-2 text-sm">
                  <span className="font-mono text-primary">{m.match || "(empty match)"}</span>
                  <span className="text-muted"> at index {m.index}</span>
                  {m.groups.length > 0 ? (
                    <span className="mt-1 block text-xs text-secondary">
                      Groups: {m.groups.map((g, gi) => `${gi + 1}: ${g ?? "-"}`).join(" · ")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-muted">No matches.</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-medium text-primary">Explanation</h2>
          {explanation.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {explanation.map((t, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <code className="shrink-0 rounded [background:var(--bg-elevated)] px-1.5 py-0.5 font-mono text-primary">
                    {t.token}
                  </code>
                  <span className="text-secondary">{t.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Enter a pattern to see its breakdown.</p>
          )}
        </div>
      </div>
    </div>
  );
}
