/**
 * Vibecode wordmark — a shell prompt in JetBrains Mono with a blinking accent
 * cursor. Pure text, zero image bytes, adapts to both themes. Used inside a
 * labelled link.
 */
export function Logo() {
  return (
    <span className="inline-flex items-baseline font-mono text-base font-medium tracking-tight">
      <span aria-hidden="true" className="text-muted">
        ~/
      </span>
      <span className="text-primary">vibecode</span>
      <span aria-hidden="true" className="cursor-blink ml-px">
        ▊
      </span>
    </span>
  );
}
