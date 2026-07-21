import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { SubjectCard } from "@/components/subject-card";
import { SectionGrid } from "@/components/section-grid";
import {
  getClass, getResources, getMetadata, buildBreadcrumbs,
} from "@/lib/data";

// KCET sub-page slug definitions (same as generate_data.py)
const KCET_RESOURCE_SLUGS: Record<string, string> = {
  "kcet-mock-papers": "KCET Mock Papers",
  "kcet-question-bank": "KCET Question Bank",
  "kcet-question-papers": "KCET Question Papers",
  "kcet-revision-notes": "KCET Revision Notes",
  "kcet-solved-papers": "KCET Solved Papers",
};

interface KcetSubpageProps {
  slug: string;
  subType: string;
}

export function KcetSubpage({ slug, subType }: KcetSubpageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);
  const resources = getResources(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={meta?.title || KCET_RESOURCE_SLUGS[slug] || slug.replace(/-/g, ' ')}
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
        <div className="text-center py-12 text-muted-foreground">
          <p>Content for this page is coming soon.</p>
        </div>
      )}
    </div>
  );
}
