"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import type { Tool } from "@/data/tools";
import { filterTools } from "@/lib/tools-search";

/**
 * ⌘K tool search. Renders its own trigger button plus a native <dialog>
 * (showModal gives us focus trapping, Escape handling, and top-layer stacking
 * for free), so the Header can stay a server component and pass `tools` down
 * as plain props. Follows the WAI-ARIA combobox pattern.
 */
export function CommandPalette({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  // SSR renders the Mac hint; the client snapshot corrects it after hydration.
  const isMac = useSyncExternalStore(
    () => () => {},
    () => !/windows|linux/i.test(navigator.userAgent),
    () => true,
  );

  const results = useMemo(() => filterTools(tools, query), [tools, query]);
  const active = results[activeIndex];

  const show = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
    dialogRef.current?.showModal();
  }, []);

  // The input only exists after the `open` render, so focus it from an effect.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const hide = useCallback(() => {
    setOpen(false);
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) hide();
        else show();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [show, hide]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        results.length === 0 ? 0 : (i - 1 + results.length) % results.length,
      );
    } else if (e.key === "Enter" && active) {
      e.preventDefault();
      hide();
      router.push(`/tools/${active.slug}`);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className="hidden items-center gap-3 rounded-lg border border-[var(--border-hairline)] [background:var(--bg-elevated)] py-1.5 pl-3 pr-1.5 font-mono text-xs text-muted transition-colors hover:border-[var(--border-strong)] md:inline-flex"
      >
        search tools…
        <kbd className="rounded border border-[var(--border-hairline)] [background:var(--bg-inset)] px-1.5 py-0.5 font-mono text-[10px] text-secondary">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-label="Search tools"
        className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--border-hairline)] text-secondary transition-colors hover:border-[var(--border-strong)] hover:text-primary md:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Tool search"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) hide();
        }}
        className="m-auto w-[min(90vw,34rem)] rounded-xl border border-[var(--border-hairline)] [background:var(--bg-elevated)] p-0 text-primary shadow-2xl backdrop:bg-black/40"
      >
        {open ? (
          <div className="flex max-h-[70vh] flex-col">
            <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] px-4">
              <span aria-hidden="true" className="font-mono text-sm text-[var(--accent)]">
                &gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls={listId}
                aria-activedescendant={active ? `${listId}-${active.slug}` : undefined}
                aria-autocomplete="list"
                aria-label="Search tools"
                placeholder="type to search…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                className="w-full bg-transparent py-3.5 font-mono text-sm text-primary outline-none placeholder:text-muted"
              />
              <kbd className="shrink-0 rounded border border-[var(--border-hairline)] px-1.5 py-0.5 font-mono text-[10px] text-muted">
                esc
              </kbd>
            </div>
            <ul id={listId} role="listbox" aria-label="Tools" className="overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center font-mono text-sm text-muted" role="option" aria-selected="false" aria-disabled="true">
                  no tools match
                </li>
              ) : (
                results.map((tool, i) => (
                  <li
                    key={tool.slug}
                    id={`${listId}-${tool.slug}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      hide();
                      router.push(`/tools/${tool.slug}`);
                    }}
                    className={`flex cursor-pointer items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 ${
                      i === activeIndex
                        ? "[background:var(--bg-inset)] shadow-[inset_2px_0_0_var(--accent)]"
                        : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-primary">{tool.name}</span>
                    <span className="truncate font-mono text-xs text-muted">
                      /tools/{tool.slug}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
