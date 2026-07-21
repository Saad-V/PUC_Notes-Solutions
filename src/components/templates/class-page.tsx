import { PageHeader } from "@/components/page-header";
import { StreamCard } from "@/components/stream-card";
import { SubjectCard } from "@/components/subject-card";
import { SectionGrid } from "@/components/section-grid";
import {
  getClass, getStreamsByClass, getSubjectsByClass,
  getMetadata, getResources, buildBreadcrumbs,
} from "@/lib/data";
import type { ClassData } from "@/lib/types";

interface ClassPageProps {
  classData: ClassData;
  slug: string;
}

export function ClassPage({ classData, slug }: ClassPageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);
  const streams = getStreamsByClass(classData.id);
  const subjects = getSubjectsByClass(classData.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={meta?.title || `${classData.name} Resources`}
        description={meta?.description}
        breadcrumbs={breadcrumbs}
      />

      {/* Streams Section */}
      {streams.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">
            Choose Your Stream
          </h2>
          <SectionGrid columns={3}>
            {streams.map((stream) => (
              <StreamCard
                key={stream.id}
                name={stream.name}
                slug={stream.slugs[0]}
                subjectCount={stream.subjects.length}
              />
            ))}
          </SectionGrid>
        </section>
      )}

      {/* All Subjects (for classes without streams, like 10th / KCET) */}
      {streams.length === 0 && subjects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">Subjects</h2>
          <SectionGrid columns={3}>
            {subjects.map((subj) => {
              const targetSlug = subj.paperSlug || subj.notesSlug;
              const resources = getResources(targetSlug);
              return (
                <SubjectCard
                  key={subj.id}
                  name={subj.name}
                  slug={targetSlug}
                  resourceCount={resources.length}
                />
              );
            })}
          </SectionGrid>
        </section>
      )}

      {/* Popular Subjects (for classes with streams) */}
      {streams.length > 0 && subjects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold border-b pb-2 mb-6">
            All {classData.name} Subjects
          </h2>
          <SectionGrid columns={4}>
            {subjects.slice(0, 8).map((subj) => {
              const targetSlug = subj.paperSlug || subj.notesSlug;
              return (
                <SubjectCard
                  key={subj.id}
                  name={subj.name}
                  slug={targetSlug}
                />
              );
            })}
          </SectionGrid>
        </section>
      )}
    </div>
  );
}
