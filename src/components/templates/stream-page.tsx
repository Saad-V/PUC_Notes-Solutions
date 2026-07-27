import { PageHeader } from "@/components/page-header";
import { SubjectCard } from "@/components/subject-card";
import { SectionGrid } from "@/components/section-grid";
import {
  getSubject, getResources,
  getMetadata, buildBreadcrumbs,
} from "@/lib/data";
import type { StreamData } from "@/lib/types";

interface StreamPageProps {
  streamData: StreamData;
  slug: string;
}

export function StreamPage({ streamData, slug }: StreamPageProps) {
  const meta = getMetadata(slug);
  const breadcrumbs = buildBreadcrumbs(slug);

  // Resolve subjects with their resource counts
  const subjectsWithCounts = streamData.subjects.map((subjId) => {
    const subj = getSubject(subjId);
    if (!subj) return null;
    const paperResources = getResources(subj.paperSlug);
    const notesResources = getResources(subj.notesSlug);
    const totalResources = paperResources.length + notesResources.length;
    return { subject: subj, totalResources };
  }).filter(Boolean) as { subject: NonNullable<ReturnType<typeof getSubject>>; totalResources: number }[];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={meta?.displayTitle || meta?.title || `${streamData.name} Stream`}
        description={meta?.description}
        breadcrumbs={breadcrumbs}
      />

      <section className="mb-12">
        <h2 className="text-2xl font-bold border-b pb-2 mb-6">Subjects</h2>
        <SectionGrid columns={3}>
          {subjectsWithCounts.map(({ subject, totalResources }) => (
            <SubjectCard
              key={subject.id}
              name={subject.name}
              slug={subject.paperSlug || subject.notesSlug}
              resourceCount={totalResources}
            />
          ))}
        </SectionGrid>
      </section>
    </div>
  );
}
