import { PageHeader } from "@/components/page-header";
import { ComingSoon } from "@/components/coming-soon";
import { getMetadata, buildBreadcrumbs } from "@/lib/data";

interface StaticPageProps {
  slug: string;
}

const STATIC_TITLE_MAP: Record<string, string> = {
  about: "About PUC Notes",
  contact: "Contact Us",
  "privacy-policy": "Privacy Policy",
  "terms-conditions": "Terms & Conditions",
  "content-updates": "Content Updates & Syllabus",
  menu: "Navigation Menu",
};

export function StaticPage({ slug }: StaticPageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);
  const displayTitle = meta?.displayTitle || meta?.title || STATIC_TITLE_MAP[slug] || slug.replace(/-/g, ' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={displayTitle}
        description={meta?.description}
        breadcrumbs={breadcrumbs}
      />

      <ComingSoon
        title={displayTitle}
        description={meta?.description || `The official ${displayTitle} information page is currently being compiled and will be published shortly.`}
        category="Static Info"
        estimatedLaunch="Updating Soon"
        progress={90}
        backLink={{ href: "/", label: "Back to Home" }}
      />
    </div>
  );
}

