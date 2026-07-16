/** Line-based text diff using the Myers O(ND) algorithm. */

export interface DiffOp {
  type: "same" | "add" | "del";
  text: string;
  /** 1-based line number in the original (for same/del). */
  aLine?: number;
  /** 1-based line number in the revised text (for same/add). */
  bLine?: number;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

/** Myers shortest-edit-script over lines. */
export function diffLines(aText: string, bText: string): DiffOp[] {
  const a = aText.split("\n");
  const b = bText.split("\n");
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const offset = max;
  // v[k + offset] = furthest x on diagonal k; trace stores v per depth d.
  const v = new Array<number>(2 * max + 1).fill(0);
  const trace: number[][] = [];

  outer: for (let d = 0; d <= max; d++) {
    trace.push(v.slice());
    for (let k = -d; k <= d; k += 2) {
      let x =
        k === -d || (k !== d && v[k - 1 + offset] < v[k + 1 + offset])
          ? v[k + 1 + offset]
          : v[k - 1 + offset] + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v[k + offset] = x;
      if (x >= n && y >= m) break outer;
    }
  }

  // Backtrack the trace into edit operations.
  const ops: DiffOp[] = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d > 0; d--) {
    const vPrev = trace[d];
    const k = x - y;
    const prevK =
      k === -d || (k !== d && vPrev[k - 1 + offset] < vPrev[k + 1 + offset])
        ? k + 1
        : k - 1;
    const prevX = vPrev[prevK + offset];
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      ops.push({ type: "same", text: a[x - 1], aLine: x, bLine: y });
      x--;
      y--;
    }
    if (x === prevX) {
      ops.push({ type: "add", text: b[y - 1], bLine: y });
      y--;
    } else {
      ops.push({ type: "del", text: a[x - 1], aLine: x });
      x--;
    }
  }
  while (x > 0 && y > 0) {
    ops.push({ type: "same", text: a[x - 1], aLine: x, bLine: y });
    x--;
    y--;
  }
  while (y > 0) {
    ops.push({ type: "add", text: b[y - 1], bLine: y });
    y--;
  }
  while (x > 0) {
    ops.push({ type: "del", text: a[x - 1], aLine: x });
    x--;
  }

  return ops.reverse();
}

export function diffStats(ops: DiffOp[]): DiffStats {
  return {
    added: ops.filter((o) => o.type === "add").length,
    removed: ops.filter((o) => o.type === "del").length,
    unchanged: ops.filter((o) => o.type === "same").length,
  };
}

/** Render ops as a unified-diff-style plain-text block (for copying). */
export function toUnified(ops: DiffOp[]): string {
  return ops
    .map((o) => (o.type === "add" ? `+ ${o.text}` : o.type === "del" ? `- ${o.text}` : `  ${o.text}`))
    .join("\n");
}
