import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { ComingSoon } from "@/components/coming-soon";
import {
  getSubjectBySlug, buildCategoryBreadcrumbs,
  getResourcesForCategory, getCategoryMeta,
} from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { renderIcon } from "@/components/icon-map";

interface ResourceCategoryPageProps {
  subjectSlug: string;
  categorySlug: string;
}

export function ResourceCategoryPage({ subjectSlug, categorySlug }: ResourceCategoryPageProps) {
  const subject = getSubjectBySlug(subjectSlug);
  const catMeta = getCategoryMeta(categorySlug);
  const breadcrumbs = buildCategoryBreadcrumbs(subjectSlug, categorySlug);
  const resources = subject
    ? getResourcesForCategory(subject.id, categorySlug)
    : [];

  const pageTitle = catMeta
    ? `${subject?.name || ''} ${catMeta.title}`.trim()
    : categorySlug.replace(/-/g, ' ');

  const pageDescription = catMeta?.description || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={breadcrumbs}
      />

      {/* PDF list */}
      {resources.length > 0 ? (
        <>
          {/* Back to subject dashboard */}
          <div className="mb-6">
            <Link
              href={`/${subjectSlug}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {subject?.name || 'subject'} resources
            </Link>
          </div>

          {/* Category header with icon */}
          {catMeta && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg border">
              <div className="rounded-lg bg-primary/10 p-2.5">
                {renderIcon(catMeta.icon, "h-5 w-5 text-primary")}
              </div>
              <div>
                <p className="font-semibold">{catMeta.title}</p>
                <p className="text-sm text-muted-foreground">
                  {resources.length} {resources.length === 1 ? 'resource' : 'resources'} available
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-3">
            {resources.map((resource, idx) => (
              <ResourceCard key={`${resource.fileId}-${idx}`} resource={resource} />
            ))}
          </div>
        </>
      ) : (
        <ComingSoon
          title={pageTitle}
          description={`PDF downloads and study material for ${pageTitle} are currently being processed and prepared.`}
          category={catMeta?.title || "Resource Category"}
          estimatedLaunch="Coming Soon"
          progress={80}
          backLink={{ href: `/${subjectSlug}`, label: `Back to ${subject?.name || 'Subject'} Resources` }}
        />
      )}
    </div>
  );
}

