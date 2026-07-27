import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import {
  Headset,
  AlertCircle,
  Handshake,
  Megaphone,
  ShieldAlert,
  Lightbulb,
  Clock,
  Info,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | PUC Notes & Solutions",
  description:
    "Get in touch with PUC Notes — report issues, suggest improvements, collaborate, or explore advertising opportunities.",
};

/* ─── reusable pieces ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
      {children}
    </span>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/50" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── page ─── */

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-muted/30 py-20 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="container relative mx-auto max-w-3xl px-4 text-center">
          <SectionLabel>Get In Touch</SectionLabel>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Contact{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Us
            </span>
          </h1>

          <p className="mx-auto mt-4 text-lg font-medium text-primary/80">
            We&apos;d Love to Hear From You
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Whether you&apos;re a student, teacher, institution, or
            organization, we&apos;re always happy to hear your feedback, answer
            questions, and explore collaboration opportunities.
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            If you&apos;ve found an issue on the website or have suggestions to
            improve our resources, please don&apos;t hesitate to get in touch.
          </p>
        </div>
      </section>

      {/* ── Info Cards Grid ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* General Support */}
            <InfoCard icon={Headset} title="General Support">
              <p className="mb-3">For questions and issues including:</p>
              <BulletList
                items={[
                  "Broken PDF links",
                  "Missing notes",
                  "Incorrect information",
                  "Website bugs",
                  "Content update requests",
                  "General questions",
                ]}
              />
            </InfoCard>

            {/* Report an Issue */}
            <InfoCard icon={AlertCircle} title="Report an Issue">
              <p className="mb-3">Help us keep the platform accurate:</p>
              <BulletList
                items={[
                  "Broken PDF",
                  "Wrong chapter mapping",
                  "Incorrect syllabus",
                  "Missing chapter",
                  "Typographical errors",
                  "Duplicate resources",
                ]}
              />
            </InfoCard>

            {/* Collaborate */}
            <InfoCard icon={Handshake} title="Collaborate With Us">
              <p className="mb-3">
                We&apos;re open to collaborating with educators, institutions,
                and content creators:
              </p>
              <BulletList
                items={[
                  "Study material contributions",
                  "Notes verification",
                  "Question paper collections",
                  "Educational content partnerships",
                  "Academic projects",
                ]}
              />
            </InfoCard>

            {/* Advertise */}
            <InfoCard icon={Megaphone} title="Advertise With Us">
              <p className="mb-3">
                Reach thousands of Karnataka students preparing for SSLC, 1st
                PUC, 2nd PUC, and KCET.
              </p>
              <p>
                If you&apos;re an educational institution, coaching centre,
                ed-tech company, or publisher interested in advertising or
                sponsorship, we&apos;d be happy to discuss suitable options.
              </p>
              <p className="mt-3">
                <a
                  href="mailto:pucnotesnsolutions@gmail.com?subject=Media Kit %26 Advertising Opportunities"
                  className="inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Email us for Media Kit &amp; Advertising Opportunities
                </a>
              </p>
            </InfoCard>

            {/* Copyright */}
            <InfoCard icon={ShieldAlert} title="Copyright & Content Removal">
              <p className="mb-3">
                If you believe any content infringes your copyright, please
                contact us with:
              </p>
              <BulletList
                items={[
                  "Your name",
                  "Organization (if applicable)",
                  "Resource URL",
                  "Reason for removal",
                  "Supporting evidence",
                ]}
              />
              <p className="mt-3">We&apos;ll review the request promptly.</p>
            </InfoCard>

            {/* Suggestions */}
            <InfoCard icon={Lightbulb} title="Suggestions">
              <p className="mb-3">
                Have an idea that could improve the platform?
              </p>
              <BulletList
                items={[
                  "New features",
                  "UI improvements",
                  "Better organization",
                  "Additional resources",
                  "Accessibility improvements",
                ]}
              />
              <p className="mt-3 text-xs italic text-muted-foreground/70">
                Many improvements to PUC Notes are inspired by student feedback.
              </p>
            </InfoCard>
          </div>
        </div>
      </section>

      {/* ── Response Time + Before You Contact ── */}
      <section className="border-y bg-muted/20 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Response Time */}
            <div className="flex gap-4 rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Response Time</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  We aim to respond to all genuine enquiries within{" "}
                  <strong className="text-foreground">2–5 business days</strong>.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  During examination seasons, response times may be slightly
                  longer due to increased volume.
                </p>
              </div>
            </div>

            {/* Before You Contact Us */}
            <div className="flex gap-4 rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Before You Contact Us</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                    We cannot assist with examination results or official
                    admission procedures.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                    Official syllabus updates should be verified with Karnataka
                    education authorities.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                    If a PDF isn&apos;t opening, try refreshing the page or
                    reporting the issue through the form.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section className="py-16 md:py-20" id="contact-form">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="text-center mb-10">
            <SectionLabel>Send a Message</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Contact Form
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
