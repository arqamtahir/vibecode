"use client";

import { useId, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const CONTACT_EMAIL = "hello@algocrew.io";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  function validate(data: { name: string; email: string; message: string }): FieldErrors {
    const next: FieldErrors = {};
    if (!data.name.trim()) next.name = "Please enter your name.";
    if (!data.email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(data.email)) next.email = "Please enter a valid email address.";
    if (!data.message.trim()) next.message = "Please enter a message.";
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const validation = validate(data);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="glass-card p-8 text-center">
        <h2 className="text-xl font-bold text-primary">Thanks — message sent!</h2>
        <p className="mt-2 text-secondary">
          We&apos;ve received your message and will reply to your email shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center rounded-full border border-[var(--glass-border)] px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:border-[var(--accent)]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass-card space-y-5 p-6 sm:p-8">
      <div>
        <label htmlFor={nameId} className="block text-sm font-medium text-primary">
          Name
        </label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          className="mt-1.5 w-full rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2.5 text-primary focus:border-[var(--accent)] focus:outline-none"
        />
        {errors.name ? (
          <p id={`${nameId}-error`} className="mt-1.5 text-sm text-[var(--brand-purple)]">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={emailId} className="block text-sm font-medium text-primary">
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          className="mt-1.5 w-full rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2.5 text-primary focus:border-[var(--accent)] focus:outline-none"
        />
        {errors.email ? (
          <p id={`${emailId}-error`} className="mt-1.5 text-sm text-[var(--brand-purple)]">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={messageId} className="block text-sm font-medium text-primary">
          Message
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={5}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          className="mt-1.5 w-full rounded-lg border border-[var(--glass-border)] [background:var(--bg-page)] px-3 py-2.5 text-primary focus:border-[var(--accent)] focus:outline-none"
        />
        {errors.message ? (
          <p
            id={`${messageId}-error`}
            className="mt-1.5 text-sm text-[var(--brand-purple)]"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      <div role="alert" aria-live="assertive" className="min-h-[1.25rem]">
        {status === "error" && serverError ? (
          <p className="text-sm text-[var(--brand-purple)]">
            {serverError} You can also email us directly at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={status === "submitting"} className="glow-button w-full disabled:opacity-60">
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      <p className="text-center text-xs text-muted">
        Prefer email? Reach us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[var(--accent)] hover:underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
