"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  buildCron,
  defaultCronState,
  describeCron,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  type CronState,
  type FieldMode,
  type FieldState,
} from "@/lib/tools/cron";

type FieldKey = keyof CronState;

interface FieldConfig {
  key: FieldKey;
  legend: string;
  unit: string; // for "every N <unit>"
  min: number;
  max: number;
  /** Optional display labels keyed by value (e.g. months, weekdays). */
  label?: (value: number) => string;
}

const FIELDS: FieldConfig[] = [
  { key: "minute", legend: "Minute", unit: "minutes", min: 0, max: 59 },
  { key: "hour", legend: "Hour", unit: "hours", min: 0, max: 23 },
  { key: "dayOfMonth", legend: "Day of month", unit: "days", min: 1, max: 31 },
  {
    key: "month",
    legend: "Month",
    unit: "months",
    min: 1,
    max: 12,
    label: (v) => MONTH_NAMES[v - 1].slice(0, 3),
  },
  {
    key: "dayOfWeek",
    legend: "Day of week",
    unit: "days",
    min: 0,
    max: 6,
    label: (v) => WEEKDAY_NAMES[v].slice(0, 3),
  },
];

const MODES: { value: FieldMode; label: string }[] = [
  { value: "every", label: "Every" },
  { value: "step", label: "Every N" },
  { value: "specific", label: "Specific" },
];

function range(min: number, max: number): number[] {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

function CronFieldControl({
  config,
  field,
  onChange,
}: {
  config: FieldConfig;
  field: FieldState;
  onChange: (next: FieldState) => void;
}) {
  const values = range(config.min, config.max);

  function toggleValue(v: number) {
    const set = new Set(field.values);
    if (set.has(v)) set.delete(v);
    else set.add(v);
    onChange({ ...field, values: [...set] });
  }

  return (
    <fieldset className="glass-card p-4">
      <legend className="px-1 text-sm font-semibold text-primary">{config.legend}</legend>

      <div role="radiogroup" aria-label={`${config.legend} mode`} className="mt-2 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <label
            key={m.value}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
              field.mode === m.value
                ? "border-[var(--accent)] text-primary [background:color-mix(in_srgb,var(--accent)_14%,transparent)]"
                : "border-[var(--glass-border)] text-secondary"
            }`}
          >
            <input
              type="radio"
              name={`${config.key}-mode`}
              value={m.value}
              checked={field.mode === m.value}
              onChange={() => onChange({ ...field, mode: m.value })}
              className="sr-only"
            />
            {m.label}
          </label>
        ))}
      </div>

      {field.mode === "step" ? (
        <div className="mt-3 flex items-center gap-2">
          <label htmlFor={`${config.key}-step`} className="text-xs text-secondary">
            Every
          </label>
          <input
            id={`${config.key}-step`}
            type="number"
            min={1}
            max={config.max}
            value={field.step}
            onChange={(e) =>
              onChange({ ...field, step: Math.max(1, Math.floor(Number(e.target.value) || 1)) })
            }
            className="w-20 rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-2 py-1.5 text-sm text-primary focus:border-[var(--accent)] focus:outline-none"
          />
          <span className="text-xs text-secondary">{config.unit}</span>
        </div>
      ) : null}

      {field.mode === "specific" ? (
        <div role="group" aria-label={`Select ${config.legend.toLowerCase()} values`} className="mt-3 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
          {values.map((v) => {
            const active = field.values.includes(v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => toggleValue(v)}
                aria-pressed={active}
                className={`min-w-9 rounded-md border px-2 py-1 text-xs transition-colors ${
                  active
                    ? "border-[var(--accent)] text-primary [background:color-mix(in_srgb,var(--accent)_18%,transparent)]"
                    : "border-[var(--glass-border)] text-secondary hover:text-primary"
                }`}
              >
                {config.label ? config.label(v) : v}
              </button>
            );
          })}
        </div>
      ) : null}
    </fieldset>
  );
}

export function CronBuilder() {
  const [state, setState] = useState<CronState>(defaultCronState);

  const expression = useMemo(() => buildCron(state), [state]);
  const description = useMemo(() => describeCron(state), [state]);

  function updateField(key: FieldKey, next: FieldState) {
    setState((prev) => ({ ...prev, [key]: next }));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((config) => (
          <CronFieldControl
            key={config.key}
            config={config}
            field={state[config.key]}
            onChange={(next) => updateField(config.key, next)}
          />
        ))}
      </div>

      <div className="glass-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-secondary">Cron expression</h2>
          <CopyButton value={expression} label="Copy expression" />
        </div>
        <p className="mt-2 break-all font-mono text-2xl text-primary" aria-live="polite">
          {expression}
        </p>
        <p className="mt-4 text-sm text-secondary" aria-live="polite">
          <span className="font-medium text-primary">Runs:</span> {description}
        </p>
      </div>
    </div>
  );
}
