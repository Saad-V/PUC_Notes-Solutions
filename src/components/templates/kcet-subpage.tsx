import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { ComingSoon } from "@/components/coming-soon";
import {
  getResources, getMetadata, buildBreadcrumbs,
} from "@/lib/data";

// KCET sub-page slug definitions (same as generate_data.py)
const KCET_RESOURCE_SLUGS: Record<string, string> = {
  "kcet-pattern": "KCET Exam Pattern & Marking Scheme",
  "kcet-cutoffs": "KCET Engineering & Medical Cutoffs",
  "kcet-latest-news": "KCET Latest News & Notifications",
  "kcet-mock-papers": "KCET Mock Papers",
  "kcet-question-bank": "KCET Question Bank",
  "kcet-question-papers": "KCET Question Papers",
  "kcet-revision-notes": "KCET Revision Notes",
  "kcet-solved-papers": "KCET Solved Papers",
};

interface KcetSubpageProps {
  slug: string;
  subType?: string;
}

export function KcetSubpage({ slug }: KcetSubpageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);
  const resources = getResources(slug);
  const displayTitle = meta?.displayTitle || meta?.title || KCET_RESOURCE_SLUGS[slug] || slug.replace(/-/g, ' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={displayTitle}
        description={meta?.description}
        breadcrumbs={breadcrumbs}
      />

      {resources.length > 0 ? (
        <div className="grid gap-3">
          {resources.map((resource, idx) => (
            <ResourceCard key={`${resource.fileId}-${idx}`} resource={resource} />
          ))}
        </div>
      ) : (
        <ComingSoon
          title={displayTitle}
          description={meta?.description || `High-yielding KCET study materials, chapter-wise MCQs, and cut-off analyses for ${displayTitle} are currently being compiled.`}
          category="KCET Exam Material"
          estimatedLaunch="KCET 2026 Season"
          progress={75}
          backLink={{ href: "/kcet", label: "Back to KCET Home" }}
        />
      )}
    </div>
  );
}

