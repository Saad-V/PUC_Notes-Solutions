import { PageHeader } from "@/components/page-header";
import { ResourceCategoryCard } from "@/components/resource-category-card";
import { SubjectCard } from "@/components/subject-card";
import { SectionGrid } from "@/components/section-grid";
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
        title={meta?.title || `${subjectData.name}`}
        description={meta?.description || `Browse all ${subjectData.name} study resources — notes, model papers, question banks, and more.`}
        breadcrumbs={breadcrumbs}
      />

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
        <div className="text-center py-12 text-muted-foreground">
          <p>No resources currently available for this subject.</p>
          <p className="text-sm mt-2">
            This page exists in the site index. Resources will be added soon.
          </p>
        </div>
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
