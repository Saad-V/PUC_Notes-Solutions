import { PageHeader } from "@/components/page-header";
import { ResourceCategoryCard } from "@/components/resource-category-card";
import { SubjectCard } from "@/components/subject-card";
import { SectionGrid } from "@/components/section-grid";
import { ComingSoon } from "@/components/coming-soon";
import { AdBanner } from "@/components/ads/ad-banner";
import {
  getMetadata, buildBreadcrumbs,
  getSubjectsByStream, getResourceCategoriesForSubject,
} from "@/lib/data";
import type { SubjectData } from "@/lib/types";

interface SubjectPageProps {
  subjectData: SubjectData;
  slug: string;
  subType: string; // 'papers' or 'notes'
}

export function SubjectPage({ subjectData, slug }: SubjectPageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);
  const categories = getResourceCategoriesForSubject(subjectData.id);

  // Related subjects (same stream, different subject)
  const relatedSubjects = getSubjectsByStream(subjectData.streamId)
    .filter(s => s.id !== subjectData.id)
    .slice(0, 6);

  const totalResources = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={meta?.displayTitle || meta?.title || `${subjectData.name}`}
        description={meta?.description || `Browse all ${subjectData.name} study resources — notes, model papers, question banks, and more.`}
        breadcrumbs={breadcrumbs}
      />

      {/* In-Feed Banner Ad */}
      <AdBanner slot="4433221100" format="horizontal" className="my-4" />

      {/* Resource Dashboard */}
      {categories.length > 0 ? (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-b pb-2">
              Available Resources
            </h2>
            <span className="text-sm text-muted-foreground">
              {totalResources} total {totalResources === 1 ? 'resource' : 'resources'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <ResourceCategoryCard
                key={category.id}
                category={category}
                parentSlug={slug}
              />
            ))}
          </div>
        </section>
      ) : (
        <ComingSoon
          title={`${subjectData.name} Resources`}
          description={`Verified study notes, blueprints, solved papers, and textbook solutions for ${subjectData.name} are currently being compiled.`}
          category="Subject Resources"
          estimatedLaunch="Upcoming Update"
          progress={80}
          backLink={{ href: "/", label: "Back to Home" }}
        />
      )}

      {/* Related Subjects */}
      {relatedSubjects.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Related Subjects</h2>
          <SectionGrid columns={3}>
            {relatedSubjects.map((subj) => (
              <SubjectCard
                key={subj.id}
                name={subj.name}
                slug={subj.paperSlug || subj.notesSlug}
              />
            ))}
          </SectionGrid>
        </section>
      )}
    </div>
  );
}
