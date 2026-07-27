import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Shield,
  Eye,
  Cookie,
  BarChart3,
  Globe,
  ExternalLink,
  Lock,
  Users,
  RefreshCw,
  Mail,
  BookOpen,
  MonitorSmartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | PUC Notes & Solutions",
  description:
    "Learn how PUC Notes collects, uses, and protects your information. Your privacy matters to us.",
};

/* ─── reusable pieces ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
      {children}
    </span>
  );
}

function PolicySection({
  number,
  icon: Icon,
  title,
  children,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex gap-5 rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-sm md:p-8">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold leading-snug md:text-xl">
          <span className="mr-2 text-primary/50">{number}.</span>
          {title}
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── page ─── */

export default function PrivacyPolicyPage() {
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
          <SectionLabel>Legal</SectionLabel>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Privacy{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>

          <p className="mx-auto mt-4 text-sm font-medium text-muted-foreground">
            Last Updated: July 2026
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Welcome to PUC Notes (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
            &ldquo;the website&rdquo;). Your privacy is important to us. This
            Privacy Policy explains what information we collect, how we use it,
            and your choices when using our website.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            By using PUC Notes, you agree to the practices described in this
            Privacy Policy.
          </p>
        </div>
      </section>

      {/* ── Policy Sections ── */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-3xl space-y-5 px-4">
          {/* 1 */}
          <PolicySection
            number="1"
            icon={Eye}
            title="Information We Collect"
          >
            <p>
              We collect only the information necessary to operate and improve
              the website. This may include:
            </p>
            <BulletList
              items={[
                "Basic device and browser information",
                "IP address (used for security and analytics)",
                "Pages visited",
                "Time spent on the website",
                "Search queries performed on the website",
                "Device type and operating system",
                "Cookies required for website functionality",
              ]}
            />
            <p>
              If you voluntarily contact us through our contact form or email,
              we may collect:
            </p>
            <BulletList
              items={[
                "Your name (if provided)",
                "Email address",
                "Message content",
              ]}
            />
          </PolicySection>

          {/* 2 */}
          <PolicySection
            number="2"
            icon={BookOpen}
            title="Educational Resources"
          >
            <p>
              PUC Notes provides educational materials including Chapter Notes,
              Question Papers, Model Papers, Revision Notes, Textbooks, and KCET
              Resources.
            </p>
            <p>
              These materials are provided for educational and reference
              purposes.
            </p>
          </PolicySection>

          {/* 3 */}
          <PolicySection number="3" icon={Cookie} title="Cookies">
            <p>We use cookies to:</p>
            <BulletList
              items={[
                "Remember basic preferences",
                "Improve website performance",
                "Measure website traffic",
                "Maintain temporary session unlocks (where applicable)",
                "Display relevant advertisements",
              ]}
            />
            <p>
              You may disable cookies in your browser, although some features
              may not function correctly.
            </p>
          </PolicySection>

          {/* 4 */}
          <PolicySection
            number="4"
            icon={MonitorSmartphone}
            title="Advertising"
          >
            <p>
              To keep PUC Notes free for students, advertisements may be
              displayed throughout the website.
            </p>
            <p>
              Advertising partners may use cookies or similar technologies to
              provide personalized or contextual advertisements in accordance
              with their own privacy policies.
            </p>
          </PolicySection>

          {/* 5 */}
          <PolicySection number="5" icon={BarChart3} title="Analytics">
            <p>We may use analytics services to understand:</p>
            <BulletList
              items={[
                "Popular subjects",
                "Frequently accessed resources",
                "Website performance",
                "Visitor statistics",
                "Device compatibility",
              ]}
            />
            <p>
              Analytics data is aggregated and used solely to improve the
              website.
            </p>
          </PolicySection>

          {/* 6 */}
          <PolicySection
            number="6"
            icon={Globe}
            title="Third-Party Services"
          >
            <p>
              Some resources may be delivered through trusted third-party
              services such as:
            </p>
            <BulletList
              items={[
                "Google Drive (for document hosting)",
                "Google Analytics",
                "Google AdSense / Google Ad Manager",
                "Vercel (website hosting)",
              ]}
            />
            <p>These services operate under their own privacy policies.</p>
          </PolicySection>

          {/* 7 */}
          <PolicySection
            number="7"
            icon={ExternalLink}
            title="External Links"
          >
            <p>
              The website may contain links to external websites. We are not
              responsible for the content, privacy practices, or policies of
              third-party websites.
            </p>
          </PolicySection>

          {/* 8 */}
          <PolicySection number="8" icon={Lock} title="Data Security">
            <p>
              We take reasonable measures to protect the website and its data.
              However, no method of internet transmission or electronic storage
              is completely secure.
            </p>
          </PolicySection>

          {/* 9 */}
          <PolicySection
            number="9"
            icon={Users}
            title="Children's Privacy"
          >
            <p>
              PUC Notes is intended for students and educational use. We do not
              knowingly collect personal information from children beyond what is
              voluntarily provided through contact forms.
            </p>
          </PolicySection>

          {/* 10 */}
          <PolicySection
            number="10"
            icon={RefreshCw}
            title="Changes to This Policy"
          >
            <p>
              This Privacy Policy may be updated periodically to reflect changes
              in the website or applicable laws. The updated version will always
              be published on this page.
            </p>
          </PolicySection>

          {/* 11 */}
          <PolicySection number="11" icon={Mail} title="Contact">
            <p>
              If you have questions regarding this Privacy Policy, or wish to
              report incorrect information or broken resources, please contact
              us through our{" "}
              <Link
                href="/contact"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Contact page
              </Link>
              .
            </p>
          </PolicySection>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t bg-muted/20 py-12 md:py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
            <Shield className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground">
            Your privacy matters. If you have any concerns, don&apos;t hesitate
            to reach out.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
      </section>
    </div>
  );
}
