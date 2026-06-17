/**
 * Cron expression building + plain-English description - pure, framework-free,
 * unit-testable. Targets standard 5-field cron (minute hour day-of-month month
 * day-of-week). Built from structured UI state, so output is always valid.
 */

export type FieldMode = "every" | "step" | "specific";

export interface FieldState {
  mode: FieldMode;
  /** Used when mode === "step" (the N in a step expression). */
  step: number;
  /** Used when mode === "specific" - the selected values. */
  values: number[];
}

export interface CronState {
  minute: FieldState;
  hour: FieldState;
  dayOfMonth: FieldState;
  month: FieldState;
  dayOfWeek: FieldState;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export const defaultField = (): FieldState => ({ mode: "every", step: 2, values: [] });

export const defaultCronState = (): CronState => ({
  minute: defaultField(),
  hour: defaultField(),
  dayOfMonth: defaultField(),
  month: defaultField(),
  dayOfWeek: defaultField(),
});

/** Render a single field to its cron token. */
export function buildField(field: FieldState): string {
  if (field.mode === "step") {
    const step = Math.max(1, Math.floor(field.step || 1));
    return step === 1 ? "*" : `*/${step}`;
  }
  if (field.mode === "specific") {
    const vals = [...new Set(field.values)].sort((a, b) => a - b);
    return vals.length ? vals.join(",") : "*";
  }
  return "*";
}

/** Assemble the full 5-field cron expression. */
export function buildCron(state: CronState): string {
  return [
    buildField(state.minute),
    buildField(state.hour),
    buildField(state.dayOfMonth),
    buildField(state.month),
    buildField(state.dayOfWeek),
  ].join(" ");
}

function joinList(values: number[], names?: string[]): string {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  const labels = sorted.map((v) => (names ? (names[v] ?? String(v)) : String(v)));
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

function timePhrase(minute: FieldState, hour: FieldState): string {
  // Both wide open.
  if (minute.mode === "every" && hour.mode === "every") return "Every minute";

  // Stepped minutes.
  if (minute.mode === "step") {
    const m = `Every ${Math.max(1, minute.step)} minutes`;
    if (hour.mode === "specific" && hour.values.length) {
      return `${m} past hour ${joinList(hour.values)}`;
    }
    if (hour.mode === "step") return `${m}, every ${Math.max(1, hour.step)} hours`;
    return m;
  }

  // Exact single time (HH:MM).
  if (
    minute.mode === "specific" &&
    minute.values.length === 1 &&
    hour.mode === "specific" &&
    hour.values.length === 1
  ) {
    return `At ${pad(hour.values[0])}:${pad(minute.values[0])}`;
  }

  // Specific minutes.
  if (minute.mode === "specific" && minute.values.length) {
    const m = `At minute ${joinList(minute.values)}`;
    if (hour.mode === "specific" && hour.values.length) {
      return `${m} past hour ${joinList(hour.values)}`;
    }
    if (hour.mode === "step") return `${m}, every ${Math.max(1, hour.step)} hours`;
    return m;
  }

  // Minute wide open, hour constrained.
  if (hour.mode === "specific" && hour.values.length) {
    return `Every minute past hour ${joinList(hour.values)}`;
  }
  if (hour.mode === "step") return `Every minute, every ${Math.max(1, hour.step)} hours`;
  return "Every minute";
}

/** Human-readable summary of what the schedule does. */
export function describeCron(state: CronState): string {
  const parts: string[] = [timePhrase(state.minute, state.hour)];

  const dom = state.dayOfMonth;
  if (dom.mode === "specific" && dom.values.length) {
    parts.push(`on day-of-month ${joinList(dom.values)}`);
  } else if (dom.mode === "step") {
    parts.push(`every ${Math.max(1, dom.step)} days of the month`);
  }

  const month = state.month;
  if (month.mode === "specific" && month.values.length) {
    parts.push(`in ${joinList(month.values.map((m) => m - 1), MONTH_NAMES)}`);
  } else if (month.mode === "step") {
    parts.push(`every ${Math.max(1, month.step)} months`);
  }

  const dow = state.dayOfWeek;
  if (dow.mode === "specific" && dow.values.length) {
    parts.push(`on ${joinList(dow.values, WEEKDAY_NAMES)}`);
  } else if (dow.mode === "step") {
    parts.push(`every ${Math.max(1, dow.step)} days of the week`);
  }

  return parts.join(", ") + ".";
}
