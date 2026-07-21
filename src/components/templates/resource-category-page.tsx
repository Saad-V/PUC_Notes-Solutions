import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import {
  getSubjectBySlug, buildCategoryBreadcrumbs,
  getResourcesForCategory, getCategoryMeta,
} from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { getIcon } from "@/components/icon-map";

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

  const Icon = catMeta ? getIcon(catMeta.icon) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        breadcrumbs={breadcrumbs}
      />

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
      {Icon && catMeta && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-muted/50 rounded-lg border">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">{catMeta.title}</p>
            <p className="text-sm text-muted-foreground">
              {resources.length} {resources.length === 1 ? 'resource' : 'resources'} available
            </p>
          </div>
        </div>
      )}

      {/* PDF list */}
      {resources.length > 0 ? (
        <div className="grid gap-3">
          {resources.map((resource, idx) => (
            <ResourceCard key={`${resource.fileId}-${idx}`} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No resources currently available in this category.</p>
        </div>
      )}
    </div>
  );
}
