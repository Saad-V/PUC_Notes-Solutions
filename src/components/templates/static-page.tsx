import { PageHeader } from "@/components/page-header";
import { getMetadata, buildBreadcrumbs } from "@/lib/data";

interface StaticPageProps {
  slug: string;
}

export function StaticPage({ slug }: StaticPageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={meta?.title || slug.replace(/-/g, ' ')}
        description={meta?.description}
        breadcrumbs={breadcrumbs}
      />

      <div className="prose max-w-3xl">
        <p className="text-muted-foreground">
          Content for this page is coming soon.
        </p>
      </div>
    </div>
  );
}
