"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bell,
  CheckCircle2,
  ArrowLeft,
  FileCheck,
  Zap,
  BookOpen,
  GraduationCap,
  Clock,
  Send,
  Search,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ComingSoonProps {
  title: string;
  description?: string;
  category?: string;
  backLink?: {
    href: string;
    label: string;
  };
  progress?: number; // 0 - 100
  estimatedLaunch?: string;
}

export function ComingSoon({
  title,
  description,
  category = "Content Preparation",
  backLink = { href: "/", label: "Back to Home" },
  progress = 80,
  estimatedLaunch = "Coming in Next Update",
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      {/* Dynamic background ambient glow & grid effect */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[350px] w-[500px] rounded-full bg-gradient-to-tr from-primary/15 via-indigo-500/10 to-purple-500/15 blur-3xl opacity-70 animate-pulse" />
        <div className="h-[250px] w-[250px] rounded-full bg-blue-500/10 blur-2xl opacity-60 transform translate-x-32 -translate-y-20" />
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        {backLink && (
          <div className="mb-6">
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {backLink.label}
            </Link>
          </div>
        )}

        {/* Hero Card Container */}
        <div className="relative rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 md:p-10 shadow-xl shadow-primary/5">
          {/* Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <Sparkles className="h-3.5 w-3.5" />
              <span>{category.toUpperCase()}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{estimatedLaunch}</span>
            </div>
          </div>

          {/* Main Title & Description */}
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {description ||
                `We are currently curating and verifying high-quality study notes, question papers, and textbook solutions for ${title}. This section will be live shortly!`}
            </p>
          </div>

          {/* Preparation Progress Bar */}
          <div className="mb-10 rounded-xl bg-muted/40 p-4 md:p-5 border border-border/40">
            <div className="flex justify-between items-center text-sm font-medium mb-2">
              <span className="flex items-center gap-2 text-foreground">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                Preparation Status
              </span>
              <span className="font-bold text-primary">{progress}% Ready</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden p-0.5 border border-border/50">
              <div
                className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-3 text-[11px] text-muted-foreground mt-3 text-center border-t border-border/30 pt-2.5">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Digitizing PDFs
              </div>
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Quality Review
              </div>
              <div className="flex items-center justify-center gap-1 font-medium text-foreground">
                <Clock className="h-3 w-3 text-primary animate-spin" /> Final Publishing
              </div>
            </div>
          </div>

          {/* Interactive Email / Request Note Form */}
          <div className="rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-6 border border-primary/15 mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Get Notified When Live
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter your email to receive an alert the second these notes are uploaded.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Awesome! You&apos;re on the notification list. We&apos;ll notify you directly as soon as content is available!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 mt-3">
                <Input
                  type="email"
                  placeholder="Enter your student email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/90 border-border/80 text-sm h-11"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 font-semibold shadow-md whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <Clock className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Notify Me
                </Button>
              </form>
            )}
          </div>

          {/* Features Preview Grid */}
          <div className="mb-10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              What to expect in this section
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 flex items-start gap-3">
                <FileCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold">Clear PDF Downloads</h5>
                  <p className="text-[11px] text-muted-foreground">High resolution, fast load speeds</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 flex items-start gap-3">
                <Zap className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold">Solved Solutions</h5>
                  <p className="text-[11px] text-muted-foreground">Detailed step-by-step answers</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold">Chapter Summaries</h5>
                  <p className="text-[11px] text-muted-foreground">Quick key formulas & points</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold">100% Free Access</h5>
                  <p className="text-[11px] text-muted-foreground">No signups or paywalls required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links to Popular Active Content */}
          <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="text-xs font-semibold text-foreground flex items-center justify-center md:justify-start gap-1.5">
                <Search className="h-3.5 w-3.5 text-primary" />
                Need study material right now?
              </p>
              <p className="text-xs text-muted-foreground">
                Browse our active collections for 2nd PU, 1st PU & 10th Standard.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/2ndpuckarnataka"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                2nd PU Science
              </Link>
              <Link
                href="/1stpuckarnataka"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                1st PU Notes
              </Link>
              <Link
                href="/10thkseebresources"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                10th Standard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
