import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Library,
  Zap,
  Target,
  Globe,
  RefreshCw,
  Heart,
  Mail,
  ChevronRight,
  CheckCircle,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | PUC Notes & Solutions",
  description:
    "PUC Notes is a free educational platform providing chapter-wise notes, question papers, model papers, textbooks, and KCET resources for Karnataka PUC & SSLC students.",
};

/* ─── small reusable pieces ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
      {children}
    </span>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="group relative flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-6 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative flex gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold leading-snug">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─── resource list item ─── */

const RESOURCES = [
  { icon: BookOpen, label: "Chapter-wise Notes" },
  { icon: FileText, label: "Previous Year Question Papers" },
  { icon: FileText, label: "Model Papers" },
  { icon: Library, label: "Question Banks" },
  { icon: Zap, label: "Revision Notes" },
  { icon: BookOpen, label: "Textbooks" },
  { icon: GraduationCap, label: "NCERT Solutions" },
  { icon: Target, label: "KCET Resources" },
  { icon: Sparkles, label: "Important Updates" },
];

const NAVIGATION_LINKS = [
  { href: "/1stpuckarnataka", label: "1st PUC Resources" },
  { href: "/2ndpuckarnataka", label: "2nd PUC Resources" },
  { href: "/10thkseebresources", label: "SSLC (Class 10)" },
  { href: "/kcet", label: "KCET Preparation" },
];

/* ─── page ─── */

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-muted/30 py-20 md:py-28">
        {/* subtle decorative dots */}
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
          <SectionLabel>About Us</SectionLabel>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            About{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              PUC Notes
            </span>
          </h1>

          <p className="mx-auto mt-4 text-lg text-primary/80 font-medium">
            Helping Karnataka Students Study Smarter
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            PUC Notes is a free educational platform built to make quality study
            resources easily accessible for students following the Karnataka
            DPUE and KSEAB syllabus.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Over the years, thousands of students have used this website to
            access chapter-wise notes, previous year question papers, model
            papers, textbooks, revision notes, question banks, and KCET
            preparation resources — all in one place.
          </p>
        </div>
      </section>

      {/* ── Goal Quote ── */}
      <section className="border-y bg-card py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <blockquote className="relative text-xl font-semibold italic leading-relaxed text-foreground/90 md:text-2xl">
            <span
              aria-hidden
              className="absolute -left-4 -top-4 text-6xl font-bold text-primary/10 select-none"
            >
              &ldquo;
            </span>
            Reduce the time students spend searching for study materials and
            increase the time they spend learning.
            <span
              aria-hidden
              className="absolute -bottom-6 -right-2 text-6xl font-bold text-primary/10 select-none"
            >
              &rdquo;
            </span>
          </blockquote>
          <p className="mt-8 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Our Simple Goal
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            <StatCard
              icon={Users}
              value="1000s+"
              label="Students Helped"
            />
            <StatCard icon={BookOpen} value="9+" label="Resource Types" />
            <StatCard icon={Globe} value="3" label="Class Levels" />
            <StatCard icon={Clock} value="24/7" label="Free Access" />
          </div>
        </div>
      </section>

      {/* ── Why We Built This ── */}
      <section className="bg-muted/20 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center">
            <SectionLabel>Why We Built This</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              One Platform, All Resources
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Finding reliable study resources for Karnataka&apos;s PUC
              curriculum often means searching across multiple websites, Google
              Drive folders, Telegram groups, and PDFs. PUC Notes brings these
              resources together in a single organized platform.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between rounded-xl border border-border/60 bg-card px-5 py-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="font-medium">{link.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            The website is continuously updated to match the latest syllabus
            whenever possible, ensuring students have access to relevant and
            useful materials.
          </p>
        </div>
      </section>

      {/* ── What You'll Find ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center">
            <SectionLabel>Resources</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              What You&apos;ll Find
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              PUC Notes provides resources across Science, Commerce, and
              Languages — organized by{" "}
              <strong className="text-foreground font-semibold">
                Class → Stream → Subject → Resource Type
              </strong>
              .
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2 md:grid-cols-3">
            {RESOURCES.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.label}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-colors hover:border-primary/20"
                >
                  <Icon className="h-4 w-4 shrink-0 text-primary/70" />
                  <span className="text-sm font-medium">{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mission + Features grid ── */}
      <section className="bg-muted/20 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center">
            <SectionLabel>Our Values</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              What Drives Us
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={Target}
              title="Our Mission"
              description="Provide a clean, fast, and reliable platform where Karnataka students can quickly find the study material they need without unnecessary distractions."
            />
            <FeatureCard
              icon={RefreshCw}
              title="Continuous Improvement"
              description="Resources are reviewed and updated regularly to reflect syllabus changes, improve accuracy, and provide a better learning experience."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Quality & Accuracy"
              description="New subjects, updated notes, additional question papers, and improved features are continuously added as the platform grows."
            />
            <FeatureCard
              icon={Heart}
              title="Support the Platform"
              description="PUC Notes is offered free of cost. Advertising helps support hosting, development, and content updates — allowing us to keep everything free."
            />
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm md:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="h-7 w-7" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Get in Touch
            </h2>

            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Notice an outdated resource, a broken PDF, or have suggestions for
              improvement? Your feedback helps us make the platform better for
              everyone.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className={buttonVariants({ size: "lg" })}
              >
                Contact Us
              </Link>
              <Link
                href="/"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
