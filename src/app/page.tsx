import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ClassCard } from "@/components/class-card";
import { SectionGrid } from "@/components/section-grid";
import { getSortedClasses } from "@/lib/data";

export default function Home() {
  const classes = getSortedClasses();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-muted/30 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Your Ultimate Resource for{" "}
            <span className="text-primary">PUC & 10th</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Download notes, textbooks, question papers, and solutions for KSEEB
            10th and DPUE 1st & 2nd PUC completely free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/1stpuckarnataka"
              className={buttonVariants({ size: "lg" })}
            >
              1st PU Notes
            </Link>
            <Link
              href="/2ndpuckarnataka"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              2nd PU Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Choose Your Class */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Choose Your Class
        </h2>
        <SectionGrid columns={4}>
          {classes.map((cls) => (
            <ClassCard
              key={cls.id}
              name={cls.name}
              slug={cls.slug}
              board={cls.board}
              streamCount={cls.streams.length}
            />
          ))}
        </SectionGrid>
      </section>

      {/* Popular Resources */}
      <section className="bg-muted/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Popular Resources</h2>
          <p className="text-muted-foreground mb-8">
            Search through thousands of PDFs across all subjects instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/model-papers"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Model Papers
            </Link>
            <Link
              href="/question-bank"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Question Banks
            </Link>
            <Link
              href="/previous-year-papers"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Previous Year Papers
            </Link>
            <Link
              href="/revision-notes"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Revision Notes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
