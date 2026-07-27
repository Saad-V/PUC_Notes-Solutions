"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const CATEGORIES = [
  "General Enquiry",
  "Report Broken PDF",
  "Content Correction",
  "Suggest a Feature",
  "Collaboration",
  "Advertisement",
  "Copyright / DMCA",
  "Other",
] as const;

interface FormState {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  category: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(data.error || "Something went wrong.");
          return;
        }

        setStatus("success");
        setForm(INITIAL_STATE);
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please check your connection.");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-8 text-center dark:border-green-900 dark:bg-green-950/20 md:p-12">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Thank you for reaching out. We&apos;ll review your message and get
          back to you within 2–5 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8"
    >
      {/* Error banner */}
      {status === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium"
        >
          Name{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label
          htmlFor="contact-category"
          className="block text-sm font-medium"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="contact-category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          >
            <option value="" disabled>
              Select a category…
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label
          htmlFor="contact-subject"
          className="block text-sm font-medium"
        >
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Brief description of your enquiry"
          required
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Please provide as much detail as possible…"
          required
          rows={6}
          className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Attachment placeholder */}
      <p className="text-xs text-muted-foreground/60 italic">
        File attachment support coming soon.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
