"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  exportTemplates,
  extractVariables,
  importTemplates,
  renderTemplate,
  type SavedTemplate,
} from "@/lib/tools/prompt-template";

const COOKIE = "vibecode_prompt_templates";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const STORE_EVENT = "vibecode:prompt-templates";
const EMPTY: SavedTemplate[] = [];

// ---- Cookie-backed external store (SSR-safe, no flash, no setState-in-effect) ----
let cachedRaw: string | null = null;
let cachedList: SavedTemplate[] = EMPTY;

function readCookie(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  return m ? m[1] : "";
}

function snapshot(): SavedTemplate[] {
  const raw = readCookie();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedList = raw ? importTemplates(decodeURIComponent(raw)) : EMPTY;
    } catch {
      cachedList = EMPTY;
    }
  }
  return cachedList;
}

function serverSnapshot(): SavedTemplate[] {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  window.addEventListener(STORE_EVENT, onChange);
  return () => window.removeEventListener(STORE_EVENT, onChange);
}

function persist(list: SavedTemplate[]) {
  const value = encodeURIComponent(exportTemplates(list));
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  window.dispatchEvent(new Event(STORE_EVENT));
}

const DEFAULT_TEMPLATE =
  "You are a helpful assistant for {{company}}.\n\nWrite a {{tone}} reply to this customer message:\n{{message}}";

export function PromptTemplateBuilder() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saveName, setSaveName] = useState("");
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  const saved = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const variables = useMemo(() => extractVariables(template), [template]);
  const output = useMemo(() => renderTemplate(template, values), [template, values]);

  function saveCurrent() {
    const name = saveName.trim();
    if (!name) return;
    const entry: SavedTemplate = { name, template, values };
    persist([...saved.filter((t) => t.name !== name), entry]);
    setSaveName("");
  }

  function load(entry: SavedTemplate) {
    setTemplate(entry.template);
    setValues(entry.values ?? {});
  }

  function remove(name: string) {
    persist(saved.filter((t) => t.name !== name));
  }

  function doImport() {
    try {
      const incoming = importTemplates(importText);
      const byName = new Map(saved.map((t) => [t.name, t]));
      for (const t of incoming) byName.set(t.name, t);
      persist([...byName.values()]);
      setImportText("");
      setImportError("");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Could not import that JSON.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor="tpl-input" className="text-sm font-medium text-primary">
            Template - use <code>{"{{variable}}"}</code> placeholders
          </label>
          <textarea
            id="tpl-input"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="mt-2 h-56 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          />

          <div className="mt-4">
            <h2 className="text-sm font-medium text-primary">Variables</h2>
            {variables.length === 0 ? (
              <p className="mt-2 text-sm text-muted">
                No variables yet - add a <code>{"{{placeholder}}"}</code> to the template.
              </p>
            ) : (
              <div className="mt-2 space-y-3">
                {variables.map((name) => (
                  <div key={name}>
                    <label htmlFor={`var-${name}`} className="text-xs text-secondary">
                      {name}
                    </label>
                    <input
                      id={`var-${name}`}
                      value={values[name] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3">
            <span id="tpl-output-label" className="text-sm font-medium text-primary">
              Filled prompt
            </span>
            <CopyButton value={output} label="Copy prompt" />
          </div>
          <textarea
            readOnly
            aria-labelledby="tpl-output-label"
            value={output}
            className="mt-2 h-56 w-full resize-y rounded-xl border border-[var(--glass-border)] [background:var(--bg-page)] p-3 font-mono text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      {/* Persistence */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-4">
          <h2 className="text-sm font-semibold text-primary">Saved templates</h2>
          <div className="mt-3 flex gap-2">
            <label htmlFor="tpl-name" className="sr-only">Template name</label>
            <input
              id="tpl-name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Template name"
              className="flex-1 rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={saveCurrent}
              disabled={!saveName.trim()}
              className="rounded-full border border-[var(--glass-border)] px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-[var(--accent)] disabled:opacity-50"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">Saved in a cookie on this device.</p>

          {saved.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No saved templates yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {saved.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center justify-between gap-2 rounded-lg border border-[var(--glass-border)] px-3 py-2"
                >
                  <span className="truncate text-sm text-primary">{t.name}</span>
                  <span className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => load(t)}
                      className="text-sm text-[var(--accent)] hover:underline"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(t.name)}
                      aria-label={`Delete saved template ${t.name}`}
                      className="text-sm text-secondary hover:text-primary"
                    >
                      Delete
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-primary">Export / import (JSON)</h2>
            <CopyButton value={exportTemplates(saved)} label="Copy export" />
          </div>
          <label htmlFor="tpl-import" className="mt-3 block text-xs text-secondary">
            Paste exported JSON to import
          </label>
          <textarea
            id="tpl-import"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="mt-1 h-24 w-full resize-y rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] p-2 font-mono text-xs text-primary focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            type="button"
            onClick={doImport}
            disabled={!importText.trim()}
            className="mt-2 rounded-full border border-[var(--glass-border)] px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-[var(--accent)] disabled:opacity-50"
          >
            Import
          </button>
          <div aria-live="assertive" role="alert" className="mt-2">
            {importError ? <p className="text-sm text-[var(--brand-purple)]">{importError}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
