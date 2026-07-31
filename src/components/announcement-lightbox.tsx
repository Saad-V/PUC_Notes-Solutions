"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, BookOpen, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Change this key whenever you want to show a NEW announcement to all users.
 * Users who dismissed a previous version will see the new one.
 */
const ANNOUNCEMENT_KEY = "announcement_dismissed_v1";

export function AnnouncementLightbox() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so the page renders first, then the lightbox fades in
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem(ANNOUNCEMENT_KEY);
      if (!dismissed) setVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(ANNOUNCEMENT_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={dismiss}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-primary via-indigo-500 to-purple-600" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6 sm:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              What&apos;s New
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
            Welcome to the New{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              PUC Notes
            </span>
          </h2>

          <p className="mt-3 text-center text-sm text-muted-foreground leading-relaxed">
            We&apos;ve completely rebuilt the website from scratch to give you a faster,
            cleaner, and more organized experience.
          </p>

          {/* Updates list */}
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/40 p-3.5">
              <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">Updated Notes</p>
                <p className="text-muted-foreground mt-0.5">
                  English and Computer Science notes have been freshly updated
                  for both 1st &amp; 2nd PUC.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/40 p-3.5">
              <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">
                  More Updates Coming Soon
                </p>
                <p className="text-muted-foreground mt-0.5">
                  New subjects, question papers, model papers, and KCET
                  resources are being added regularly. Stay tuned!
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Previous versions of notes are still accessible under the{" "}
            <strong className="text-foreground">Old Notes (Archive)</strong>{" "}
            section within each subject.
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button size="lg" className="font-semibold" onClick={dismiss}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Start Exploring
            </Button>
            <Link href="/contact" onClick={dismiss}>
              <Button
                variant="outline"
                size="lg"
                className="w-full font-semibold"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
