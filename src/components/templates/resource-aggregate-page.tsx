import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { ComingSoon } from "@/components/coming-soon";
import {
  getResourcesByType, getMetadata, buildBreadcrumbs,
} from "@/lib/data";
import type { ResourceData } from "@/lib/types";

interface ResourceAggregatePageProps {
  slug: string;
  resourceType: string;
  classId?: string;
}

export function ResourceAggregatePage({ slug, resourceType }: ResourceAggregatePageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);
  const allResources = getResourcesByType(resourceType);

  // Group resources by subject
  const bySubject = allResources.reduce((acc, r) => {
    const subjectName = r.subject || 'Other';
    if (!acc[subjectName]) acc[subjectName] = [];
    acc[subjectName].push(r);
    return acc;
  }, {} as Record<string, ResourceData[]>);

  const sortedSubjects = Object.keys(bySubject).sort();
  const title = meta?.displayTitle || meta?.title || slug.replace(/-/g, ' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={title}
        description={meta?.description}
        breadcrumbs={breadcrumbs}
      />

      {sortedSubjects.length > 0 ? (
        <div className="space-y-10">
          {sortedSubjects.map((subjectName) => (
            <section key={subjectName}>
              <h2 className="text-xl font-bold border-b pb-2 mb-4">
                {subjectName}
              </h2>
              <div className="grid gap-3">
                {bySubject[subjectName].map((resource, idx) => (
                  <ResourceCard key={`${resource.fileId}-${idx}`} resource={resource} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <ComingSoon
          title={title}
          description={meta?.description || `Aggregate collection for ${title} is currently under compilation.`}
          category="Resource Collection"
          estimatedLaunch="Coming Soon"
          progress={70}
          backLink={{ href: "/", label: "Back to Home" }}
        />
      )}
    </div>
  );
}

