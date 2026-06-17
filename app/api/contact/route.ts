/**
 * Contact form Route Handler - the ONLY server code in Vibecode.
 *
 * Sends an email via Resend's REST API using credentials from the environment.
 * Secrets are read from process.env and never hardcoded or committed.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return json(
      { error: "The contact form is not configured. Please email us directly." },
      503,
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return json({ error: "Name, email, and message are all required." }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: "Please provide a valid email address." }, 400);
  }
  if (message.length > 5000) {
    return json({ error: "Message is too long (5000 characters max)." }, 400);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Vibecode contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(
        email,
      )}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });

  if (!res.ok) {
    return json({ error: "We couldn't send your message. Please try again later." }, 502);
  }

  return json({ ok: true }, 200);
}
