import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  resolveSlug, getAllSlugs, getMetadata, getAllCategorySlugs,
  getClass, getStream, getSubject, getSubjectBySlug,
  getCategoryMeta,
} from "@/lib/data";

// Page templates
import { ClassPage } from "@/components/templates/class-page";
import { StreamPage } from "@/components/templates/stream-page";
import { SubjectPage } from "@/components/templates/subject-page";
import { ResourceAggregatePage } from "@/components/templates/resource-aggregate-page";
import { ResourceCategoryPage } from "@/components/templates/resource-category-page";
import { StaticPage } from "@/components/templates/static-page";
import { KcetSubpage } from "@/components/templates/kcet-subpage";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

// ──────────────────────────────────────────────
// Static generation
// ──────────────────────────────────────────────

export async function generateStaticParams() {
  // Single-segment slugs (existing pages)
  const singleSlugs = getAllSlugs().map((slug) => ({ slug: [slug] }));

  // Two-segment slugs (new category pages: subject/category)
  const categorySlugs = getAllCategorySlugs().map(([subjectSlug, categorySlug]) => ({
    slug: [subjectSlug, categorySlug],
  }));

  return [...singleSlugs, ...categorySlugs];
}

// ──────────────────────────────────────────────
// Dynamic metadata from SEO data
// ──────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length === 1) {
    const meta = getMetadata(slug[0]);
    if (!meta) {
      return { title: "Not Found", description: "Page not found." };
    }
    return { title: meta.title, description: meta.description };
  }

  if (slug.length === 2) {
    const [subjectSlug, categorySlug] = slug;
    const subject = getSubjectBySlug(subjectSlug);
    const catMeta = getCategoryMeta(categorySlug);

    if (subject && catMeta) {
      return {
        title: `${subject.name} ${catMeta.title} | PUC Notes & Solutions`,
        description: `Download ${subject.name} ${catMeta.title.toLowerCase()} — ${catMeta.description}.`,
      };
    }
  }

  return { title: "Not Found", description: "Page not found." };
}

// ──────────────────────────────────────────────
// Slug dispatcher — renders the correct template
// ──────────────────────────────────────────────

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  // ── Two-segment routes: subject/category ──
  if (slug.length === 2) {
    const [subjectSlug, categorySlug] = slug;
    const entry = resolveSlug(subjectSlug);

    // The first segment must be a subject slug
    if (!entry || entry.type !== 'subject') {
      notFound();
    }

    // Validate the category slug
    const catMeta = getCategoryMeta(categorySlug);
    if (!catMeta) {
      notFound();
    }

    return (
      <ResourceCategoryPage
        subjectSlug={subjectSlug}
        categorySlug={categorySlug}
      />
    );
  }

  // ── Single-segment routes: existing pages ──
  if (slug.length === 1) {
    const entry = resolveSlug(slug[0]);

    if (!entry) {
      notFound();
    }

    switch (entry.type) {
      case 'class': {
        const classData = getClass(entry.entityId!);
        if (!classData) notFound();
        return <ClassPage classData={classData!} slug={slug[0]} />;
      }

      case 'stream': {
        const streamData = getStream(entry.entityId!);
        if (!streamData) notFound();
        return <StreamPage streamData={streamData!} slug={slug[0]} />;
      }

      case 'subject': {
        const subjectData = getSubject(entry.entityId!);
        if (!subjectData) notFound();
        return <SubjectPage subjectData={subjectData!} slug={slug[0]} subType={entry.subType || 'papers'} />;
      }

      case 'resource-aggregate': {
        return (
          <ResourceAggregatePage
            slug={slug[0]}
            resourceType={entry.resourceType || ''}
            classId={entry.classId}
          />
        );
      }

      case 'kcet-subpage': {
        return <KcetSubpage slug={slug[0]} subType={entry.subType || 'resource'} />;
      }

      case 'static': {
        return <StaticPage slug={slug[0]} />;
      }

      default: {
        notFound();
      }
    }
  }

  // ── Anything else: 404 ──
  notFound();
}
